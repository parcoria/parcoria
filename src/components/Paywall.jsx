import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../lib/checkout'

export default function Paywall({ jurisdiction, proj, addr }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function handleBuy() {
    setLoading(true)
    setError('')
    try {
      await startCheckout({ jurisdiction, proj, addr, email })
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const PROJ_LABELS = {
    sfh: 'new single-family home', adu: 'ADU', addition: 'addition',
    deck: 'deck or porch', reno: 'renovation', pool: 'pool or spa',
    shed: 'shed or garage', townhouse: 'townhouse',
  }
  const JUR_LABELS = {
    raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
    apex: 'Apex', hollysprings: 'Holly Springs',
  }

  const projLabel = PROJ_LABELS[proj] || proj || 'your project'
  const jurLabel = JUR_LABELS[jurisdiction] || jurisdiction || 'the Triangle'

  return (
    <div className="border-2 border-brand-200 rounded-2xl overflow-hidden bg-white">

      {/* Header */}
      <div className="bg-brand-600 px-6 py-5 text-center">
        <div className="text-white text-lg font-semibold mb-1">
          Unlock your full permit roadmap
        </div>
        <div className="text-brand-200 text-sm">
          {proj && jurisdiction
            ? `${projLabel} · ${jurLabel}`
            : 'Research Triangle, NC'
          }
        </div>
      </div>

      {/* What they're getting */}
      <div className="px-6 py-5 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          What you unlock for $79
        </p>
        {[
          { icon: '📋', label: 'Your full permit roadmap', desc: 'Every permit required, in the right sequence, with fees and timelines' },
          { icon: '👷', label: 'Licensed professionals required', desc: 'Exactly who NC law requires for your project and why' },
          { icon: '🤖', label: 'AI Concierge — 30 days', desc: 'Ask anything about your permits, contractors, or timeline' },
          { icon: '✅', label: 'Plan Pre-Check Engine', desc: 'AI compliance review before you submit — catch issues early' },
          { icon: '🔗', label: 'Shareable roadmap URL', desc: 'Send your full plan to your contractor, lender, or co-owner' },
          { icon: '📅', label: 'Week-by-week action plan', desc: 'From empty lot to certificate of occupancy' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 mb-3">
            <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <div className="text-sm font-medium text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout */}
      <div className="px-6 py-5">
        <div className="flex items-baseline gap-2 mb-4 justify-center">
          <span className="text-3xl font-semibold text-gray-900">$79</span>
          <span className="text-gray-400 text-sm">one-time · no subscription</span>
        </div>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
        />

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 mb-2"
        >
          {loading ? 'Redirecting to checkout...' : 'Get full access — $79 ↗'}
        </button>

        {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}

        <p className="text-xs text-gray-400 text-center">
          Secure payment via Stripe · Receipt emailed instantly
        </p>

        <div className="border-t border-gray-100 mt-4 pt-4 text-center">
          <p className="text-xs text-gray-400">
            Already paid on another device?{' '}
            <Link to="/restore" className="text-brand-600 hover:text-brand-700">
              Restore access ↗
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
