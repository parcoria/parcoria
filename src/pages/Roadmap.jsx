import { useSearchParams, Link } from 'react-router-dom'
import { PERMIT_DATA } from '../data/raleigh'
import { DURHAM_PERMIT_DATA } from '../data/durham'
import { CHAPEL_HILL_PERMIT_DATA } from '../data/chapelhill'
import { APEX_PERMIT_DATA } from '../data/apex'
import { HOLLY_SPRINGS_PERMIT_DATA } from '../data/hollysprings'

const PROJ_LABELS = {
  sfh: 'New single-family home', adu: 'Accessory dwelling unit',
  addition: 'Addition or expansion', deck: 'Deck or porch',
  reno: 'Major renovation', pool: 'Pool or spa',
  shed: 'Shed or detached garage', townhouse: 'Townhouse or duplex',
}

const JUR_LABELS = {
  raleigh: 'Raleigh, NC', durham: 'Durham, NC',
  chapelhill: 'Chapel Hill, NC', apex: 'Apex, NC', hollysprings: 'Holly Springs, NC',
}

const JURISDICTION_STYLES = {
  city:   'bg-blue-50 text-blue-700 border border-blue-100',
  county: 'bg-amber-50 text-amber-700 border border-amber-100',
  state:  'bg-green-50 text-green-700 border border-green-100',
}

const JUR_CITY_LABELS = {
  raleigh:     { city: 'City of Raleigh',     county: 'Wake County',    state: 'NC State' },
  durham:      { city: 'City of Durham',      county: 'Durham County',  state: 'NC State' },
  chapelhill:  { city: 'Town of Chapel Hill', county: 'Orange County',  state: 'NC State' },
  apex:        { city: 'Town of Apex',        county: 'Wake County',    state: 'NC State' },
  hollysprings:{ city: 'Town of Holly Springs', county: 'Wake County', state: 'NC State' },
}

function getPermitData(jurisdiction, proj) {
  const map = {
    durham: DURHAM_PERMIT_DATA,
    chapelhill: CHAPEL_HILL_PERMIT_DATA,
    apex: APEX_PERMIT_DATA,
    hollysprings: HOLLY_SPRINGS_PERMIT_DATA,
  }
  const source = map[jurisdiction] || PERMIT_DATA
  return source[proj] || source.sfh
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

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
          Parcoria · Shareable Permit Roadmap
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {PROJ_LABELS[proj] || 'Your project'}
        </h1>
        <p className="text-sm text-gray-400">
          {addr || JUR_LABELS[jurisdiction]} · {JUR_LABELS[jurisdiction]}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { n: permitCount, l: 'Permits required' },
          { n: data.timeline, l: 'Est. timeline' },
          { n: data.fees, l: 'Est. permit fees' },
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
          {septic && <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">⚠️ Private well/septic</span>}
          {flood && <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">🔴 Floodplain — elevation cert required</span>}
        </div>
      )}

      {/* Permit phases */}
      {data.phases.map((ph, pi) => (
        <div key={pi} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{ph.label}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          {ph.permits.map((pm, i) => (
            <div key={i} className="flex gap-3 items-start bg-white border border-gray-100 rounded-lg p-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-0.5">{pm.name}</div>
                <div className="text-xs text-gray-500 leading-relaxed mb-2">{pm.desc}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${JURISDICTION_STYLES[pm.jurisdiction]}`}>
                    {jLabels[pm.jurisdiction]}
                  </span>
                  <span className="text-xs text-gray-400">⏱ {pm.time}</span>
                </div>
                <a href={pm.url} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-700 mt-1.5 inline-block">
                  Apply / view details ↗
                </a>
              </div>
            </div>
          ))}
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
            to="/"
            className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors text-center"
          >
            Parcoria home
          </Link>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Generated by <a href="https://parcoria.com" className="text-brand-600">Parcoria</a> · Free permit intelligence for the Research Triangle
        </p>
      </div>
    </div>
  )
}
