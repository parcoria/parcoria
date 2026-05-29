import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../lib/checkout'
import { isDeveloper, hasAccess, isContractor } from '../lib/access'

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
  'Multi-project dashboard',
  'AI Concierge — permanent access',
  'Plan Pre-Check — unlimited submissions',
  'Project history vault — permanent',
  'Priority support — 24hr response',
]

async function startContractorCheckout(email) {
  const res = await fetch('/api/create-contractor-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.url) throw new Error('No checkout URL')
  window.location.href = data.url
}

async function startDeveloperCheckout(email, billing = 'monthly') {
  const res = await fetch('/api/create-developer-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, billing }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.url) throw new Error('No checkout URL')
  window.location.href = data.url
}

export default function Pricing() {
  const [homeownerLoading, setHomeownerLoading] = useState(false)
  const [contractorLoading, setContractorLoading] = useState(false)
  const [developerLoading, setDeveloperLoading] = useState(false)
  const [homeownerEmail, setHomeownerEmail] = useState('')
  const [contractorEmail, setContractorEmail] = useState('')
  const [developerEmail, setDeveloperEmail] = useState('')
  const [billing, setBilling] = useState('monthly') // monthly | annual
  const [error, setError] = useState('')

  async function handleHomeowner() {
    setHomeownerLoading(true)
    setError('')
    try {
      await startCheckout({ email: homeownerEmail })
    } catch {
      setError('Something went wrong. Please try again.')
      setHomeownerLoading(false)
    }
  }

  async function handleContractor() {
    setContractorLoading(true)
    setError('')
    try {
      await startContractorCheckout(contractorEmail)
    } catch {
      setError('Something went wrong. Please try again.')
      setContractorLoading(false)
    }
  }

  async function handleDeveloper() {
    setDeveloperLoading(true)
    setError('')
    try {
      await startDeveloperCheckout(developerEmail, billing)
    } catch {
      setError('Something went wrong. Please try again.')
      setDeveloperLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Simple, honest pricing</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          Start with a single project. Upgrade when you're ready to scale.
        </p>
      </div>

      {/* Active access banners */}
      {isDeveloper() && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div className="text-sm text-brand-700">✓ You have an active Developer subscription</div>
          <Link to="/dashboard" className="text-sm text-brand-600 font-medium hover:text-brand-700">Open dashboard ↗</Link>
        </div>
      )}
      {isContractor() && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div className="text-sm text-green-700">✓ You have an active Contractor subscription</div>
          <a href="/contractor" className="text-sm text-green-600 font-medium hover:text-green-700">Open Contractor Mode ↗</a>
        </div>
      )}
      {!isDeveloper() && !isContractor() && hasAccess() && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
          <div className="text-sm text-green-700">✓ You have active Homeowner access</div>
          <Link to="/wizard" className="text-sm text-green-600 font-medium hover:text-green-700">Go to wizard ↗</Link>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5 mb-12">

        {/* Homeowner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Homeowner</h2>
            <p className="text-sm text-gray-500 leading-relaxed">First-time builders and owner-builders navigating permits for a single project.</p>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-semibold text-gray-900">$79</span>
            <span className="text-gray-400 text-sm">one-time · per project</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">No subscription. No renewal. Pay once.</p>

          <label className="text-xs font-medium text-gray-600 block mb-1.5">Your email</label>
          <input type="email" value={homeownerEmail} onChange={e => setHomeownerEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4" />

          <button onClick={handleHomeowner} disabled={homeownerLoading}
            className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 mb-4">
            {homeownerLoading ? 'Redirecting...' : 'Get started — $79 ↗'}
          </button>

          <div className="border-t border-gray-100 pt-4">
            {FEATURES_HOMEOWNER.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2.5">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contractor */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Contractor</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Licensed NC contractors managing permits across multiple client jobs.</p>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-semibold text-gray-900">$149</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Cancel anytime</p>

          <label className="text-xs font-medium text-gray-600 block mb-1.5">Your email</label>
          <input type="email" value={contractorEmail} onChange={e => setContractorEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3" />

          <button onClick={handleContractor} disabled={contractorLoading}
            className="w-full py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 mb-4">
            {contractorLoading ? 'Redirecting...' : 'Start Contractor — $149/mo ↗'}
          </button>

          <div className="border-t border-gray-100 pt-3">
            {['Contractor profile — license, insurance, bond saved once', 'Client job tracker — all permits across all jobs', '6 client communication templates', 'Full permit wizard — unlimited jobs', 'AI Concierge — permanent access', 'Plan Pre-Check — unlimited'].map((f, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div className="bg-white border-2 border-brand-500 rounded-2xl p-7 relative">
          <div className="absolute -top-3 left-6">
            <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Developer</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Small residential developers building 3–15 homes/year across the Triangle.</p>
          </div>
          {/* Billing toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-4 w-fit">
            <button
              onClick={() => setBilling('monthly')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${billing === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annual
              <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">Save $598</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            {billing === 'monthly' ? (
              <>
                <span className="text-4xl font-semibold text-gray-900">$299</span>
                <span className="text-gray-400 text-sm">/month</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-semibold text-gray-900">$2,990</span>
                <span className="text-gray-400 text-sm">/year</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {billing === 'monthly' ? 'Cancel anytime · switch to annual to save $598/year' : 'Equivalent to $249/month · save 2 months · cancel anytime'}
          </p>

          <label className="text-xs font-medium text-gray-600 block mb-1.5">Your email</label>
          <input type="email" value={developerEmail} onChange={e => setDeveloperEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4" />

          <button onClick={handleDeveloper} disabled={developerLoading}
            className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 mb-4">
            {developerLoading ? 'Redirecting...' : billing === 'annual' ? 'Start Developer — $2,990/yr ↗' : 'Start Developer — $299/mo ↗'}
          </button>

          <div className="border-t border-gray-100 pt-4">
            {FEATURES_DEVELOPER.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2.5">
                <svg className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {error && <p className="text-xs text-red-500 text-center mb-6">{error}</p>}

      <div className="text-center mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link to="/wizard" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Try the permit wizard free first ↗
        </Link>
        <Link to="/restore" className="text-xs text-gray-400 hover:text-gray-600">
          Already paid? Restore your access ↗
        </Link>
        {!hasAccess() && (
          <Link to="/waitlist" className="text-xs text-gray-400 hover:text-gray-600">
            Not ready yet? Join the waitlist ↗
          </Link>
        )}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-base font-semibold text-gray-900 mb-4 text-center">Common questions</h3>
        {[
          { q: 'What counts as one project?', a: 'One property address and one structure type. An ADU on the same property is a separate project.' },
          { q: 'What jurisdictions are covered?', a: 'Raleigh, Durham, Chapel Hill, Apex, and Holly Springs — the full Research Triangle plus the fastest-growing Wake County municipalities.' },
          { q: 'Can I cancel my Developer subscription?', a: 'Yes — cancel anytime from your Stripe billing portal. You retain access until the end of your current billing period.' },
          { q: 'What happens to my projects if I cancel Developer?', a: 'Your project data is retained for 90 days after cancellation. You can export or reactivate within that window.' },
          { q: 'Does the Homeowner AI Concierge really expire after 30 days?', a: 'Yes. Most permit processes resolve within 30 days. If you need longer, purchase a second project or upgrade to Developer.' },
          { q: 'Can I get a refund?', a: 'Homeowner: yes within 7 days if unused. Developer: prorated refund within 7 days of first charge. Contact support@parcoria.com.' },
        ].map((item, i) => (
          <div key={i} className="border-b border-gray-100 py-4">
            <div className="text-sm font-medium text-gray-900 mb-1.5">{item.q}</div>
            <div className="text-sm text-gray-500 leading-relaxed">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
