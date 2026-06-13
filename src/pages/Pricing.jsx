import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout, startContractorCheckout, startDeveloperCheckout } from '../lib/checkout'
import { isDeveloper, hasAccess, isContractor } from '../lib/access'
import { t, useLang } from '../lib/i18n'

const FEATURES_HOMEOWNER = [
  'Full permit wizard — one project',
  'Buildability check + live FEMA flood data',
  'AI Concierge — 30 days access',
  'Plan Pre-Check questionnaire',
  'Shareable roadmap URL',
  'Week-by-week action plan',
  'Email support',
]

const FEATURES_CONTRACTOR = [
  'Contractor profile — license, insurance, bond saved once',
  'Client job tracker — all permits across all jobs',
  'Lifecycle tracker — stage every permit through to CO',
  '6 client communication templates',
  'Full permit wizard — unlimited jobs',
  'AI Concierge — permanent access',
  'Plan Pre-Check — unlimited (Stage 1 + PDF review)',
  'Evidence vault — document storage per project',
]

const FEATURES_DEVELOPER = [
  'Everything in Contractor',
  'Multi-project portfolio dashboard',
  'Contractor network — build and manage your sub list',
  'Plan Pre-Check — unlimited (Stage 1 + PDF review)',
  'Project history vault — permanent',
  'Weekly permit digest email',
  'Priority support — 24hr response',
]

