// src/pages/Waitlist.jsx
// Waitlist signup page — captures email + role, saves to Supabase via API

import { useState } from 'react'
import { Link } from 'react-router-dom'

const ROLES = [
  { id: 'developer', label: 'Developer', desc: 'Building homes, ADUs, or multi-unit projects', icon: '🏗️' },
  { id: 'contractor', label: 'Contractor', desc: 'Licensed trade or general contractor', icon: '🔧' },
  { id: 'homeowner', label: 'Homeowner', desc: 'Building, adding on, or renovating my home', icon: '🏡' },
]

const JURISDICTIONS = [
  'Raleigh', 'Durham', 'Chapel Hill', 'Cary', 'Apex',
  'Holly Springs', 'Wake Forest', 'Morrisville', 'Garner', 'Fuquay-Varina',
]

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: role || null, source: 'waitlist_page' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">You're on the list</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          We'll reach out personally — not a mass blast. Expect a direct email from the founder within a few days.
        </p>
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">While you wait</div>
          <div className="space-y-3">
            {[
              { href: '/wizard', label: 'Try the permit wizard free →', desc: 'See your full permit roadmap for any Triangle project' },
              { href: '/apply', label: 'Pre-fill a Durham permit →', desc: 'Fill a building, electrical, plumbing, or mechanical permit' },
              { href: '/sample', label: 'View a sample roadmap →', desc: 'See what a real permit roadmap looks like' },
            ].map(item => (
              <Link key={item.href} to={item.href}
                className="flex items-start gap-3 group">
                <div className="flex-1">
                  <div className="text-sm font-medium text-brand-600 group-hover:text-brand-700">{item.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Parcoria</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">

      {/* Top nav hint */}
      <div className="max-w-3xl mx-auto px-4 pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Parcoria</span>
        </Link>
        <Link to="/pricing" className="text-xs text-gray-400 hover:text-gray-600">See pricing →</Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-24">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>
            Limited early access · Research Triangle
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-5 tracking-tight">
            Permit intelligence<br className="hidden sm:block" /> for the Triangle
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            Know exactly which permits you need, in the right order — for any project across 10 Research Triangle jurisdictions.
          </p>
        </div>

        {/* Social proof — jurisdictions */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {JURISDICTIONS.map(j => (
            <span key={j} className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-500 rounded-full">
              {j}
            </span>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

          {/* Role picker */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">I am a...</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className={`flex flex-col items-start gap-1 p-4 rounded-xl border text-left transition-all ${
                    role === r.id
                      ? 'border-brand-300 bg-brand-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}>
                  <span className="text-xl mb-1">{r.icon}</span>
                  <span className={`text-sm font-semibold ${role === r.id ? 'text-brand-800' : 'text-gray-800'}`}>{r.label}</span>
                  <span className="text-xs text-gray-400 leading-snug">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading || !email}
            className="w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving your spot...
              </span>
            ) : 'Join the waitlist →'}
          </button>

          <p className="text-xs text-center text-gray-400 mt-4">
            No spam. We'll reach out directly — not a mass email.
          </p>
        </div>

        {/* What you get */}
        <div className="mt-10">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-6">What early access includes</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📋', title: 'Permit roadmaps', desc: 'Every permit, in order, for any project across 10 Triangle jurisdictions' },
              { icon: '⚡', title: 'Application pre-fill', desc: 'Durham building, electrical, plumbing, and mechanical permits — auto-filled from your profile' },
              { icon: '🔍', title: 'AI plan review', desc: 'Upload your drawings and get a page-by-page compliance review before you submit' },
            ].map(f => (
              <div key={f.title} className="text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-sm font-semibold text-gray-800 mb-1">{f.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Already have access */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            Already have access?{' '}
            <Link to="/pricing" className="text-brand-600 hover:underline">See plans →</Link>
            {' · '}
            <Link to="/restore" className="text-brand-600 hover:underline">Restore access →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
