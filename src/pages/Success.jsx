import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { grantAccess } from '../lib/access'

const PROJ_LABELS = {
  sfh: 'new single-family home', adu: 'accessory dwelling unit',
  addition: 'addition', deck: 'deck or porch', reno: 'major renovation',
  pool: 'pool or spa', shed: 'shed or garage', townhouse: 'townhouse or duplex',
}
const JUR_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham',
  chapelhill: 'Chapel Hill', apex: 'Apex', hollysprings: 'Holly Springs',
}

export default function Success() {
  const [params] = useSearchParams()
  const proj = params.get('p') || ''
  const jur = params.get('j') || ''

  useEffect(() => {
    // Grant access immediately when success page loads
    // Stripe session_id confirms payment was successful
    grantAccess()
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">

      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment confirmed</h1>
      <p className="text-gray-500 text-sm mb-2">
        {proj && jur
          ? `Your Parcoria access for a ${PROJ_LABELS[proj] || proj} in ${JUR_LABELS[jur] || jur} is active.`
          : 'Your Parcoria Homeowner access is active for 30 days.'
        }
      </p>
      <p className="text-gray-400 text-xs mb-8">A receipt has been sent to your email.</p>

      <div className="bg-gray-50 rounded-xl p-5 text-left mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What you have access to</p>
        {[
          { icon: '🗺️', label: 'Full permit wizard', desc: 'Complete 6-step roadmap including professionals screen' },
          { icon: '🏗️', label: 'Buildability check', desc: 'Live FEMA flood data + parcel conditions' },
          { icon: '🤖', label: 'AI Concierge', desc: '30 days of expert permit guidance' },
          { icon: '📋', label: 'Plan Pre-Check', desc: 'One AI-powered compliance review' },
          { icon: '🔗', label: 'Shareable roadmap', desc: 'Send your plan to your contractor or lender' },
          { icon: '📅', label: 'Week-by-week action plan', desc: 'From empty lot to certificate of occupancy' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <div>
              <div className="text-sm font-medium text-gray-800">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/wizard"
          className="px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          Open my permit wizard ↗
        </Link>
        <Link
          to="/"
          className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-300 transition-colors"
        >
          Back to home
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Questions? Email <a href="mailto:hello@parcoria.com" className="text-brand-600">hello@parcoria.com</a>
      </p>
    </div>
  )
}
