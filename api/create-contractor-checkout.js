// api/create-contractor-checkout.js
// Stripe Checkout for Contractor Mode — $149/month recurring

import Stripe from 'stripe'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_CONTRACTOR_PRICE_ID

  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' })
  if (!priceId) return res.status(500).json({ error: 'Contractor price not configured — add STRIPE_CONTRACTOR_PRICE_ID to environment variables' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  const { email } = body || {}

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: { tier: 'contractor' },
      success_url: `${req.headers.origin}/success?tier=contractor&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      allow_promotion_codes: true,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Contractor checkout error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
