// api/stripe-webhook.js
// Handles Stripe webhook events for subscription lifecycle
// Vercel serverless — must use raw body for signature verification

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    console.error('Missing Stripe keys')
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })
  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  console.log(`Stripe webhook received: ${event.type}`)

  // Initialize Supabase admin client for logging
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  )

  try {
    switch (event.type) {

      // Subscription cancelled or expired
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const customerId = sub.customer
        const customer = await stripe.customers.retrieve(customerId)
        const email = customer.email

        console.log(`Subscription cancelled for: ${email}`)

        // Log cancellation — localStorage token will expire naturally (max 32 days)
        // For immediate revocation we would need a server-side blocklist
        // For now: log the event, token expires on its own schedule
        await supabase.from('subscription_events').insert({
          event_type: 'subscription_cancelled',
          customer_email: email,
          customer_id: customerId,
          subscription_id: sub.id,
          occurred_at: new Date().toISOString(),
        }).select()

        break
      }

      // Payment failed — warn the user
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer
        const customer = await stripe.customers.retrieve(customerId)
        const email = customer.email

        console.log(`Payment failed for: ${email}`)

        await supabase.from('subscription_events').insert({
          event_type: 'payment_failed',
          customer_email: email,
          customer_id: customerId,
          subscription_id: invoice.subscription,
          occurred_at: new Date().toISOString(),
        }).select()

        break
      }

      // Subscription renewed successfully
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        if (invoice.billing_reason === 'subscription_cycle') {
          const customerId = invoice.customer
          const customer = await stripe.customers.retrieve(customerId)
          console.log(`Subscription renewed for: ${customer.email}`)
        }
        break
      }

      // New checkout completed — secondary confirmation
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log(`Checkout completed: ${session.customer_email} — tier: ${session.metadata?.tier || 'homeowner'}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message)
    // Return 200 anyway — Stripe retries on non-200 responses
  }

  return res.status(200).json({ received: true })
}
