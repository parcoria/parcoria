// api/restore-access.js — Vercel Serverless Function
// Looks up a Stripe payment by email and confirms access
// Called when a user wants to restore access after clearing their browser data

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

    // Search for successful checkout sessions with this email
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email: email.toLowerCase().trim() },
      limit: 10,
    })

    const validSession = sessions.data.find(s =>
      s.payment_status === 'paid' &&
      s.status === 'complete'
    )

    if (validSession) {
      return res.status(200).json({
        success: true,
        message: 'Payment confirmed — access restored',
        sessionId: validSession.id,
        metadata: validSession.metadata || {},
      })
    }

    // Also check by searching payment intents directly
    const customers = await stripe.customers.list({
      email: email.toLowerCase().trim(),
      limit: 5,
    })

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 10,
      })
      const paid = paymentIntents.data.find(pi => pi.status === 'succeeded')
      if (paid) {
        return res.status(200).json({
          success: true,
          message: 'Payment confirmed — access restored',
        })
      }
    }

    return res.status(200).json({
      success: false,
      message: 'No completed payment found for this email address. Please check the email you used during checkout, or contact hello@parcoria.com.',
    })

  } catch (err) {
    console.error('Restore access error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
