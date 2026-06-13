// PermitHistory.jsx
// Shows prior permit history for a given address by deep-linking to jurisdiction portals
// Used inline in AddressDetector (wizard step 1), contractor job detail, developer dashboard
// Also rendered standalone at /permit-history
//
// Deep-link support by jurisdiction:
//   durham      → Avenu portal — full address pre-fill via query params ✅
//   wakeforest  → Tyler eSuite — address search on landing page ✅
//   raleigh     → Tyler EnerGov SPA — no pre-fill, link + copy ⚠️
//   wakecounty  → Tyler EnerGov SPA — no pre-fill, link + copy ⚠️
//   chapelhill  → OpenGov — link + copy ⚠️
//   cary        → Click2Gov — link + copy ⚠️
//   apex        → Tyler eSuite — link + copy ⚠️
//   hollysprings → CityView — link + copy ⚠️
//   morrisville → Tyler EnerGov CSS — link + copy ⚠️
//   garner      → SmartGov — link + copy ⚠️
//   fuquayvarina → Custom ePermit — link + copy ⚠️

import { useState } from 'react'

// ─── Portal config ─────────────────────────────────────────────────────────────

const PORTALS = {
  durham: {
    name: 'City of Durham LDO',
    canPrefill: true,
    baseUrl: 'https://ldo4.durhamnc.gov/DurhamWeb/Search/ApplicationSearch',
    buildUrl: ({ streetNo, streetName }) => {
      const params = new URLSearchParams()
      if (streetNo) params.set('StreetNo', streetNo)
      if (streetName) params.set('StreetName', streetName)
      params.set('SearchType', 'Address')
      return `https://ldo4.durhamnc.gov/DurhamWeb/Search/ApplicationSearch?${params}`
    },
    note: 'Opens with your address pre-filled.',
  },
  raleigh: {
    name: 'City of Raleigh Self-Service',
    canPrefill: false,
    baseUrl: 'https://raleighnc-energovpub.tylerhost.net/apps/selfservice#/search',
    buildUrl: () => 'https://raleighnc-energovpub.tylerhost.net/apps/selfservice#/search',
    note: 'Copy your address and paste it into the Address field on the search page.',
  },
  cary: {
    name: 'Town of Cary Click2Gov',
    canPrefill: false,
    baseUrl: 'https://energov.carync.gov/apps/selfservice#/search',
    buildUrl: () => 'https://energov.carync.gov/apps/selfservice#/search',
    note: 'Copy your address and paste it into the search field.',
  },
  apex: {
    name: 'Town of Apex eSuite',
    canPrefill: false,
    baseUrl: 'https://secure.apexnc.org/eSuite.Permits/WelcomePage.aspx',
    buildUrl: () => 'https://secure.apexnc.org/eSuite.Permits/WelcomePage.aspx',
    note: 'Copy your address and enter it in the service address field.',
  },
  hollysprings: {
    name: 'Holly Springs CityView',
    canPrefill: false,
    baseUrl: 'https://cityview.hollyspringsnc.us/Portal/Permit/Locator',
    buildUrl: () => 'https://cityview.hollyspringsnc.us/Portal/Permit/Locator',
    note: 'Copy your address and paste it in the service address field.',
  },
  wakeforest: {
    name: 'Town of Wake Forest eSuite',
    canPrefill: true,
    baseUrl: 'https://eutil.wakeforestnc.gov/eSuite.Permits/AdvancedSearchPage/AdvancedSearch.aspx',
    buildUrl: ({ fullAddress }) => {
      const params = new URLSearchParams({ SearchType: 'Address', address: fullAddress || '' })
      return `https://eutil.wakeforestnc.gov/eSuite.Permits/AdvancedSearchPage/AdvancedSearch.aspx?${params}`
    },
    note: 'Opens with your address pre-filled.',
  },
  morrisville: {
    name: 'Town of Morrisville CSS',
    canPrefill: false,
    baseUrl: 'https://morrisvillenc-energovpub.tylerhost.net/apps/selfservice#/search',
    buildUrl: () => 'https://morrisvillenc-energovpub.tylerhost.net/apps/selfservice#/search',
    note: 'Copy your address and paste it into the search field.',
  },
  garner: {
    name: 'Town of Garner SmartGov',
    canPrefill: false,
    baseUrl: 'https://garner.smartgovcommunity.com/PublicAccess/PermitPublicAccessPage/Search',
    buildUrl: () => 'https://garner.smartgovcommunity.com/PublicAccess/PermitPublicAccessPage/Search',
    note: 'Copy your address and enter it in the address field.',
  },
  fuquayvarina: {
    name: 'Fuquay-Varina ePermits',
    canPrefill: false,
    baseUrl: 'https://www.fuquay-varina.org/238/E-Permits-Online',
    buildUrl: () => 'https://www.fuquay-varina.org/238/E-Permits-Online',
    note: 'This portal requires a free account to search permit records.',
  },
  chapelhill: {
    name: 'Chapel Hill OpenGov',
    canPrefill: false,
    baseUrl: 'https://chapelhillnc.portal.opengov.com/',
    buildUrl: () => 'https://chapelhillnc.portal.opengov.com/',
    note: 'Copy your address and use Search Records to find permits.',
  },
}

// Wake County portal covers unincorporated areas + some towns
const WAKE_COUNTY_PORTAL = {
  name: 'Wake County Permit Portal',
  canPrefill: false,
  baseUrl: 'https://wakecountync-energovpub.tylerhost.net/apps/SelfService#/search',
  buildUrl: () => 'https://wakecountync-energovpub.tylerhost.net/apps/SelfService#/search',
  note: 'Copy your address and paste it into the search field.',
}

