// pages/PermitHistoryPage.jsx
// Standalone /permit-history page — free, no login required
// Entry point for homeowners researching a property before starting a project
// Uses AddressDetector to capture address + jurisdiction, then renders PermitHistory

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddressDetector from '../components/AddressDetector'
import PermitHistory from '../components/PermitHistory'
import { hasAccess } from '../lib/access'

export default function PermitHistoryPage() {
  const [result, setResult] = useState(null) // { addr, jurisdiction }

  function handleComplete(res) {
    setResult({ addr: res.addr, jurisdiction: res.jurisdiction })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {!result ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Permit history lookup</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enter a property address to see all prior permits on file with the jurisdiction.
              Free, no account required — data is sourced directly from official municipal portals.
            </p>
          </div>

          <AddressDetector onComplete={handleComplete} lookupOnly />

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-3">Ready to pull your own permits?</p>
            <Link
              to={hasAccess() ? '/wizard' : '/pricing'}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {hasAccess() ? 'Open permit wizard →' : 'Get started with Parcoria →'}
            </Link>
          </div>
        </>
      ) : (
        <>
          <PermitHistory
            address={result.addr}
            jurisdiction={result.jurisdiction}
          />
          <div className="text-center mt-4">
            <button
              onClick={() => setResult(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ← Look up a different address
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-3">Ready to build your permit roadmap for this address?</p>
            <Link
              to={hasAccess() ? '/wizard' : '/pricing'}
              className="inline-block px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
            >
              {hasAccess() ? 'Open permit wizard →' : 'Get started — from $149 →'}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
