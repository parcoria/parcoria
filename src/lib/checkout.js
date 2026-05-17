// src/lib/checkout.js
// Initiates Stripe Checkout for Parcoria Homeowner Access ($79 one-time)

export async function startCheckout({ jurisdiction, proj, addr, email }) {
  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jurisdiction, proj, addr, email }),
    })

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('Checkout API not reachable — run vercel dev locally')
    }

    const data = await res.json()
    if (data.error) throw new Error(data.error)
    if (!data.url) throw new Error('No checkout URL returned from Stripe')

    window.location.href = data.url
  } catch (err) {
    console.error('Checkout error:', err.message)
    throw err
  }
}
