// src/components/SubmissionAgent.jsx
// "Submit for me" UI — queues permit submissions to the Parcoria Submission Agent
// Shows in the submission checklist after PDF generation

import { useState } from 'react'
import { Link } from 'react-router-dom'

const STATUS_CONFIG = {
  queued:     { label: 'Queued', color: 'bg-blue-50 text-blue-700 border-blue-100',   icon: '⏳', desc: 'Your submission is in the queue. The agent will process it shortly.' },
  processing: { label: 'Submitting', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: '🤖', desc: 'The agent is logging into the portal and uploading your application now.' },
  submitted:  { label: 'Submitted ✓', color: 'bg-green-50 text-green-700 border-green-100', icon: '✅', desc: 'Your application was successfully submitted to the portal.' },
  failed:     { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-100',       icon: '❌', desc: 'The submission failed. See error below. You can retry or submit manually.' },
  error:      { label: 'Error', color: 'bg-red-50 text-red-700 border-red-100',        icon: '⚠️', desc: 'An error occurred. Please submit manually using the checklist.' },
}

export default function SubmissionAgent({ form, permitType, jurisdiction, pdfFilename, projectId, userId, userEmail }) {
  const [mode, setMode] = useState('idle')  // idle | credentials | queued | polling
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [submissionId, setSubmissionId] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isSupported = jurisdiction === 'durham'
  const portalName = permitType === 'building' ? 'Dplans' : 'LDO Portal'
  const portalUrl = permitType === 'building' ? 'https://dplans.durhamnc.gov' : 'https://ldo4.durhamnc.gov/DurhamWeb'

  async function handleQueue() {
    if (!credentials.username || !credentials.password) {
      setError('Portal credentials required.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // Store credentials temporarily (in production: encrypt with server key)
      const credRes = await fetch('/api/store-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, credentials, jurisdiction }),
      })
      const credData = await credRes.json()
      if (!credRes.ok) throw new Error(credData.error || 'Could not store credentials')

      // Queue the submission
      const res = await fetch('/api/submit-permit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          user_email: userEmail,
          jurisdiction,
          permit_type: permitType,
          project_id: projectId || null,
          form_data: form,
          pdf_filename: pdfFilename,
          portal_credentials_ref: credData.credentials_ref,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not queue submission')

      setSubmissionId(data.submission_id)
      setMode('queued')
      pollStatus(data.submission_id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function pollStatus(id) {
    setMode('polling')
    let attempts = 0
    const maxAttempts = 40 // 20 minutes at 30s intervals

    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/submit-permit?id=${id}`)
        const data = await res.json()
        setStatus(data)

        if (data.status === 'submitted' || data.status === 'failed' || data.status === 'error' || attempts >= maxAttempts) {
          clearInterval(interval)
          setMode(data.status === 'submitted' ? 'done' : 'error')
        }
      } catch {}
    }, 30_000)
  }

  if (!isSupported) {
    return (
      <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Submission Agent</span> — coming soon for {jurisdiction?.replace(/([a-z])([A-Z])/g, '$1 $2') || 'this jurisdiction'}
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'done' && status?.confirmation_number) {
    return (
      <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">✅</span>
          <div>
            <div className="text-sm font-semibold text-green-900 mb-1">Submitted successfully</div>
            <div className="text-xs text-green-700 mb-2">Your permit application was submitted to {portalName} by the Parcoria Submission Agent.</div>
            <div className="bg-white border border-green-200 rounded-lg px-3 py-2 inline-block">
              <span className="text-xs text-green-600 font-medium">Confirmation number: </span>
              <span className="text-sm font-semibold text-green-900">{status.confirmation_number}</span>
            </div>
            <div className="text-xs text-green-600 mt-2">
              Durham will email you when the application is assigned to a plan reviewer.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'queued' || mode === 'polling') {
    const cfg = STATUS_CONFIG[status?.status || 'queued']
    return (
      <div className="mt-4 bg-white border border-gray-100 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 animate-pulse">{cfg.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
              {mode === 'polling' && <span className="text-xs text-gray-400">Checking every 30s...</span>}
            </div>
            <div className="text-xs text-gray-600">{cfg.desc}</div>
            {status?.error_message && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 rounded px-2 py-1">{status.error_message}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'error') {
    return (
      <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
        <div className="text-sm font-medium text-red-800 mb-1">⚠️ Submission failed</div>
        <div className="text-xs text-red-700 mb-3">{status?.error_message || 'The agent could not complete the submission.'}</div>
        <div className="flex gap-2">
          <button onClick={() => setMode('credentials')}
            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Try again
          </button>
          <a href={portalUrl} target="_blank" rel="noreferrer"
            className="text-xs px-3 py-1.5 border border-red-200 text-red-700 rounded-lg hover:border-red-300 transition-colors">
            Submit manually ↗
          </a>
        </div>
      </div>
    )
  }

  if (mode === 'credentials') {
    return (
      <div className="mt-4 bg-white border border-brand-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-brand-600 px-5 py-3 flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <div className="text-white text-sm font-semibold">Submission Agent</div>
            <div className="text-brand-200 text-xs">Enter your {portalName} login — we submit for you</div>
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700 mb-4">
            <strong>Security:</strong> Your credentials are encrypted and used only once for this submission. They are not stored permanently and never shared.
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                {portalName} username / email
              </label>
              <input type="email" value={credentials.username}
                onChange={e => setCredentials(c => ({ ...c, username: e.target.value }))}
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Password</label>
              <input type="password" value={credentials.password}
                onChange={e => setCredentials(c => ({ ...c, password: e.target.value }))}
                placeholder="Your portal password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          {!credentials.username && (
            <div className="text-xs text-gray-400 mb-3">
              Don't have a {portalName} account?{' '}
              <a href={portalUrl} target="_blank" rel="noreferrer" className="text-brand-600 underline">Register here ↗</a>
            </div>
          )}
          {error && <div className="text-xs text-red-500 mb-3">{error}</div>}
          <div className="flex gap-2">
            <button onClick={() => setMode('idle')}
              className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
              Cancel
            </button>
            <button onClick={handleQueue} disabled={loading || !credentials.username || !credentials.password}
              className="flex-2 py-2 px-4 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-40">
              {loading ? 'Queuing...' : '🤖 Submit for me ↗'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // idle — show the "Submit for me" entry point
  return (
    <div className="mt-4 bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-xl flex-shrink-0">
        🤖
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-sm font-semibold text-gray-900">Submission Agent</div>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full font-medium">Beta</span>
        </div>
        <div className="text-xs text-gray-500 leading-relaxed mb-3">
          Skip the portal. Enter your {portalName} credentials and Parcoria submits your application directly — no logging in, no uploading, no back-and-forth.
        </div>
        <button onClick={() => setMode('credentials')}
          className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors px-4 py-2 rounded-lg">
          🤖 Submit for me ↗
        </button>
        <span className="text-xs text-gray-400 ml-3">or submit manually using the steps above</span>
      </div>
    </div>
  )
}
