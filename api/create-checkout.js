// api/create-checkout.js — Vercel Serverless Function
// Creates a Stripe Checkout session for Parcoria Homeowner Access ($79)
// Reads STRIPE_SECRET_KEY and STRIPE_PRICE_ID from environment variables

import Stripe from 'stripe'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID

  if (!stripeKey) {
    console.error('STRIPE_SECRET_KEY not found in process.env')
    return res.status(500).json({ error: 'Stripe not configured — check environment variables' })
  }
  if (!priceId) {
    console.error('STRIPE_PRICE_ID not found in process.env')
    return res.status(500).json({ error: 'Stripe price not configured — check environment variables' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  const { jurisdiction, proj, addr, email } = body || {}

  const PROJ_LABELS = {
    sfh: 'New single-family home', adu: 'Accessory dwelling unit',
    addition: 'Addition', deck: 'Deck or porch', reno: 'Major renovation',
    pool: 'Pool or spa', shed: 'Shed or garage', townhouse: 'Townhouse or duplex',
  }
  const JUR_LABELS = {
    raleigh: 'Raleigh', durham: 'Durham',
    chapelhill: 'Chapel Hill', apex: 'Apex', hollysprings: 'Holly Springs',
  }

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: {
        jurisdiction: jurisdiction || '',
        jurisdiction_label: JUR_LABELS[jurisdiction] || '',
        proj: proj || '',
        proj_label: PROJ_LABELS[proj] || '',
        addr: addr || '',
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&j=${jurisdiction || ''}&p=${proj || ''}`,
      cancel_url: `${req.headers.origin}/wizard`,
      allow_promotion_codes: true,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe session error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
