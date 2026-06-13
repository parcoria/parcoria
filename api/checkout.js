// api/checkout.js
// Unified Stripe Checkout handler — replaces three separate checkout files:
//   create-checkout.js          → tier: homeowner (one-time payment)
//   create-contractor-checkout  → tier: contractor (monthly or annual)
//   create-developer-checkout   → tier: developer  (monthly or annual)
//
// Called with POST { tier, email, billing, jurisdiction, proj, addr }
// Callers in src/lib/checkout.js, Pricing.jsx

import Stripe from 'stripe'

const PROJ_LABELS = {
  sfh: 'New single-family home', adu: 'Accessory dwelling unit',
  addition: 'Addition', deck: 'Deck or porch', reno: 'Major renovation',
  pool: 'Pool or spa', shed: 'Shed or garage', townhouse: 'Townhouse or duplex',
}
const JUR_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
  apex: 'Apex', hollysprings: 'Holly Springs', wakeforest: 'Wake Forest',
  morrisville: 'Morrisville', garner: 'Garner', fuquayvarina: 'Fuquay-Varina', cary: 'Cary',
}

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

  const { tier = 'homeowner', email, billing = 'monthly', jurisdiction, proj, addr } = body || {}

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })
    let session

    if (tier === 'homeowner') {
      const priceId = process.env.STRIPE_PRICE_ID
      if (!priceId) return res.status(500).json({ error: 'Homeowner price not configured — add STRIPE_PRICE_ID' })

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email || undefined,
        metadata: {
          tier: 'homeowner',
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

    } else if (tier === 'contractor') {
      const monthlyPriceId = process.env.STRIPE_CONTRACTOR_PRICE_ID
      const annualPriceId  = process.env.STRIPE_CONTRACTOR_ANNUAL_PRICE_ID
      if (!monthlyPriceId) return res.status(500).json({ error: 'Contractor price not configured — add STRIPE_CONTRACTOR_PRICE_ID' })

      const priceId = billing === 'annual' && annualPriceId ? annualPriceId : monthlyPriceId

      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email || undefined,
        metadata: { tier: 'contractor', billing },
        success_url: `${req.headers.origin}/success?tier=contractor&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        allow_promotion_codes: true,
      })

    } else if (tier === 'developer') {
      const monthlyPriceId = process.env.STRIPE_DEVELOPER_PRICE_ID
      const annualPriceId  = process.env.STRIPE_DEVELOPER_ANNUAL_PRICE_ID
      if (!monthlyPriceId) return res.status(500).json({ error: 'Developer price not configured — add STRIPE_DEVELOPER_PRICE_ID' })

      const priceId = billing === 'annual' && annualPriceId ? annualPriceId : monthlyPriceId

      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email || undefined,
        metadata: { tier: 'developer', billing },
        success_url: `${req.headers.origin}/success?tier=developer&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        allow_promotion_codes: true,
      })

    } else {
      return res.status(400).json({ error: `Unknown tier: ${tier}` })
    }

    return res.status(200).json({ url: session.url })

  } catch (err) {
    console.error('Checkout error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
