// ProjectBrief.jsx
// Generated project brief — all permit intelligence in one shareable document
// Homeowners: URL params (instant, no login)
// Developers: also saved to Supabase project record

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

// Import all jurisdiction data
import { PERMIT_DATA, PROFESSIONALS, INSPECTIONS, PROJECT_TYPES } from '../data/raleigh'
import { DURHAM_PERMIT_DATA, DURHAM_PROFESSIONALS, DURHAM_INSPECTIONS } from '../data/durham'
import { CHAPEL_HILL_PERMIT_DATA, CHAPEL_HILL_PROFESSIONALS, CHAPEL_HILL_INSPECTIONS } from '../data/chapelhill'
import { APEX_PERMIT_DATA, APEX_PROFESSIONALS, APEX_INSPECTIONS } from '../data/apex'
import { HOLLY_SPRINGS_PERMIT_DATA, HOLLY_SPRINGS_PROFESSIONALS, HOLLY_SPRINGS_INSPECTIONS } from '../data/hollysprings'
import { WAKE_FOREST_PERMIT_DATA, WAKE_FOREST_PROFESSIONALS, WAKE_FOREST_INSPECTIONS } from '../data/wakeforest'
import { MORRISVILLE_PERMIT_DATA, MORRISVILLE_PROFESSIONALS, MORRISVILLE_INSPECTIONS } from '../data/morrisville'
import { GARNER_PERMIT_DATA, GARNER_PROFESSIONALS, GARNER_INSPECTIONS } from '../data/garner'
import { FUQUAY_VARINA_PERMIT_DATA, FUQUAY_VARINA_PROFESSIONALS, FUQUAY_VARINA_INSPECTIONS } from '../data/fuquayvarina'
import { CARY_PERMIT_DATA, CARY_PROFESSIONALS, CARY_INSPECTIONS } from '../data/cary'

const JUR_META = {
  raleigh:      { label: 'City of Raleigh',        county: 'Wake County',   portal: 'raleighnc.gov/permits',       phone: '(919) 996-2495', inspections: 'Wake County', inspPhone: '(919) 856-6222' },
  durham:       { label: 'City of Durham',         county: 'Durham County', portal: 'dplans.durhamnc.gov + LDO',   phone: '(919) 560-4144', inspections: 'Durham City-County', inspPhone: '(919) 560-4144' },
  chapelhill:   { label: 'Town of Chapel Hill',    county: 'Orange County', portal: 'permits.townofchapelhill.org',phone: '(919) 968-2718', inspections: 'Wake County', inspPhone: '(919) 968-2718' },
  apex:         { label: 'Town of Apex',           county: 'Wake County',   portal: 'IDT Plans + ePermits',        phone: '(919) 249-3388', inspections: 'Wake County', inspPhone: '(919) 249-3388' },
  hollysprings: { label: 'Town of Holly Springs',  county: 'Wake County',   portal: 'cityviewportal.com',          phone: '311',            inspections: 'Wake County', inspPhone: '(919) 557-2591' },
  wakeforest:   { label: 'Town of Wake Forest',    county: 'Wake County',   portal: 'wakeforest.idtplans.com',     phone: '(919) 435-9531', inspections: 'Wake County', inspPhone: '(919) 435-9531' },
  morrisville:  { label: 'Town of Morrisville',    county: 'Wake County',   portal: 'morrisvillenc.gov e-Permits', phone: '(919) 463-6200', inspections: 'Wake County', inspPhone: '(919) 463-6200' },
  garner:       { label: 'Town of Garner',         county: 'Wake County',   portal: 'SmartGov Portal',             phone: '(919) 773-4433', inspections: 'Town of Garner', inspPhone: '(919) 773-4433' },
  fuquayvarina: { label: 'Town of Fuquay-Varina',  county: 'Wake County',   portal: 'fuquay-varina.org permits',   phone: '(919) 552-1429', inspections: 'Wake County', inspPhone: '(919) 552-1429' },
  cary:         { label: 'Town of Cary',           county: 'Wake County',   portal: 'coap.townofcary.org',         phone: '(919) 469-4340', inspections: 'Wake County', inspPhone: '(919) 469-4340' },
}

