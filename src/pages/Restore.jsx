import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { grantAccess } from '../lib/access'

export default function Restore() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | notfound | error
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  async function handleRestore() {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/restore-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('API not reachable')
      }

      const data = await res.json()

      if (data.success) {
        grantAccess(data.tier || 'homeowner')
        setStatus('success')
        setMessage(data.tier === 'developer' ? 'Developer access restored — redirecting to dashboard...' : 'Access restored successfully.')
        setTimeout(() => navigate(data.tier === 'developer' ? '/dashboard' : '/wizard'), 2000)
      } else {
        setStatus('notfound')
        setMessage(data.message || 'No payment found for this email.')
      }
    } catch (err) {
      console.error('Restore error:', err)
      setStatus('error')
      setMessage('Something went wrong. Please try again or email hello@parcoria.com.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20">

      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Restore your access</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter the email address you used when you purchased Parcoria. We'll look up your payment and restore your access instantly.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-sm font-semibold text-green-800 mb-1">Access restored</div>
          <div className="text-xs text-green-700">{message}</div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <label className="text-xs font-medium text-gray-700 block mb-1.5">
            Email used at checkout
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRestore()}
            placeholder="you@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
            disabled={status === 'loading'}
          />

          <button
            onClick={handleRestore}
            disabled={!email.includes('@') || status === 'loading'}
            className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Checking payment records...
              </span>
            ) : 'Restore my access'}
          </button>

          {status === 'notfound' && (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-800 mb-1">No payment found</div>
              <div className="text-xs text-amber-700 leading-relaxed">{message}</div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="text-xs text-red-700 leading-relaxed">{message}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-center space-y-2">
        <p className="text-xs text-gray-400">
          Can't find your email?{' '}
          <a href="mailto:hello@parcoria.com?subject=Access restore request" className="text-brand-600 hover:text-brand-700">
            Email us at hello@parcoria.com
          </a>
        </p>
        <Link to="/pricing" className="block text-xs text-gray-400 hover:text-gray-600">
          ← Back to pricing
        </Link>
      </div>
    </div>
  )
}
