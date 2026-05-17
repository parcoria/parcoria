import { useState } from 'react'
import { Link } from 'react-router-dom'
import { startCheckout } from '../lib/checkout'

async function startDeveloperCheckout(email, billing = 'monthly') {
  const res = await fetch('/api/create-developer-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, billing }),
  })
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) throw new Error('API not reachable')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.url) throw new Error('No checkout URL')
  window.location.href = data.url
}

const HOMEOWNER_FEATURES = [
  { icon: '📋', label: 'Full permit roadmap', desc: 'Every permit, sequence, fees, and timelines' },
  { icon: '👷', label: 'Licensed professionals', desc: 'Exactly who NC law requires and why' },
  { icon: '🤖', label: 'AI Concierge', desc: '30 days of expert guidance' },
  { icon: '✅', label: 'Plan Pre-Check', desc: 'One AI compliance review' },
  { icon: '🔗', label: 'Shareable roadmap URL', desc: 'Share with your contractor or lender' },
]

const DEVELOPER_FEATURES = [
  { icon: '📊', label: 'Multi-project dashboard', desc: 'All projects across all 5 jurisdictions' },
  { icon: '📋', label: 'Unlimited permit wizards', desc: 'No project limits — ever' },
  { icon: '🤖', label: 'AI Concierge', desc: 'Permanent access — never expires' },
  { icon: '✅', label: 'Plan Pre-Check', desc: 'Unlimited submissions' },
  { icon: '⚡', label: 'Priority support', desc: '24-hour response from the team' },
]

const PROJ_LABELS = {
  sfh: 'new single-family home', adu: 'ADU', addition: 'addition',
  deck: 'deck or porch', reno: 'renovation', pool: 'pool or spa',
  shed: 'shed or garage', townhouse: 'townhouse',
}
const JUR_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
  apex: 'Apex', hollysprings: 'Holly Springs',
}

export default function Paywall({ jurisdiction, proj, addr }) {
  const [selectedTier, setSelectedTier] = useState('homeowner')
  const [billing, setBilling] = useState('monthly')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const projLabel = PROJ_LABELS[proj] || proj || 'your project'
  const jurLabel = JUR_LABELS[jurisdiction] || jurisdiction || 'the Triangle'
  const isDev = selectedTier === 'developer'

  async function handleCheckout() {
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (isDev) {
        await startDeveloperCheckout(email, billing)
      } else {
        await startCheckout({ jurisdiction, proj, addr, email })
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const features = isDev ? DEVELOPER_FEATURES : HOMEOWNER_FEATURES

  return (
    <div className="border-2 border-brand-200 rounded-2xl overflow-hidden bg-white">

      {/* Header */}
      <div className="bg-brand-600 px-6 py-5 text-center">
        <div className="text-white text-lg font-semibold mb-1">Unlock your full permit roadmap</div>
        <div className="text-brand-200 text-sm">
          {proj && jurisdiction ? `${projLabel} · ${jurLabel}` : 'Research Triangle, NC'}
        </div>
      </div>

      <div className="px-6 pt-5">

        {/* Tier selector */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Choose your plan</p>
        <div className="grid grid-cols-2 gap-3 mb-4">

          <button
            onClick={() => setSelectedTier('homeowner')}
            className={`text-left border rounded-xl p-4 transition-all ${selectedTier === 'homeowner' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="mb-1">
              <div className={`text-sm font-semibold ${selectedTier === 'homeowner' ? 'text-brand-700' : 'text-gray-900'}`}>Homeowner</div>
            </div>
            <div className={`text-xs mb-2 ${selectedTier === 'homeowner' ? 'text-brand-500' : 'text-gray-400'}`}>One project</div>
            <div className={`text-xl font-semibold ${selectedTier === 'homeowner' ? 'text-brand-700' : 'text-gray-900'}`}>
              $79 <span className={`text-xs font-normal ${selectedTier === 'homeowner' ? 'text-brand-500' : 'text-gray-400'}`}>one-time</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedTier('developer')}
            className={`text-left border rounded-xl p-4 transition-all ${selectedTier === 'developer' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`text-sm font-semibold ${selectedTier === 'developer' ? 'text-brand-700' : 'text-gray-900'}`}>Developer</div>
              <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-medium leading-none flex-shrink-0">Popular</span>
            </div>
            <div className={`text-xs mb-2 ${selectedTier === 'developer' ? 'text-brand-500' : 'text-gray-400'}`}>Unlimited projects</div>
            <div className={`text-xl font-semibold ${selectedTier === 'developer' ? 'text-brand-700' : 'text-gray-900'}`}>
              $299 <span className={`text-xs font-normal ${selectedTier === 'developer' ? 'text-brand-500' : 'text-gray-400'}`}>/mo</span>
            </div>
          </button>
        </div>

        {/* Developer billing toggle */}
        {isDev && (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-4 w-full">
            <button
              onClick={() => setBilling('monthly')}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Monthly — $299
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${billing === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Annual — $2,990
              <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">-$598</span>
            </button>
          </div>
        )}

        {/* Features */}
        <div className="border-t border-gray-100 pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {isDev ? 'Developer includes' : 'Homeowner includes'}
          </p>
          {features.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2.5">
              <span className="text-sm flex-shrink-0">{item.icon}</span>
              <div>
                <span className="text-xs font-medium text-gray-800">{item.label}</span>
                <span className="text-xs text-gray-400"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout */}
      <div className="px-6 pb-6">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
        />

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 mb-2"
        >
          {loading
            ? 'Redirecting to checkout...'
            : isDev
              ? `Start Developer — ${billing === 'annual' ? '$2,990/yr' : '$299/mo'} ↗`
              : 'Get Homeowner access — $79 ↗'
          }
        </button>

        {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}

        <p className="text-xs text-gray-400 text-center mb-4">
          Secure payment via Stripe · Receipt emailed instantly
        </p>

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <Link to="/pricing" className="text-xs text-gray-400 hover:text-gray-600">
            Compare all plans ↗
          </Link>
          <Link to="/restore" className="text-xs text-brand-600 hover:text-brand-700">
            Already paid? Restore access ↗
          </Link>
        </div>
      </div>
    </div>
  )
}