function CheckIcon({ brand = false }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${brand ? 'text-brand-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function BillingToggle({ billing, setBilling, monthlySavings }) {
  return (
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
        <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">Save ${monthlySavings}</span>
      </button>
    </div>
  )
}

export default function Pricing() {
  useLang()
  const [homeownerLoading, setHomeownerLoading] = useState(false)
  const [contractorLoading, setContractorLoading] = useState(false)
  const [developerLoading, setDeveloperLoading] = useState(false)
  const [homeownerEmail, setHomeownerEmail] = useState('')
  const [contractorEmail, setContractorEmail] = useState('')
  const [developerEmail, setDeveloperEmail] = useState('')
  const [contractorBilling, setContractorBilling] = useState('monthly')
  const [developerBilling, setDeveloperBilling] = useState('monthly')
  const [error, setError] = useState('')

  // Contractor: $149/mo × 12 = $1,788 vs $1,499/yr → save $289
  // Developer:  $299/mo × 12 = $3,588 vs $2,999/yr → save $589
  const contractorAnnualSavings = (149 * 12) - 1499   // 289
  const developerAnnualSavings  = (299 * 12) - 2999   // 589

  async function handleHomeowner() {
    setHomeownerLoading(true); setError('')
    try { await startCheckout({ email: homeownerEmail }) }
    catch { setError('Something went wrong. Please try again.'); setHomeownerLoading(false) }
  }

  async function handleContractor() {
    setContractorLoading(true); setError('')
    try { await startContractorCheckout(contractorEmail, contractorBilling) }
    catch { setError('Something went wrong. Please try again.'); setContractorLoading(false) }
  }

  async function handleDeveloper() {
    setDeveloperLoading(true); setError('')
    try { await startDeveloperCheckout(developerEmail, developerBilling) }
    catch { setError('Something went wrong. Please try again.'); setDeveloperLoading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Pay per project or go unlimited</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          One roadmap for a single build, or a full platform for every permit you pull.
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
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('price_homeowner')}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">First-time builders and owner-builders navigating permits for a single project.</p>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-semibold text-gray-900">$149</span>
            <span className="text-gray-400 text-sm">{t('price_one_time')} · per project</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">No subscription. No renewal. Pay once.</p>

          <label className="text-xs font-medium text-gray-600 block mb-1.5">Your email</label>
          <input type="email" value={homeownerEmail} onChange={e => setHomeownerEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4" />

          <button onClick={handleHomeowner} disabled={homeownerLoading}
            className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 mb-4">
            {homeownerLoading ? 'Redirecting...' : t('price_get_started') + ' — $149 ↗'}
          </button>

          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            {FEATURES_HOMEOWNER.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckIcon />
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contractor */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('price_contractor')}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Licensed NC contractors managing permits across multiple client jobs.</p>
          </div>

          <BillingToggle billing={contractorBilling} setBilling={setContractorBilling} monthlySavings={contractorAnnualSavings} />

          <div className="flex items-baseline gap-2 mb-1">
            {contractorBilling === 'monthly' ? (
              <>
                <span className="text-4xl font-semibold text-gray-900">$149</span>
                <span className="text-gray-400 text-sm">{t('price_month')}</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-semibold text-gray-900">$1,499</span>
                <span className="text-gray-400 text-sm">/year</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-5">
            {contractorBilling === 'monthly'
              ? 'Cancel anytime · switch to annual to save $289/year'
              : 'Equivalent to $125/month · save 2 months · cancel anytime'}
          </p>

          <label className="text-xs font-medium text-gray-600 block mb-1.5">Your email</label>
          <input type="email" value={contractorEmail} onChange={e => setContractorEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3" />

          <button onClick={handleContractor} disabled={contractorLoading}
            className="w-full py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 mb-4">
            {contractorLoading ? 'Redirecting...' : contractorBilling === 'annual' ? 'Start Contractor — $1,499/yr ↗' : 'Start Contractor — $149/mo ↗'}
          </button>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            {FEATURES_CONTRACTOR.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckIcon />
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
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('price_developer')}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Small residential developers building 3–15 homes/year across the Triangle.</p>
          </div>

          <BillingToggle billing={developerBilling} setBilling={setDeveloperBilling} monthlySavings={developerAnnualSavings} />

          <div className="flex items-baseline gap-2 mb-1">
            {developerBilling === 'monthly' ? (
              <>
                <span className="text-4xl font-semibold text-gray-900">$299</span>
                <span className="text-gray-400 text-sm">{t('price_month')}</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-semibold text-gray-900">$2,999</span>
                <span className="text-gray-400 text-sm">/year</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {developerBilling === 'monthly'
              ? 'Cancel anytime · switch to annual to save $589/year'
              : 'Equivalent to $250/month · save 2 months · cancel anytime'}
          </p>

          <label className="text-xs font-medium text-gray-600 block mb-1.5">Your email</label>
          <input type="email" value={developerEmail} onChange={e => setDeveloperEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4" />

          <button onClick={handleDeveloper} disabled={developerLoading}
            className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 mb-4">
            {developerLoading ? 'Redirecting...' : developerBilling === 'annual' ? 'Start Developer — $2,999/yr ↗' : 'Start Developer — $299/mo ↗'}
          </button>

          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            {FEATURES_DEVELOPER.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckIcon brand />
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {error && <p className="text-xs text-red-500 text-center mb-6">{error}</p>}

      <div className="text-center mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {!hasAccess() && (
          <Link to="/wizard" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Try the permit wizard free first ↗
          </Link>
        )}
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
          { q: 'What jurisdictions are covered?', a: 'All 10 Research Triangle jurisdictions: Raleigh, Durham, Chapel Hill, Cary, Apex, Holly Springs, Wake Forest, Morrisville, Garner, and Fuquay-Varina.' },
          { q: 'Can I cancel my subscription?', a: 'Yes — cancel anytime from your Stripe billing portal. You retain access until the end of your current billing period.' },
          { q: 'What happens to my projects if I cancel?', a: 'Your project data is retained for 90 days after cancellation. You can export or reactivate within that window.' },
          { q: 'Does the Homeowner AI Concierge really expire after 30 days?', a: 'Yes. Most permit processes resolve within 30 days. If you need longer, purchase a second project or upgrade to Contractor.' },
          { q: 'What\'s the difference between Contractor and Developer?', a: 'Contractor is built for pulling permits on client jobs. Developer adds portfolio-level tracking across your own projects, a managed contractor network, and weekly digest emails.' },
          { q: 'Can I get a refund?', a: 'Homeowner: yes within 7 days if unused. Contractor/Developer: prorated refund within 7 days of first charge. Contact support@parcoria.com.' },
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
