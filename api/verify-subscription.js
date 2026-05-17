// api/verify-subscription.js
// Checks if an email has an active Developer subscription via Stripe

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
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })

    // Find customer by email
    const customers = await stripe.customers.list({ email: email.toLowerCase().trim(), limit: 5 })
    if (!customers.data.length) {
      return res.status(200).json({ active: false, tier: null })
    }

    // Check for active Developer subscription
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 10,
      })
      const devSub = subs.data.find(s =>
        s.items.data.some(i => i.price.id === process.env.STRIPE_DEVELOPER_PRICE_ID)
      )
      if (devSub) {
        return res.status(200).json({
          active: true,
          tier: 'developer',
          customerId: customer.id,
          subscriptionId: devSub.id,
          currentPeriodEnd: devSub.current_period_end,
        })
      }

      // Check for active homeowner payment
      const sessions = await stripe.checkout.sessions.list({
        customer: customer.id,
        limit: 10,
      })
      const paidSession = sessions.data.find(s => s.payment_status === 'paid' && s.status === 'complete')
      if (paidSession) {
        return res.status(200).json({ active: true, tier: 'homeowner', customerId: customer.id })
      }
    }

    return res.status(200).json({ active: false, tier: null })
  } catch (err) {
    console.error('Verify subscription error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
