// src/lib/checkout.js
// Unified checkout helper — routes all tiers through /api/checkout

async function checkout(body) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Checkout API not reachable — run vercel dev locally')
  }
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.url) throw new Error('No checkout URL returned')
  window.location.href = data.url
}

// Homeowner — one-time payment
export async function startCheckout({ jurisdiction, proj, addr, email }) {
  return checkout({ tier: 'homeowner', jurisdiction, proj, addr, email })
}

// Contractor — monthly or annual subscription
export async function startContractorCheckout(email, billing = 'monthly') {
  return checkout({ tier: 'contractor', email, billing })
}

// Developer — monthly or annual subscription
export async function startDeveloperCheckout(email, billing = 'monthly') {
  return checkout({ tier: 'developer', email, billing })
}
