// PaywallInline.jsx
// Compact paywall shown inline over the blurred permit preview
// No tier selection — just email + buy button for homeowner $79

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../lib/checkout'

export default function PaywallInline({ jurisdiction, proj, addr }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleBuy() {
    setLoading(true)
    setError('')
    try {
      await startCheckout({ jurisdiction, proj, addr, email })
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleBuy()}
        placeholder="your@email.com"
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-2"
      />
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Unlock full roadmap — $79 ↗'}
      </button>
      {error && <p className="text-xs text-red-500 text-center mt-1.5">{error}</p>}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Link to="/pricing" className="text-xs text-gray-400 hover:text-gray-600">
          See all plans
        </Link>
        <Link to="/restore" className="text-xs text-brand-600 hover:text-brand-700">
          Already paid? ↗
        </Link>
      </div>
    </div>
  )
}
