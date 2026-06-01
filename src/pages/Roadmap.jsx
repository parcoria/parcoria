import { useSearchParams, Link } from 'react-router-dom'
import { PERMIT_DATA } from '../data/raleigh'
import { DURHAM_PERMIT_DATA } from '../data/durham'
import { CHAPEL_HILL_PERMIT_DATA } from '../data/chapelhill'
import { APEX_PERMIT_DATA } from '../data/apex'
import { HOLLY_SPRINGS_PERMIT_DATA } from '../data/hollysprings'
import { CARY_PERMIT_DATA } from '../data/cary'
import { WAKE_FOREST_PERMIT_DATA } from '../data/wakeforest'
import { MORRISVILLE_PERMIT_DATA } from '../data/morrisville'
import { GARNER_PERMIT_DATA } from '../data/garner'
import { FUQUAY_VARINA_PERMIT_DATA } from '../data/fuquayvarina'

const PROJ_LABELS = {
  sfh: 'New single-family home', adu: 'Accessory dwelling unit',
  addition: 'Addition or expansion', deck: 'Deck or porch',
  reno: 'Major renovation', pool: 'Pool or spa',
  shed: 'Shed or detached garage', townhouse: 'Townhouse or duplex',
}

const JUR_LABELS = {
  raleigh:      'Raleigh, NC',
  durham:       'Durham, NC',
  chapelhill:   'Chapel Hill, NC',
  apex:         'Apex, NC',
  hollysprings: 'Holly Springs, NC',
  cary:         'Cary, NC',
  wakeforest:   'Wake Forest, NC',
  morrisville:  'Morrisville, NC',
  garner:       'Garner, NC',
  fuquayvarina: 'Fuquay-Varina, NC',
}

const JURISDICTION_STYLES = {
  city:   'bg-blue-50 text-blue-700 border border-blue-100',
  county: 'bg-amber-50 text-amber-700 border border-amber-100',
  state:  'bg-green-50 text-green-700 border border-green-100',
}

const JUR_CITY_LABELS = {
  raleigh:     { city: 'City of Raleigh',          county: 'Wake County',    state: 'NC State' },
  durham:      { city: 'City of Durham',            county: 'Durham County',  state: 'NC State' },
  chapelhill:  { city: 'Town of Chapel Hill',       county: 'Orange County',  state: 'NC State' },
  apex:        { city: 'Town of Apex',              county: 'Wake County',    state: 'NC State' },
  hollysprings:{ city: 'Town of Holly Springs',     county: 'Wake County',    state: 'NC State' },
  cary:        { city: 'Town of Cary',              county: 'Wake County',    state: 'NC State' },
  wakeforest:  { city: 'Town of Wake Forest',       county: 'Wake County',    state: 'NC State' },
  morrisville: { city: 'Town of Morrisville',       county: 'Wake County',    state: 'NC State' },
  garner:      { city: 'Town of Garner',            county: 'Wake County',    state: 'NC State' },
  fuquayvarina:{ city: 'Town of Fuquay-Varina',     county: 'Wake County',    state: 'NC State' },
}

// Jurisdictions where Parcoria can pre-fill the permit application
const PREFILL_CAPABLE = ['durham', 'raleigh']

function getPermitData(jurisdiction, proj) {
  const map = {
    durham:       DURHAM_PERMIT_DATA,
    chapelhill:   CHAPEL_HILL_PERMIT_DATA,
    apex:         APEX_PERMIT_DATA,
    hollysprings: HOLLY_SPRINGS_PERMIT_DATA,
    cary:         CARY_PERMIT_DATA,
    wakeforest:   WAKE_FOREST_PERMIT_DATA,
    morrisville:  MORRISVILLE_PERMIT_DATA,
    garner:       GARNER_PERMIT_DATA,
    fuquayvarina: FUQUAY_VARINA_PERMIT_DATA,
  }
  const source = map[jurisdiction] || PERMIT_DATA
  return source[proj] || source.sfh
}

// Resolve the apply URL — either a Parcoria prefill route or the external portal
function resolveApplyUrl(pm, jurisdiction, proj, addr) {
  if (pm.applyUrl === 'PREFILL') {
    const params = new URLSearchParams({
      j: jurisdiction,
      p: proj,
      a: addr || '',
    })
    // Map permit name to permit type param
    const name = (pm.name || '').toLowerCase()
    if (name.includes('electrical'))  params.set('permit', 'electrical')
    else if (name.includes('plumbing')) params.set('permit', 'plumbing')
    else if (name.includes('mechanical') || name.includes('hvac')) params.set('permit', 'mechanical')
    else params.set('permit', 'building')
    return `/apply?${params.toString()}`
  }
  return pm.applyUrl || pm.url || '#'
}

