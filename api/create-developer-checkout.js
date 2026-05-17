// api/create-developer-checkout.js
// Creates a Stripe Checkout session for Developer Access
// Supports both monthly ($299) and annual ($2,990) billing

import Stripe from 'stripe'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const monthlyPriceId = process.env.STRIPE_DEVELOPER_PRICE_ID
  const annualPriceId = process.env.STRIPE_DEVELOPER_ANNUAL_PRICE_ID

  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' })
  if (!monthlyPriceId) return res.status(500).json({ error: 'Developer monthly price not configured' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  const { email, billing = 'monthly' } = body || {}

  // Use annual price if requested and configured, else fall back to monthly
  const priceId = billing === 'annual' && annualPriceId ? annualPriceId : monthlyPriceId

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: { tier: 'developer', billing },
      success_url: `${req.headers.origin}/success?tier=developer&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      allow_promotion_codes: true,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Developer checkout error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