const PROJ_LABELS = {
  sfh: 'New single-family home', adu: 'Accessory dwelling unit (ADU)',
  addition: 'Addition', deck: 'Deck or porch', reno: 'Major renovation',
  pool: 'Pool or spa', shed: 'Shed or garage', townhouse: 'Townhouse / duplex',
}

const JUR_LABELS = {
  city:   (jur) => JUR_META[jur]?.label || jur,
  county: (jur) => JUR_META[jur]?.county || 'Wake County',
  state:  () => 'NC State',
}

const PERMIT_DATA_MAP = {
  raleigh: PERMIT_DATA, durham: DURHAM_PERMIT_DATA, chapelhill: CHAPEL_HILL_PERMIT_DATA,
  apex: APEX_PERMIT_DATA, hollysprings: HOLLY_SPRINGS_PERMIT_DATA, wakeforest: WAKE_FOREST_PERMIT_DATA,
  morrisville: MORRISVILLE_PERMIT_DATA, garner: GARNER_PERMIT_DATA,
  fuquayvarina: FUQUAY_VARINA_PERMIT_DATA, cary: CARY_PERMIT_DATA,
}

const PROS_MAP = {
  raleigh: PROFESSIONALS, durham: DURHAM_PROFESSIONALS, chapelhill: CHAPEL_HILL_PROFESSIONALS,
  apex: APEX_PROFESSIONALS, hollysprings: HOLLY_SPRINGS_PROFESSIONALS, wakeforest: WAKE_FOREST_PROFESSIONALS,
  morrisville: MORRISVILLE_PROFESSIONALS, garner: GARNER_PROFESSIONALS,
  fuquayvarina: FUQUAY_VARINA_PROFESSIONALS, cary: CARY_PROFESSIONALS,
}

const INSP_MAP = {
  raleigh: INSPECTIONS, durham: DURHAM_INSPECTIONS, chapelhill: CHAPEL_HILL_INSPECTIONS,
  apex: APEX_INSPECTIONS, hollysprings: HOLLY_SPRINGS_INSPECTIONS, wakeforest: WAKE_FOREST_INSPECTIONS,
  morrisville: MORRISVILLE_INSPECTIONS, garner: GARNER_INSPECTIONS,
  fuquayvarina: FUQUAY_VARINA_INSPECTIONS, cary: CARY_INSPECTIONS,
}

const PRO_LEVEL_STYLES = {
  required:    { dot: 'bg-red-500',   badge: 'bg-red-50 text-red-700 border-red-100',     label: 'Required by NC law' },
  recommended: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Strongly recommended' },
  optional:    { dot: 'bg-gray-400',  badge: 'bg-gray-100 text-gray-500 border-gray-200',   label: 'Optional' },
}

const JUR_COLOR = {
  city:   'bg-blue-50 text-blue-700 border-blue-100',
  county: 'bg-amber-50 text-amber-700 border-amber-100',
  state:  'bg-green-50 text-green-700 border-green-100',
}

