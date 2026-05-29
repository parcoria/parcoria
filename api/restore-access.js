// api/restore-access.js — Vercel Serverless Function
// Looks up Stripe payment/subscription by email
// Returns the correct tier so client can grant the right access level

import Stripe from 'stripe'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  const { email } = body || {}
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' })
  }

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })
    const cleanEmail = email.toLowerCase().trim()

    // Step 1 — find customer by email
    const customers = await stripe.customers.list({ email: cleanEmail, limit: 5 })

    if (customers.data.length > 0) {
      for (const customer of customers.data) {

        // Step 2 — check for active Developer subscription first (highest tier)
        const subs = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 10,
        })
        const devPriceId = process.env.STRIPE_DEVELOPER_PRICE_ID
        const devAnnualPriceId = process.env.STRIPE_DEVELOPER_ANNUAL_PRICE_ID

        const devSub = subs.data.find(s =>
          s.items.data.some(i =>
            i.price.id === devPriceId || i.price.id === devAnnualPriceId
          )
        )

        if (devSub) {
          return res.status(200).json({
            success: true,
            tier: 'developer',
            message: 'Active Developer subscription confirmed — access restored',
          })
        }

        // Step 3 — check for completed homeowner one-time payment
        const sessions = await stripe.checkout.sessions.list({
          customer: customer.id,
          limit: 20,
        })

        const paidSession = sessions.data.find(s =>
          s.payment_status === 'paid' &&
          s.status === 'complete' &&
          s.mode === 'payment' // one-time, not subscription
        )

        if (paidSession) {
          return res.status(200).json({
            success: true,
            tier: 'homeowner',
            message: 'Payment confirmed — access restored',
          })
        }
      }
    }

    // Step 4 — try session lookup by email directly (no customer record)
    const sessions = await stripe.checkout.sessions.list({ limit: 100 })
    const matchByEmail = sessions.data.find(s =>
      s.customer_details?.email?.toLowerCase() === cleanEmail &&
      s.payment_status === 'paid' &&
      s.status === 'complete'
    )

    if (matchByEmail) {
      const tier = matchByEmail.metadata?.tier === 'developer' ? 'developer' : 'homeowner'
      return res.status(200).json({
        success: true,
        tier,
        message: 'Payment confirmed — access restored',
      })
    }

    return res.status(200).json({
      success: false,
      tier: null,
      message: 'No completed payment found for this email address. Please check the email used at checkout, or contact support@parcoria.com.',
    })

  } catch (err) {
    console.error('Restore access error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