// Durham County covers unincorporated Durham
const DURHAM_COUNTY_PORTAL = {
  name: 'Durham County LDO',
  canPrefill: true,
  baseUrl: 'https://ldo4.durhamnc.gov/DurhamWeb/Search/ApplicationSearch',
  buildUrl: ({ streetNo, streetName }) => {
    const params = new URLSearchParams()
    if (streetNo) params.set('StreetNo', streetNo)
    if (streetName) params.set('StreetName', streetName)
    params.set('SearchType', 'Address')
    return `https://ldo4.durhamnc.gov/DurhamWeb/Search/ApplicationSearch?${params}`
  },
  note: 'Opens with your address pre-filled.',
}

// Map jurisdiction ids to their portals (some have multiple — city + county)
function getPortalsForJurisdiction(jurisdictionId) {
  const city = PORTALS[jurisdictionId]
  // Wake County towns also have county-level records
  const wakeCountyJurisdictions = ['raleigh', 'cary', 'apex', 'hollysprings', 'wakeforest', 'morrisville', 'garner', 'fuquayvarina']
  const durhamCountyJurisdictions = ['durham']

  const portals = city ? [{ ...city, label: 'City portal' }] : []

  if (wakeCountyJurisdictions.includes(jurisdictionId)) {
    portals.push({ ...WAKE_COUNTY_PORTAL, label: 'Wake County records' })
  }
  if (durhamCountyJurisdictions.includes(jurisdictionId)) {
    // Durham city and county use same portal
    portals[0] = { ...portals[0], label: 'City & County portal' }
  }

  return portals.length > 0 ? portals : [{ ...WAKE_COUNTY_PORTAL, label: 'County records' }]
}

// ─── Parse address into street number + name ──────────────────────────────────

function parseAddress(addr) {
  if (!addr) return { streetNo: '', streetName: '', fullAddress: addr }
  const match = addr.trim().match(/^(\d+[A-Za-z]?)\s+(.+?)(?:,.*)?$/)
  if (match) {
    return {
      streetNo: match[1],
      streetName: match[2].split(',')[0].trim(),
      fullAddress: addr.trim(),
    }
  }
  return { streetNo: '', streetName: addr.trim(), fullAddress: addr.trim() }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PermitHistory({ address, jurisdiction, compact = false }) {
  const [copied, setCopied] = useState(false)

  if (!address && !jurisdiction) return null

  const parsed = parseAddress(address)
  const portals = getPortalsForJurisdiction(jurisdiction)
  const displayAddress = address || ''

  function copyAddress() {
    navigator.clipboard.writeText(displayAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Compact mode — used inline in wizard/contractor/developer views ──────────
  if (compact) {
    return (
      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View prior permits on this address
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {portals.map((portal, i) => {
            const url = portal.buildUrl(parsed)
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand-600 font-medium hover:text-brand-800 bg-white border border-brand-200 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-brand-50"
              >
                {portal.label || portal.name}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )
          })}
          {!portals[0]?.canPrefill && displayAddress && (
            <button
              onClick={copyAddress}
              className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium hover:text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy address
                </>
              )}
            </button>
          )}
        </div>
        {!portals[0]?.canPrefill && (
          <p className="text-xs text-gray-400 mt-1.5">{portals[0]?.note}</p>
        )}
      </div>
    )
  }

  // ── Full mode — used on /permit-history standalone page ─────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Permit history lookup</h1>
        <p className="text-sm text-gray-500">
          View all prior permits filed on a property directly from the official jurisdiction portal.
          Data is live and sourced from the municipality — not stored by Parcoria.
        </p>
      </div>

      {/* Address + jurisdiction summary */}
      {displayAddress && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Property</div>
          <div className="text-base font-medium text-gray-900">{displayAddress}</div>
          {jurisdiction && (
            <div className="text-sm text-gray-500 mt-0.5">
              {PORTALS[jurisdiction]?.name?.replace('City of ', '').replace('Town of ', '') || jurisdiction} jurisdiction
            </div>
          )}
        </div>
      )}

      {/* Portals */}
      <div className="space-y-4 mb-8">
        {portals.map((portal, i) => {
          const url = portal.buildUrl(parsed)
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{portal.name}</div>
                  {portal.label && portals.length > 1 && (
                    <div className="text-xs text-gray-400 mt-0.5">{portal.label}</div>
                  )}
                </div>
                {portal.canPrefill ? (
                  <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full whitespace-nowrap">
                    Address pre-filled
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-1 rounded-full whitespace-nowrap">
                    Manual search
                  </span>
                )}
              </div>

              {portal.note && (
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">{portal.note}</p>
              )}

              <div className="flex items-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Open {portal.name.split(' ').slice(-1)[0]} portal ↗
                </a>
                {!portal.canPrefill && displayAddress && (
                  <button
                    onClick={copyAddress}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy address
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* What to look for */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5">
        <div className="text-sm font-semibold text-brand-900 mb-3">What to look for</div>
        <div className="space-y-2">
          {[
            { flag: '🔴 Open permits', desc: 'Work started but never closed out — your project may inherit these' },
            { flag: '🟡 Expired permits', desc: 'Permitted work that was never inspected — may require re-permitting' },
            { flag: '🟢 Finaled permits', desc: 'Completed and closed — baseline for what\'s been officially permitted' },
            { flag: '⚠️ No permits on file', desc: 'Prior work may have been done without permits — a due diligence red flag' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0 mt-0.5">{item.flag.split(' ')[0]}</span>
              <div>
                <span className="text-xs font-semibold text-brand-900">{item.flag.split(' ').slice(1).join(' ')} </span>
                <span className="text-xs text-brand-700">— {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
