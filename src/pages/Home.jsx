import { Link } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const PAIN_STATS = [
  { n: '11+', label: 'Permits for a single new home in Raleigh' },
  { n: '60 days', label: 'Average city review time before ground breaks' },
  { n: '3 agencies', label: 'City, Wake County, and state — each different' },
  { n: '2–3x', label: 'Correction cycles on incomplete applications' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Enter your address', desc: 'We identify your zoning, jurisdiction, and any lot-level conditions that affect your project.' },
  { step: '2', title: "Tell us what you're building", desc: 'New home, ADU, deck, addition — we map your project to the exact permits required.' },
  { step: '3', title: 'Get your permit roadmap', desc: 'A sequenced checklist of every permit, fee, and timeline — in the right order.' },
  { step: '4', title: 'Know who you need to hire', desc: 'Exactly which licensed professionals NC law requires for your project — and why.' },
]

const PERMIT_SAMPLES = [
  { name: 'Zoning permit', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Residential building permit', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Site / grading permit', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Electrical permit', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Plumbing permit', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Mechanical / HVAC permit', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Septic / well approval', jurisdiction: 'Wake County', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { name: 'Lien agent appointment', jurisdiction: 'NC State', color: 'bg-green-50 text-green-700 border-green-100' },
  { name: 'Certificate of occupancy', jurisdiction: 'City', color: 'bg-blue-50 text-blue-700 border-blue-100' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitted2, setSubmitted2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e, which) {
    e.preventDefault()
    const val = which === 1 ? email : email2
    if (!val || !val.includes('@')) return

    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('waitlist')
      .insert([{ email: val.toLowerCase().trim(), source: 'landing_page' }])

    setLoading(false)

    if (err) {
      if (err.code === '23505') {
        which === 1 ? setSubmitted(true) : setSubmitted2(true)
      } else {
        setError('Something went wrong. Please try again.')
        console.error('Supabase error:', err)
      }
    } else {
      which === 1 ? setSubmitted(true) : setSubmitted2(true)
      which === 1 ? setEmail('') : setEmail2('')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>
          Raleigh · Durham · Chapel Hill · Apex · Holly Springs · Wake Forest · Morrisville · Garner
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-4 tracking-tight">
          Build your home without<br className="hidden sm:block" /> the permit headache
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Know exactly which permits you need, in the right order, before you spend a dollar on construction. No lawyers, no guesswork, no wasted months.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 rounded-lg px-5 py-3 text-sm font-medium">
            ✓ You're on the list — we'll be in touch soon
          </div>
        ) : (
          <form onSubmit={e => handleSubmit(e, 1)} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Get early access'}
            </button>
          </form>
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <p className="text-xs text-gray-400 mt-3">Free during beta · Research Triangle + Wake County</p>

        <div className="mt-8">
          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
          >
            Try the permit wizard now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Pain stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest text-center mb-8">The problem today</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {PAIN_STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-1">{s.n}</div>
                <div className="text-sm text-gray-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">How Parcoria works</h2>
        <p className="text-sm text-gray-500 text-center mb-12">Four steps from empty lot to permit roadmap</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold flex items-center justify-center mb-4">
                {s.step}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Permit sample */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Every permit, mapped for you</h2>
          <p className="text-sm text-gray-500 text-center mb-10">A sample of what a new single-family home in Raleigh requires</p>
          <div className="max-w-lg mx-auto flex flex-col gap-2">
            {PERMIT_SAMPLES.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>
                <span className="text-sm text-gray-800 flex-1 font-medium">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.color}`}>{p.jurisdiction}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ready to build smarter in Raleigh?</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
          We're onboarding our first 50 homeowners and builders for free. Join the waitlist or try the wizard now.
        </p>

        {submitted2 ? (
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 rounded-lg px-5 py-3 text-sm font-medium mb-4">
            ✓ You're on the list — we'll be in touch soon
          </div>
        ) : (
          <form onSubmit={e => handleSubmit(e, 2)} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto mb-4">
            <input
              type="email"
              value={email2}
              onChange={e => setEmail2(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Join waitlist'}
            </button>
          </form>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/wizard"
            className="px-6 py-3 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            Try the permit wizard
          </Link>
          <a
            href="mailto:hello@parcoria.com"
            className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  )
}
