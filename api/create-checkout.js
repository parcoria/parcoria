// api/create-checkout.js — Vercel Serverless Function
// Creates a Stripe Checkout session for Parcoria project access ($99)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' })

  const { jurisdiction, proj, addr } = req.body || {}

  try {
    const stripe = await import('stripe').then(m => m.default(stripeKey))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 9900, // $99.00
            product_data: {
              name: 'Parcoria Project Access',
              description: `Full permit roadmap, AI Concierge, and plan pre-check for your ${proj || 'construction'} project in ${jurisdiction || 'the Triangle'}`,
              images: ['https://parcoria.com/og-image.png'],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        jurisdiction: jurisdiction || '',
        proj: proj || '',
        addr: addr || '',
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/wizard`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
