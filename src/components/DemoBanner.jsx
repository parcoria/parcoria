// src/components/DemoBanner.jsx
// Amber sticky banner shown during all demo sessions. No dismiss — always visible.

import { getDemoTier, clearDemoTier } from '../lib/demo'

const TIER_LABELS = {
  homeowner: 'Homeowner',
  contractor: 'Contractor',
  developer: 'Developer',
}

export default function DemoBanner() {
  const tier = getDemoTier()
  if (!tier) return null

  function handleExit() {
    clearDemoTier()
    // Also clear the localStorage access token so the demo tier doesn't linger
    try { localStorage.removeItem('parcoria_access') } catch {}
    window.location.href = '/'
  }

  return (
    <div className="sticky top-0 z-[9999] flex items-center justify-center gap-3 bg-amber-700 px-4 py-2 text-amber-50 text-sm font-semibold shadow-md">
      <span>🔒</span>
      <span>
        DEMO MODE &mdash; {TIER_LABELS[tier]} tier &mdash; No data is saved. No payment required.
      </span>
      <span className="opacity-40">|</span>
      <button
        onClick={handleExit}
        className="rounded border border-amber-200/40 bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-amber-50 hover:bg-white/25 transition-colors"
      >
        Exit demo
      </button>
    </div>
  )
}
