// AddressDetector.jsx
// Smart address entry that auto-detects jurisdiction and runs FEMA flood check
// Replaces the separate Step 1 (jurisdiction) + Step 2 (address) in the wizard

import { useState, useEffect, useRef } from 'react'
import { detectJurisdictionFromAddress, detectJurisdictionFromZip, getJurisdictionLabel, JURISDICTION_LABELS } from '../lib/detectJurisdiction'

const ALL_JURISDICTIONS = [
  { id: 'raleigh', name: 'Raleigh', county: 'Wake County' },
  { id: 'durham', name: 'Durham', county: 'Durham County' },
  { id: 'chapelhill', name: 'Chapel Hill', county: 'Orange County' },
  { id: 'apex', name: 'Apex', county: 'Wake County' },
  { id: 'hollysprings', name: 'Holly Springs', county: 'Wake County' },
  { id: 'wakeforest', name: 'Wake Forest', county: 'Wake County' },
  { id: 'morrisville', name: 'Morrisville', county: 'Wake County' },
  { id: 'garner', name: 'Garner', county: 'Wake County' },
]

export default function AddressDetector({ onComplete }) {
  const [address, setAddress] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [detected, setDetected] = useState(null) // { id, label, confidence, matchedAddress, floodResult }
  const [showOverride, setShowOverride] = useState(false)
  const [error, setError] = useState('')
  const [flags, setFlags] = useState({ historic: false, septic: false, corner: false })
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function detectFromAddress() {
    if (address.trim().length < 5) return
    setDetecting(true)
    setError('')
    setDetected(null)

    try {
      // Try zip-based detection immediately as fast fallback
      const zipDetection = detectJurisdictionFromZip(address)

      // Call flood API which also geocodes — two birds, one stone
      const params = new URLSearchParams({ address: address.trim() })
      const res = await fetch(`/api/flood?${params}`)
      const contentType = res.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        // API not reachable (local dev without vercel dev)
        // Fall back to zip detection
        if (zipDetection) {
          setDetected({
            id: zipDetection.id,
            label: zipDetection.label,
            confidence: zipDetection.confidence,
            matchedAddress: address,
            floodResult: null,
          })
        } else {
          setError('Could not detect jurisdiction. Please select below.')
          setShowOverride(true)
        }
        setDetecting(false)
        return
      }

      const data = await res.json()

      if (data.status === 'success' || data.matchedAddress) {
        // Try city from ArcGIS first, then parse matched address
        const cityFromApi = data.city
        let jurisdictionDetected = null

        if (cityFromApi) {
          const key = cityFromApi.toLowerCase()
          const mapEntry = Object.entries(JURISDICTION_LABELS).find(([id]) => {
            const cityNames = {
              raleigh: 'raleigh', durham: 'durham', chapelhill: 'chapel hill',
              apex: 'apex', hollysprings: 'holly springs', wakeforest: 'wake forest',
              morrisville: 'morrisville', garner: 'garner',
            }
            return cityNames[id] === key
          })
          if (mapEntry) {
            jurisdictionDetected = { id: mapEntry[0], label: mapEntry[1], confidence: 'high' }
          }
        }

        // Fall back to parsing matched address string
        if (!jurisdictionDetected && data.matchedAddress) {
          jurisdictionDetected = detectJurisdictionFromAddress(data.matchedAddress)
        }

        // Fall back to zip
        if (!jurisdictionDetected) {
          jurisdictionDetected = zipDetection
        }

        if (jurisdictionDetected) {
          setDetected({
            ...jurisdictionDetected,
            matchedAddress: data.matchedAddress || address,
            floodResult: data,
          })
        } else {
          setError('Could not detect jurisdiction from this address. Please select below.')
          setShowOverride(true)
          setDetected({ id: null, matchedAddress: data.matchedAddress || address, floodResult: data })
        }
      } else {
        // Geocode failed — try zip fallback
        if (zipDetection) {
          setDetected({ ...zipDetection, matchedAddress: address, floodResult: null })
        } else {
          setError('Address not found. Try adding your city or zip code.')
          setShowOverride(true)
        }
      }
    } catch (err) {
      console.error('Detection error:', err)
      // Try zip fallback
      const zipDetection = detectJurisdictionFromZip(address)
      if (zipDetection) {
        setDetected({ ...zipDetection, matchedAddress: address, floodResult: null })
      } else {
        setError('Could not process address. Please select jurisdiction below.')
        setShowOverride(true)
      }
    } finally {
      setDetecting(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') detectFromAddress()
  }

  function selectJurisdiction(id) {
    setDetected(prev => ({
      ...prev,
      id,
      label: getJurisdictionLabel(id),
      confidence: 'user_selected',
      matchedAddress: detected?.matchedAddress || address,
      floodResult: detected?.floodResult || null,
    }))
    setShowOverride(false)
  }

  function handleContinue() {
    if (!detected?.id) return
    onComplete({
      addr: detected.matchedAddress || address,
      jurisdiction: detected.id,
      floodResult: detected.floodResult,
      historic: flags.historic,
      septic: flags.septic,
      corner: flags.corner,
      flood: detected.floodResult?.classification?.risk === 'high',
    })
  }

  const canContinue = detected?.id && !detecting

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">Step 1 of 5</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Where is your property?</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your address or just a street and zip code. We'll detect your jurisdiction and run a live FEMA flood check automatically.
      </p>

      {/* Address input */}
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="e.g. 123 Main St, 27587  or  500 Foster St, Durham NC"
          value={address}
          onChange={e => { setAddress(e.target.value); setDetected(null); setError('') }}
          onKeyDown={handleKeyDown}
          disabled={detecting}
        />
        <button
          onClick={detectFromAddress}
          disabled={detecting || address.trim().length < 5}
          className="px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {detecting ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          )}
          {detecting ? 'Detecting...' : 'Look up'}
        </button>
      </div>

      {/* Detection result */}
      {detected?.id && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-sm font-semibold text-green-800">
                  {detected.confidence === 'user_selected' ? 'Jurisdiction selected' : 'Jurisdiction detected'}
                </span>
                {detected.confidence === 'medium' && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Based on zip code</span>
                )}
              </div>
              <div className="text-sm text-green-800 font-medium ml-6">{detected.label}</div>
              {detected.matchedAddress && detected.matchedAddress !== address && (
                <div className="text-xs text-green-600 ml-6 mt-0.5">Matched: {detected.matchedAddress}</div>
              )}
            </div>
            <button
              onClick={() => setShowOverride(!showOverride)}
              className="text-xs text-green-700 underline hover:text-green-900 whitespace-nowrap flex-shrink-0"
            >
              {showOverride ? 'Hide' : 'Not right?'}
            </button>
          </div>

          {/* FEMA result inline */}
          {detected.floodResult?.classification && (
            <div className={`mt-3 pt-3 border-t border-green-200`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {detected.floodResult.classification.risk === 'high' ? '🔴' :
                   detected.floodResult.classification.risk === 'minimal' ? '🟢' : '🟡'}
                </span>
                <span className="text-xs font-medium text-green-800">
                  FEMA: {detected.floodResult.classification.label} — Zone {detected.floodResult.classification.zone}
                </span>
                <span className="text-xs px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded-full font-medium">Live data</span>
              </div>
              {detected.floodResult.classification.requiresElevationCert && (
                <div className="text-xs text-red-700 font-semibold mt-1 ml-6">
                  ⚠️ FEMA elevation certificate required before permits
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && !showOverride && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-700 mb-4">
          {error}
        </div>
      )}

      {/* Manual jurisdiction override */}
      {showOverride && (
        <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Select your jurisdiction
          </div>
          <div className="divide-y divide-gray-100">
            {ALL_JURISDICTIONS.map(j => (
              <button
                key={j.id}
                onClick={() => selectJurisdiction(j.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${detected?.id === j.id ? 'bg-brand-50' : ''}`}
              >
                <div>
                  <div className={`text-sm font-medium ${detected?.id === j.id ? 'text-brand-700' : 'text-gray-800'}`}>{j.name}</div>
                  <div className="text-xs text-gray-400">{j.county}</div>
                </div>
                {detected?.id === j.id && (
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Parcel flags */}
      {detected?.id && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Parcel conditions</p>
          {[
            { key: 'historic', label: 'Historic district', sub: 'May require additional approval — adds 4–8 weeks' },
            { key: 'septic', label: 'Private well or septic', sub: 'County environmental health approval required first' },
            { key: 'corner', label: 'Corner lot', sub: 'Dual street setbacks apply' },
          ].map(t => (
            <div key={t.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
              <div>
                <div className="text-sm text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
              </div>
              <button
                onClick={() => setFlags(f => ({ ...f, [t.key]: !f[t.key] }))}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${flags[t.key] ? 'bg-brand-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${flags[t.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
          <div className="mt-2 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3 text-xs text-brand-700">
            🔍 Flood zone detected automatically from FEMA data — no need to self-report.
          </div>
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue to project type →
      </button>
    </div>
  )
}