export default function ProjectBrief() {
  const [params] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const briefRef = useRef(null)

  const jur    = params.get('j') || 'raleigh'
  const proj   = params.get('p') || 'sfh'
  const addr   = params.get('a') || ''
  const cost   = params.get('c') || ''
  const historic = params.get('h') === '1'
  const septic   = params.get('s') === '1'
  const flood    = params.get('f') === '1'
  const corner   = params.get('co') === '1'
  const floodZone = params.get('fz') || ''

  const meta    = JUR_META[jur] || JUR_META.raleigh
  const data    = (PERMIT_DATA_MAP[jur] || PERMIT_DATA)[proj] || (PERMIT_DATA_MAP[jur] || PERMIT_DATA).sfh
  const pros    = (PROS_MAP[jur] || PROFESSIONALS)[proj] || (PROS_MAP[jur] || PROFESSIONALS).sfh
  const insps   = (INSP_MAP[jur] || INSPECTIONS)[proj] || (INSP_MAP[jur] || INSPECTIONS).sfh

  const permitCount = (data?.count || 0) +
    (historic ? 1 : 0) + (septic ? 1 : 0) + (flood ? 1 : 0)

  const over40k = parseInt((cost || '0').replace(/[^0-9]/g, '')) >= 40000 ||
    ['sfh', 'adu', 'townhouse'].includes(proj)

  const generatedDate = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 print:py-4 print:px-6" ref={briefRef}>

      {/* Action bar - hidden on print */}
      <div className="flex items-center justify-between gap-3 mb-8 print:hidden">
        <Link to="/wizard" className="text-xs text-gray-400 hover:text-gray-600">
          <- Back to wizard
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:border-gray-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? 'Copied!' : 'Share link'}
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Brief</span>
              <span className="text-xs text-gray-300">-</span>
              <span className="text-xs text-gray-400">Generated {generatedDate}</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {PROJ_LABELS[proj] || proj}
            </h1>
            {addr && <p className="text-sm text-gray-500">{addr}</p>}
            <p className="text-xs text-gray-400 mt-1">{meta.label} - {meta.county}</p>
          </div>
          <div className="text-right flex-shrink-0 print:block hidden sm:block">
            <div className="text-xs text-gray-400 mb-1">Powered by</div>
            <div className="font-semibold text-gray-700 text-sm">Parcoria</div>
            <div className="text-xs text-gray-400">parcoria.com</div>
          </div>
        </div>
      </div>

      {/* Project at a glance */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project at a Glance</h2>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Project type', value: PROJ_LABELS[proj] || proj },
              { label: 'Jurisdiction', value: meta.label },
              { label: 'County', value: meta.county },
              { label: 'Permits required', value: `${permitCount} permits` },
              { label: 'Est. timeline', value: data?.timeline || '-' },
              { label: 'Est. permit fees', value: data?.fees || '-' },
              cost ? { label: 'Project cost', value: cost } : null,
              { label: 'Permit portal', value: meta.portal },
            ].filter(Boolean).map((item, i) => (
              <div key={i} className={i < 2 ? 'col-span-2 sm:col-span-1' : ''}>
                <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                <div className="text-sm font-medium text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcel conditions */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Parcel Conditions</h2>
        <div className="space-y-2">
          {[
            {
              ok: !flood,
              label: 'Flood zone',
              value: flood
                ? `High risk - ${floodZone || 'Zone A/AE'} - FEMA elevation certificate required`
                : floodZone
                ? `${floodZone} - Minimal risk - no elevation certificate required`
                : 'Zone X - Minimal flood risk (FEMA NFHL verified)',
            },
            {
              ok: !historic,
              label: 'Historic district',
              value: historic ? 'Yes - historic commission approval required before permits' : 'Not in historic district',
            },
            {
              ok: !septic,
              label: 'Utilities',
              value: septic ? 'Private well/septic - county environmental health approval required first' : 'City water & sewer',
            },
            {
              ok: !corner,
              label: 'Lot type',
              value: corner ? 'Corner lot - dual street setbacks apply' : 'Standard lot',
            },
            {
              ok: !over40k,
              label: 'Lien agent',
              value: over40k ? 'Required - project exceeds $40,000 (file at liensnc.com before work begins)' : 'Not required',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-none">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${item.ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {item.ok ? '✓' : '!'}
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-500 mr-2">{item.label}:</span>
                <span className="text-sm text-gray-800">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Permit sequence */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Permit Sequence</h2>
        {data?.phases?.map((phase, pi) => (
          <div key={pi} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{phase.label}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {phase.permits.map((pm, i) => (
              <div key={i} className={`border rounded-lg p-3 mb-2 ${pm.warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-0.5 ${pm.warn ? 'text-amber-800' : 'text-gray-900'}`}>{pm.name}</div>
                    <div className={`text-xs leading-relaxed mb-2 ${pm.warn ? 'text-amber-700' : 'text-gray-500'}`}>{pm.desc}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${JUR_COLOR[pm.jurisdiction]}`}>
                        {pm.jurisdiction === 'city' ? meta.label : pm.jurisdiction === 'county' ? meta.county : 'NC State'}
                      </span>
                      <span className="text-xs text-gray-400">- {pm.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Condition-based additions */}
        {historic && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-2">
            <div className="text-sm font-medium text-amber-800 mb-0.5">Historic district approval</div>
            <div className="text-xs text-amber-700">Historic preservation commission approval required before building permit submission. Adds 4-8 weeks.</div>
          </div>
        )}
        {septic && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-2">
            <div className="text-sm font-medium text-amber-800 mb-0.5">County environmental health approval</div>
            <div className="text-xs text-amber-700">Wake/Durham/Orange County Environmental Health must approve septic/well system before the city accepts your permit application.</div>
          </div>
        )}
        {flood && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-2">
            <div className="text-sm font-medium text-red-800 mb-0.5">FEMA elevation certificate required</div>
            <div className="text-xs text-red-700">A licensed NC surveyor must complete an elevation certificate before any permits are issued. Allow 2-4 weeks.</div>
          </div>
        )}
      </section>

      {/* Required professionals */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Licensed Professionals Required</h2>
        {['required', 'recommended'].map(level => {
          const group = pros?.filter(p => p.level === level) || []
          if (!group.length) return null
          const style = PRO_LEVEL_STYLES[level]
          return (
            <div key={level} className="mb-4">
              <div className="text-xs font-medium text-gray-400 mb-2">{style.label}</div>
              {group.map((p, i) => (
                <div key={i} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-3 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${style.dot}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-0.5">{p.name}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{p.why}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </section>

      {/* Inspection checklist */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Inspection Checklist</h2>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-3">
            Inspections performed by: <span className="font-medium text-gray-700">{meta.inspections}</span> -
            Schedule: <span className="font-medium text-gray-700">{meta.inspPhone}</span>
          </p>
          {(Array.isArray(insps) ? insps : insps?.sfh || []).map((insp, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-none">
              <div className="w-5 h-5 rounded border-2 border-gray-200 flex-shrink-0 print:block hidden" />
              <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold flex items-center justify-center flex-shrink-0 print:hidden">{i + 1}</div>
              <span className="text-sm text-gray-700">{insp}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Key contacts */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Contacts</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Permit office', name: meta.label, phone: meta.phone, url: `https://${meta.portal.split(' ')[0]}` },
            { label: 'Inspections', name: meta.inspections, phone: meta.inspPhone },
            { label: 'Lien agent filing', name: 'liensnc.com', url: 'https://www.liensnc.com' },
            { label: 'FEMA flood maps', name: 'msc.fema.gov', url: 'https://msc.fema.gov/portal/search' },
          ].map((c, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">{c.label}</div>
              <div className="text-sm font-medium text-gray-800">{c.name}</div>
              {c.phone && <div className="text-xs text-gray-500 mt-0.5">{c.phone}</div>}
              {c.url && <div className="text-xs text-brand-600 mt-0.5">{c.url.replace('https://', '')}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-5 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          Generated by <a href="https://parcoria.com" className="text-brand-600 print:text-gray-700">Parcoria</a> on {generatedDate}.
          Permit requirements are based on current municipal records and NC Building Code.
          Always verify requirements directly with your local permit office before submitting applications.
          This document does not constitute legal or professional advice.
        </p>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 0.75in; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          body { font-size: 12px; }
        }
      `}</style>
    </div>
  )
}
