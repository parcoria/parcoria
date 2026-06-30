// src/pages/DemoLanding.jsx
// Entry point for all client demos.
//
// /demo?tier=homeowner   → /wizard
// /demo?tier=contractor  → /contractor (pre-seeded jobs)
// /demo?tier=developer   → /dashboard  (pre-seeded projects)
// /demo                  → tier picker

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { activateDemoTier, DEMO_TIERS } from '../lib/demo'
import { grantAccess } from '../lib/access'

const TIER_CONFIG = {
  homeowner: {
    label: 'Homeowner',
    description: 'Walk through the permit wizard and full roadmap for a single project.',
    destination: '/wizard',
    icon: '🏠',
    color: '#0369a1',
  },
  contractor: {
    label: 'Contractor',
    description: 'Explore Contractor Mode with pre-seeded jobs, lifecycle tracking, and the evidence vault.',
    destination: '/contractor',
    icon: '🔧',
    color: '#047857',
  },
  developer: {
    label: 'Developer',
    description: 'Tour the multi-project dashboard, portfolio overview, and contractor network.',
    destination: '/dashboard',
    icon: '🏗️',
    color: '#7c3aed',
  },
}

export default function DemoLanding() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [launching, setLaunching] = useState(null) // tier string while animating

  useEffect(() => {
    // Support both ?tier= and legacy ?demo= param
    const tierParam = searchParams.get('tier') || searchParams.get('demo')
    if (tierParam && DEMO_TIERS.includes(tierParam)) {
      launchDemo(tierParam)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function launchDemo(tier) {
    setLaunching(tier)
    activateDemoTier(tier)
    grantAccess(tier)
    setTimeout(() => navigate(TIER_CONFIG[tier].destination), 600)
  }

  if (launching) {
    const cfg = TIER_CONFIG[launching]
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <span className="text-4xl">{cfg.icon}</span>
        <p className="text-sm font-medium text-gray-500">Launching {cfg.label} demo…</p>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: '100%', backgroundColor: cfg.color }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 py-16">
      {/* Header */}
      <div className="text-center max-w-md">
        <span className="inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800 mb-4">
          🔒 Demo Mode
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Choose a tier to explore</h1>
        <p className="text-sm text-gray-500">No sign-up. No payment. Data resets when you close the tab.</p>
      </div>

      {/* Tier cards */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {DEMO_TIERS.map(tier => {
          const cfg = TIER_CONFIG[tier]
          return (
            <button
              key={tier}
              onClick={() => launchDemo(tier)}
              className="flex items-start gap-4 rounded-xl border-2 border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-md active:scale-[0.99]"
            >
              <span className="text-2xl leading-none mt-0.5 shrink-0">{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{cfg.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cfg.description}</div>
              </div>
              <span className="text-gray-300 text-lg self-center shrink-0">→</span>
            </button>
          )
        })}
      </div>

      {/* Share tip */}
      <p className="text-xs text-gray-400 text-center">
        Share a direct link:{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">/demo?tier=contractor</code>
      </p>
    </div>
  )
}