function isPrefill(pm) {
  return pm.applyUrl === 'PREFILL'
}

export default function Roadmap() {
  const [params] = useSearchParams()
  const jurisdiction = params.get('j') || 'raleigh'
  const proj = params.get('p') || 'sfh'
  const addr = params.get('a') || ''
  const historic = params.get('h') === '1'
  const septic = params.get('s') === '1'
  const flood = params.get('f') === '1'

  const data = getPermitData(jurisdiction, proj)
  const permitCount = (data?.count || 0) + (historic ? 1 : 0) + (septic ? 1 : 0) + (flood ? 1 : 0)
  const jLabels = JUR_CITY_LABELS[jurisdiction] || JUR_CITY_LABELS.raleigh
  const canPrefill = PREFILL_CAPABLE.includes(jurisdiction)

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
          Parcoria · Shareable Permit Roadmap
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Permit roadmap — {PROJ_LABELS[proj] || 'Your project'}
        </h1>
        <p className="text-sm text-gray-400">
          {addr || JUR_LABELS[jurisdiction]} · {JUR_LABELS[jurisdiction]}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { n: permitCount,    l: 'Permits required' },
          { n: data.timeline,  l: 'Est. timeline' },
          { n: data.fees,      l: 'Est. permit fees' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-lg font-semibold text-gray-900">{s.n}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Special conditions */}
      {(historic || septic || flood) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {historic && <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">⚠️ Historic district</span>}
          {septic   && <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">⚠️ Private well/septic</span>}
          {flood    && <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">🔴 Floodplain — elevation cert required</span>}
        </div>
      )}

      {/* Prefill CTA banner — Durham and Raleigh only */}
      {canPrefill && (
        <div className="mb-5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-green-800">
              Pre-fill your permit applications
            </div>
            <div className="text-xs text-green-600 mt-0.5">
              Parcoria pre-fills the official {JUR_LABELS[jurisdiction]} forms with your project details. Download, sign, and submit.
            </div>
          </div>
          <Link
            to={`/apply?j=${jurisdiction}&p=${proj}&a=${encodeURIComponent(addr)}&permit=building`}
            className="flex-shrink-0 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Pre-fill app →
          </Link>
        </div>
      )}

      {/* Permit phases */}
      {data.phases.map((ph, pi) => (
        <div key={pi} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{ph.label}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          {ph.permits.map((pm, i) => {
            const applyHref = resolveApplyUrl(pm, jurisdiction, proj, addr)
            const detailsHref = pm.detailsUrl || null
            const prefill = isPrefill(pm)

            return (
              <div key={i} className={`flex gap-3 items-start bg-white border rounded-lg p-3 mb-2 ${pm.warn ? 'border-amber-200 bg-amber-50' : 'border-gray-100'}`}>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium mb-0.5 ${pm.warn ? 'text-amber-800' : 'text-gray-900'}`}>
                    {pm.name}
                  </div>
                  <div className={`text-xs leading-relaxed mb-2 ${pm.warn ? 'text-amber-700' : 'text-gray-500'}`}>
                    {pm.desc}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${JURISDICTION_STYLES[pm.jurisdiction]}`}>
                      {jLabels[pm.jurisdiction]}
                    </span>
                    <span className="text-xs text-gray-400">⏱ {pm.time}</span>
                  </div>

                  {/* Action links — two distinct buttons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Apply / Pre-fill */}
                    {prefill ? (
                      <Link
                        to={applyHref}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-2.5 py-1 rounded-md transition-colors"
                      >
                        📋 Pre-fill application
                      </Link>
                    ) : (
                      <a
                        href={applyHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Apply ↗
                      </a>
                    )}

                    {/* View requirements — only if we have a specific page */}
                    {detailsHref && detailsHref !== applyHref && (
                      <a
                        href={detailsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        View requirements ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Share + CTA */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-600 mb-3">Share this roadmap with your contractor, lender, or co-owner</p>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy shareable link
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/wizard"
            className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors text-center"
          >
            ← Back to wizard
          </Link>
          <Link
            to="/action-plan"
            state={{ proj, addr, jurisdiction }}
            className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors text-center"
          >
            Get my action plan ↗
          </Link>
        </div>
        <Link
          to="/"
          className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors mt-3"
        >
          Parcoria home
        </Link>
        <p className="text-xs text-gray-400 text-center mt-4">
          Generated by <a href="https://parcoria.com" className="text-brand-600">Parcoria</a> · Free permit intelligence for the Research Triangle
        </p>
      </div>
    </div>
  )
}
