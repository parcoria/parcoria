// src/lib/access.js
// Lightweight payment gating using localStorage
// Supports two tiers: homeowner (30-day) and developer (monthly subscription)
// Demo override: sessionStorage 'demo_tier' grants access without payment

// ─── Demo helpers (internal) ──────────────────────────────────────────────────
function _demoTier() {
  try { return sessionStorage.getItem('demo_tier') || null } catch { return null }
}

const ACCESS_KEY = 'parcoria_access'
const ACCESS_VERSION = 'v3' // Bumped to invalidate all old tokens

export function grantAccess(tier = 'homeowner') {
  const duration = tier === 'developer'
    ? 32 * 24 * 60 * 60 * 1000   // 32 days — developer monthly
    : tier === 'contractor'
    ? 32 * 24 * 60 * 60 * 1000   // 32 days — contractor monthly
    : 30 * 24 * 60 * 60 * 1000   // 30 days — homeowner
  const token = {
    version: ACCESS_VERSION,
    tier,
    grantedAt: Date.now(),
    expiresAt: Date.now() + duration,
  }
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify(token))
  } catch {}
}

export function hasAccess() {
  // Demo override — any active demo tier grants access
  if (_demoTier()) return true
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return false
    const token = JSON.parse(raw)
    // Must match current version — invalidates all old tokens
    if (token.version !== ACCESS_VERSION) {
      localStorage.removeItem(ACCESS_KEY)
      return false
    }
    if (Date.now() > token.expiresAt) {
      localStorage.removeItem(ACCESS_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function isDeveloper() {
  // Demo override — developer demo tier only
  if (_demoTier() === 'developer') return true
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return false
    const token = JSON.parse(raw)
    if (token.version !== ACCESS_VERSION) return false
    if (Date.now() > token.expiresAt) return false
    return token.tier === 'developer'
  } catch {
    return false
  }
}

export function isContractor() {
  // Demo override — contractor and developer demo tiers both pass
  const demo = _demoTier()
  if (demo === 'contractor' || demo === 'developer') return true
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return false
    const token = JSON.parse(raw)
    if (token.version !== ACCESS_VERSION) return false
    if (Date.now() > token.expiresAt) return false
    return token.tier === 'contractor'
  } catch {
    return false
  }
}

export function getAccessTier() {
  // Demo override — return the demo tier string
  const demo = _demoTier()
  if (demo) return demo
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return null
    const token = JSON.parse(raw)
    if (token.version !== ACCESS_VERSION) return null
    if (Date.now() > token.expiresAt) return null
    return token.tier || 'homeowner'
  } catch {
    return null
  }
}

export function revokeAccess() {
  try { localStorage.removeItem(ACCESS_KEY) } catch {}
}

export function getAccessInfo() {
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return null
    const token = JSON.parse(raw)
    if (token.version !== ACCESS_VERSION) return null
    return token
  } catch {
    return null
  }
}
