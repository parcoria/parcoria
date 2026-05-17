import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../lib/checkout'
import { hasAccess, grantAccess } from '../lib/access'

const FEATURES_HOMEOWNER = [
  'Full permit wizard — one project',
  'Buildability check + live FEMA flood data',
  'AI Concierge — 30 days access',
  'Plan Pre-Check — one submission',
  'Shareable roadmap URL',
  'Week-by-week action plan',
  'Email support',
]

const FEATURES_DEVELOPER = [
  'Everything in Homeowner',
  'Unlimited projects — all 5 jurisdictions',
  'AI Concierge — permanent access',
  'Plan Pre-Check — unlimited submissions',
  'Multi-project dashboard',
  'Project history + evidence vault',
  'Up to 3 team seats',
  'White-label shareable reports',
  'Priority support',
]

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function handleBuy() {
    setLoading(true)
    setError('')
    try {
      await startCheckout({ email })
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Simple, honest pricing</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          Start with a single project. Upgrade when you're ready to scale.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-12">

        {/* Homeowner */}
        <div className="bg-white border-2 border-brand-500 rounded-2xl p-7 relative">
          <div className="absolute -top-3 left-6">
            <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Available now
            </span>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Homeowner</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              First-time builders and owner-builders navigating permits for a single project.
            </p>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-semibold text-gray-900">$79</span>
            <span className="text-gray-400 text-sm">one-time · per project</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">No subscription. No renewal. Pay once.</p>

          <div className="mb-6">
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              Your email <span className="text-gray-400 font-normal">(pre-fills checkout)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 mb-4"
          >
            {loading ? 'Redirecting to checkout...' : 'Get started — $79 ↗'}
          </button>

          {error && <p className="text-xs text-red-500 text-center mb-3">{error}</p>}

          <div className="border-t border-gray-100 pt-4">
            {FEATURES_HOMEOWNER.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2.5">
                <svg className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7 relative">
          <div className="absolute -top-3 left-6">
            <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              Coming soon
            </span>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Developer</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Small residential developers building 3–15 homes/year across the Triangle.
            </p>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-semibold text-gray-900">$299</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">or $2,990/year — save 2 months</p>

          <a
            href="mailto:hello@parcoria.com?subject=Developer tier interest"
            className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-400 transition-colors mb-4 flex items-center justify-center"
          >
            Join the waitlist ↗
          </a>

          <div className="border-t border-gray-200 pt-4">
            {FEATURES_DEVELOPER.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2.5">
                <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 0 ? 'text-gray-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className={`text-sm ${i === 0 ? 'text-gray-400' : 'text-gray-600'}`}>{f}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-base font-semibold text-gray-900 mb-4 text-center">Common questions</h3>
        {[
          { q: 'What counts as one project?', a: 'One property address and one structure type — for example, a new single-family home at 123 Main St. If you\'re building an ADU on the same property, that\'s a separate project.' },
          { q: 'What jurisdictions are covered?', a: 'Raleigh, Durham, Chapel Hill, Apex, and Holly Springs — the full Research Triangle. We\'re expanding to Wake Forest, Morrisville, and Garner next.' },
          { q: 'Does the AI Concierge really expire after 30 days?', a: 'Yes for the Homeowner tier. Most permit processes resolve within 30 days of first inquiry. If you need longer access, you can purchase a second project or contact us.' },
          { q: 'Can I get a refund?', a: 'If you haven\'t used the permit wizard or AI Concierge, yes — contact hello@parcoria.com within 7 days of purchase.' },
          { q: 'Is this a replacement for a permit expediter?', a: 'Parcoria gives you the knowledge and roadmap a permit expediter would give you, at a fraction of the cost. For complex projects you may still want a licensed expediter — we can connect you with one.' },
        ].map((item, i) => (
          <div key={i} className="border-b border-gray-100 py-4">
            <div className="text-sm font-medium text-gray-900 mb-1.5">{item.q}</div>
            <div className="text-sm text-gray-500 leading-relaxed">{item.a}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 flex flex-col gap-3 items-center">
        <Link to="/wizard" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Try the permit wizard free first ↗
        </Link>
        {hasAccess() && (
          <div className="text-xs text-green-600 bg-green-50 border border-green-100 px-4 py-2 rounded-full">
            ✓ You have active access · <Link to="/wizard" className="underline">Go to wizard</Link>
          </div>
        )}
      </div>

    </div>
  )
}
