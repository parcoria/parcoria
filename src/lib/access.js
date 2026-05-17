// src/lib/access.js
// Lightweight payment gating using localStorage
// Token is set after successful Stripe checkout
// No auth required — simple and fast for MVP

const ACCESS_KEY = 'parcoria_access'
const ACCESS_VERSION = 'v1'

export function grantAccess() {
  const token = {
    version: ACCESS_VERSION,
    grantedAt: Date.now(),
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
  }
  try {
    localStorage.setItem(ACCESS_KEY, JSON.stringify(token))
  } catch {
    // localStorage not available
  }
}

export function hasAccess() {
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return false
    const token = JSON.parse(raw)
    if (token.version !== ACCESS_VERSION) return false
    if (Date.now() > token.expiresAt) {
      localStorage.removeItem(ACCESS_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function revokeAccess() {
  try {
    localStorage.removeItem(ACCESS_KEY)
  } catch {}
}

export function getAccessInfo() {
  try {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
