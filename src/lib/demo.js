// src/lib/demo.js
// ─────────────────────────────────────────────────────────────────
// Demo account helpers — sessionStorage-based, no Stripe, no DB
// URL entry point: /demo?tier=homeowner | contractor | developer
// ─────────────────────────────────────────────────────────────────

export const DEMO_TIERS = ['homeowner', 'contractor', 'developer']
const STORAGE_KEY = 'demo_tier'

/** Returns the active demo tier ('homeowner' | 'contractor' | 'developer' | null) */
export function getDemoTier() {
  try { return sessionStorage.getItem(STORAGE_KEY) || null } catch { return null }
}

/** Returns true if any demo session is active */
export function isDemo() {
  return !!getDemoTier()
}

/** Activate a demo session for the given tier */
export function activateDemoTier(tier) {
  if (!DEMO_TIERS.includes(tier)) return
  try { sessionStorage.setItem(STORAGE_KEY, tier) } catch {}
}

/** Clear the demo session */
export function clearDemoTier() {
  try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
}

// ─────────────────────────────────────────────────────────────────
// FAKE DATA — pre-seeded for client demos
// ─────────────────────────────────────────────────────────────────

export const DEMO_CONTRACTOR_JOBS = [
  {
    id: 'demo-job-1',
    client_name: 'Marcus Webb',
    job_address: '1402 Roxboro Rd, Durham, NC 27701',
    project_type: 'sfh',
    status: 'Permit Submitted',
    next_action: 'Follow up with Durham Planning — review window closes Jul 9',
    created_at: '2026-06-01T10:00:00Z',
    jurisdiction: 'durham',
    notes: 'Client needs CO before Aug 1 closing date.',
  },
  {
    id: 'demo-job-2',
    client_name: 'Priya Nair',
    job_address: '304 Hillsborough St, Raleigh, NC 27603',
    project_type: 'remodel',
    status: 'Permit Issued',
    next_action: 'Schedule rough electrical inspection — inspector available Mon/Wed',
    created_at: '2026-05-14T09:30:00Z',
    jurisdiction: 'raleigh',
    notes: 'Kitchen remodel. Permit # R2026-04812.',
  },
  {
    id: 'demo-job-3',
    client_name: 'Tom & Sheila Hargrove',
    job_address: '88 Locust Ave, Chapel Hill, NC 27514',
    project_type: 'adu',
    status: 'Pre-Application',
    next_action: 'Chapel Hill CAPS consultation required before submission',
    created_at: '2026-06-18T14:00:00Z',
    jurisdiction: 'chapelhill',
    notes: 'ADU in backyard. Confirm setbacks with Orange County.',
  },
  {
    id: 'demo-job-4',
    client_name: 'Okonkwo Properties LLC',
    job_address: '512 Kildaire Farm Rd, Cary, NC 27511',
    project_type: 'garage',
    status: 'Final Inspection',
    next_action: 'CO expected within 3–5 business days',
    created_at: '2026-03-10T08:00:00Z',
    jurisdiction: 'cary',
    notes: 'Garage-to-studio conversion. All rough inspections passed.',
  },
]

export const DEMO_DEVELOPER_PROJECTS = [
  {
    id: 'demo-proj-1',
    name: '14-Unit Townhome — N Mangum St',
    address: '900 N Mangum St',
    jurisdiction: 'durham',
    project_type: 'townhouse',
    projs: ['townhouse'],
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'demo-proj-2',
    name: 'Apex Mixed-Use Retail + Condos',
    address: '205 W Williams St',
    jurisdiction: 'apex',
    project_type: 'commercial',
    projs: ['commercial'],
    status: 'active',
    created_at: '2025-12-15T00:00:00Z',
  },
  {
    id: 'demo-proj-3',
    name: 'Morrisville Tech Campus Ph. 2',
    address: '1000 Perimeter Park Dr',
    jurisdiction: 'morrisville',
    project_type: 'commercial',
    projs: ['commercial'],
    status: 'active',
    created_at: '2025-09-20T00:00:00Z',
  },
  {
    id: 'demo-proj-4',
    name: 'Raleigh Infill SFH — 4 Lots',
    address: '417 S Bloodworth St',
    jurisdiction: 'raleigh',
    project_type: 'sfh',
    projs: ['sfh'],
    status: 'active',
    created_at: '2026-06-10T00:00:00Z',
  },
]
