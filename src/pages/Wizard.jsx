import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t, useLang } from '../lib/i18n'
import { PROJECT_TYPES, PERMIT_DATA, PROFESSIONALS, INSPECTIONS } from '../data/raleigh'
import { DURHAM_PERMIT_DATA, DURHAM_PROFESSIONALS, DURHAM_INSPECTIONS } from '../data/durham'
import { CHAPEL_HILL_PERMIT_DATA, CHAPEL_HILL_PROFESSIONALS, CHAPEL_HILL_INSPECTIONS, CHAPEL_HILL_BUILDABILITY_CHECKS } from '../data/chapelhill'
import { APEX_PERMIT_DATA, APEX_PROFESSIONALS, APEX_INSPECTIONS, APEX_BUILDABILITY_CHECKS } from '../data/apex'
import { HOLLY_SPRINGS_PERMIT_DATA, HOLLY_SPRINGS_PROFESSIONALS, HOLLY_SPRINGS_INSPECTIONS, HOLLY_SPRINGS_BUILDABILITY_CHECKS } from '../data/hollysprings'
import { WAKE_FOREST_PERMIT_DATA, WAKE_FOREST_PROFESSIONALS, WAKE_FOREST_INSPECTIONS, WAKE_FOREST_BUILDABILITY_CHECKS } from '../data/wakeforest'
import { MORRISVILLE_PERMIT_DATA, MORRISVILLE_PROFESSIONALS, MORRISVILLE_INSPECTIONS, MORRISVILLE_BUILDABILITY_CHECKS } from '../data/morrisville'
import { GARNER_PERMIT_DATA, GARNER_PROFESSIONALS, GARNER_INSPECTIONS, GARNER_BUILDABILITY_CHECKS } from '../data/garner'
import { FUQUAY_VARINA_PERMIT_DATA, FUQUAY_VARINA_PROFESSIONALS, FUQUAY_VARINA_INSPECTIONS, FUQUAY_VARINA_BUILDABILITY_CHECKS } from '../data/fuquayvarina'
import { CARY_PERMIT_DATA, CARY_PROFESSIONALS, CARY_INSPECTIONS, CARY_BUILDABILITY_CHECKS } from '../data/cary'
import Concierge from '../components/Concierge'
import BuildabilityChecker from '../components/BuildabilityChecker'
import AddressDetector from '../components/AddressDetector'
import { hasAccess, isContractor } from '../lib/access'
import { saveProject, getUser } from '../lib/supabase'
import SaveToDashboard from '../components/SaveToDashboard'
import Paywall from '../components/Paywall'
import PaywallInline from '../components/PaywallInline'

const STEPS = ['Address', 'Buildability', 'Project', 'Permits', 'Professionals']

const JURISDICTIONS = [
  { id: 'raleigh', name: 'Raleigh', county: 'Wake County', desc: 'City of Raleigh permit portal + Wake County inspections', badge: 'Most active', badgeColor: 'bg-brand-50 text-brand-700 border-brand-100' },
  { id: 'durham', name: 'Durham', county: 'Durham County', desc: 'Dplans (building) + LDO portal (trade permits & inspections)', badge: 'Dual portal', badgeColor: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 'chapelhill', name: 'Chapel Hill', county: 'Orange County', desc: 'Online Permit Center · OWASA utilities · CAPS required', badge: 'UNC district', badgeColor: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'apex', name: 'Apex', county: 'Wake County', desc: 'IDT Plans (submissions) + ePermits (payments) · Wake County inspections', badge: 'Fast growing', badgeColor: 'bg-green-50 text-green-700 border-green-100' },
  { id: 'hollysprings', name: 'Holly Springs', county: 'Wake County', desc: 'CityView Portal · Wake County inspections · One of fastest growing US towns', badge: 'High volume', badgeColor: 'bg-purple-50 text-purple-700 border-purple-100' },
  { id: 'wakeforest', name: 'Wake Forest', county: 'Wake County', desc: 'IDT Plans portal · Wake County inspections · Request inspections before 3 PM', badge: 'Growing fast', badgeColor: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'morrisville', name: 'Morrisville', county: 'Wake County', desc: 'CSS Portal · Wake County inspections · No phone inspection requests', badge: 'Tech corridor', badgeColor: 'bg-teal-50 text-teal-700 border-teal-100' },
  { id: 'garner', name: 'Garner', county: 'Wake County', desc: 'SmartGov Portal · Garner self-inspects · 24-hour notice required for all inspections', badge: 'SmartGov', badgeColor: 'bg-rose-50 text-rose-700 border-rose-100' },
]

const JURISDICTION_STYLES = {
  city:   'bg-blue-50 text-blue-700 border border-blue-100',
  county: 'bg-amber-50 text-amber-700 border border-amber-100',
  state:  'bg-green-50 text-green-700 border border-green-100',
}

const JURISDICTION_LABELS = {
  raleigh:      { city: 'City of Raleigh',       county: 'Wake County',   state: 'NC State' },
  durham:       { city: 'City of Durham',        county: 'Durham County', state: 'NC State' },
  chapelhill:   { city: 'Town of Chapel Hill',   county: 'Orange County', state: 'NC State' },
  apex:         { city: 'Town of Apex',          county: 'Wake County',   state: 'NC State' },
  hollysprings: { city: 'Town of Holly Springs', county: 'Wake County',   state: 'NC State' },
  wakeforest:   { city: 'Town of Wake Forest',   county: 'Wake County',   state: 'NC State' },
  morrisville:  { city: 'Town of Morrisville',   county: 'Wake County',   state: 'NC State' },
  garner:       { city: 'Town of Garner',        county: 'Wake County',   state: 'NC State' },
}

const PRO_STYLES = {
  required:    { badge: 'bg-red-50 text-red-700 border border-red-100',     dot: 'bg-red-500' },
  recommended: { badge: 'bg-amber-50 text-amber-700 border border-amber-100', dot: 'bg-amber-500' },
  optional:    { badge: 'bg-gray-100 text-gray-600 border border-gray-200',  dot: 'bg-gray-400' },
}

const PRO_LABELS = {
  required: 'Required by NC law',
  recommended: 'Strongly recommended',
  optional: 'Optional / situational',
}

const PROJ_LABELS = {
  sfh: 'New single-family home', adu: 'Accessory dwelling unit',
  addition: 'Addition', deck: 'Deck or porch', reno: 'Major renovation',
  pool: 'Pool or spa', shed: 'Shed / garage', townhouse: 'Townhouse / duplex',
}

function getRaleighBuildabilityChecks(flags) {
  return [
    { ok: true, title: 'City jurisdiction confirmed', desc: 'Raleigh city limits confirmed. All permits through City of Raleigh Planning & Development.' },
    { ok: true, title: 'Wake County inspection district', desc: 'Inspections scheduled through Wake County - separate from city permit applications.' },
    { ok: !flags.historic, title: flags.historic ? 'Historic district - flagged by you' : 'No historic district reported', desc: flags.historic ? 'Certificate of Appropriateness from RHDC required before any building permit submission.' : 'You indicated no historic district. Verify at raleighnc.gov before submitting.', verifyUrl: 'https://raleighnc.gov/planning/services/historic-preservation', verifyLabel: 'Verify historic district' },
    { ok: !flags.septic, title: flags.septic ? 'Private well/septic - Wake County approval needed' : 'City water & sewer reported', desc: flags.septic ? 'Wake County Environmental Services must approve before city accepts your application.' : 'You indicated city utilities. Confirm availability with Raleigh Water at water.review@raleighnc.gov.' },
    { ok: !flags.corner, title: flags.corner ? 'Corner lot - dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages. Verify with your surveyor.' : 'Standard setbacks apply. Confirm for your zoning district in Raleigh UDO.' },
  ]
}

export default function Wizard() {
  const navigate = useNavigate()
  useLang() // re-render on language change
  const [step, setStep] = useState(1)
  const [state, setState] = useState({
    jurisdiction: '', addr: '', proj: '', projs: [], cost: '',
    historic: false, septic: false, flood: false, corner: false,
  })
  const [activeProj, setActiveProj] = useState(null) // which tab is active in multi-project roadmap
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  function update(key, val) { setState(s => ({ ...s, [key]: val })) }

  // Toggle a project type on/off in multi-select
  // Some types are mutually exclusive — can't build SFH + ADU + Townhouse together
  const SOLO_TYPES = ['sfh', 'adu', 'townhouse'] // these are standalone, can't be combined
  function toggleProj(id) {
    setState(s => {
      const current = s.projs || []
      if (current.includes(id)) {
        // Deselect
        const next = current.filter(p => p !== id)
        return { ...s, projs: next, proj: next[0] || '' }
      }
      // Selecting a solo type clears everything else; selecting a non-solo clears solo types
      let next
      if (SOLO_TYPES.includes(id)) {
        next = [id] // solo — replace all
      } else {
        next = [...current.filter(p => !SOLO_TYPES.includes(p)), id]
      }
      return { ...s, projs: next, proj: next[0] || '' }
    })
    // Set active tab to the newly selected project
    setActiveProj(id)
  }

  function getDataForProj(projId) {
    const p = projId || state.proj
    if (isDurham) return DURHAM_PERMIT_DATA[p] || DURHAM_PERMIT_DATA.sfh
    if (isChapelHill) return CHAPEL_HILL_PERMIT_DATA[p] || CHAPEL_HILL_PERMIT_DATA.sfh
    if (isApex) return APEX_PERMIT_DATA[p] || APEX_PERMIT_DATA.sfh
    if (isHollySprings) return HOLLY_SPRINGS_PERMIT_DATA[p] || HOLLY_SPRINGS_PERMIT_DATA.sfh
    if (isWakeForest) return WAKE_FOREST_PERMIT_DATA[p] || WAKE_FOREST_PERMIT_DATA.sfh
    if (isMorrisville) return MORRISVILLE_PERMIT_DATA[p] || MORRISVILLE_PERMIT_DATA.sfh
    if (isGarner) return GARNER_PERMIT_DATA[p] || GARNER_PERMIT_DATA.sfh
    if (isFuquayVarina) return FUQUAY_VARINA_PERMIT_DATA[p] || FUQUAY_VARINA_PERMIT_DATA.sfh
    if (isCary) return CARY_PERMIT_DATA[p] || CARY_PERMIT_DATA.sfh
    return PERMIT_DATA[p] || PERMIT_DATA.sfh
  }
  async function next() {
    // When moving from step 4 to step 5 and user has access, save project
    if (step === 3 && hasAccess() && state.proj && state.jurisdiction) {
      try {
        const user = await getUser()
        if (user) {
          await saveProject({
            name: allProjs.length > 1
              ? `${allProjs.map(p => PROJ_LABELS[p] || p).join(' + ')} - ${state.addr || state.jurisdiction}`
              : `${state.proj === 'sfh' ? 'New Home' : state.proj} - ${state.addr || state.jurisdiction}`,
            jurisdiction: state.jurisdiction,
            addr: state.addr,
            proj: state.proj,
            projs: state.projs || [state.proj],
            cost: state.cost,
            historic: state.historic,
            septic: state.septic,
            flood: state.flood,
            corner: state.corner,
            permitCount: totalPermitCount,
            timeline: allProjs.length > 1 ? maxTimeline : data?.timeline,
            fees: allProjs.length > 1 ? combinedFees : data?.fees,
            status: 'active',
          })
        }
      } catch (err) {
        // Silent fail - don't block the wizard if save fails
        console.error('Project save error:', err.message)
      }
    }
    setStep(s => s + 1)
  }
  function back() { setStep(s => s - 1) }

  const isRaleigh = state.jurisdiction === 'raleigh' || state.jurisdiction === ''
  const isDurham = state.jurisdiction === 'durham'
  const isChapelHill = state.jurisdiction === 'chapelhill'
  const isApex = state.jurisdiction === 'apex'
  const isHollySprings = state.jurisdiction === 'hollysprings'
  const isWakeForest = state.jurisdiction === 'wakeforest'
  const isMorrisville = state.jurisdiction === 'morrisville'
  const isGarner = state.jurisdiction === 'garner'
  const isFuquayVarina = state.jurisdiction === 'fuquayvarina'
  const isCary = state.jurisdiction === 'cary'

  function getPermitData() { return getDataForProj(state.proj) }

  function getPros() {
    if (isDurham) return DURHAM_PROFESSIONALS[state.proj] || DURHAM_PROFESSIONALS.sfh
    if (isChapelHill) return CHAPEL_HILL_PROFESSIONALS[state.proj] || CHAPEL_HILL_PROFESSIONALS.sfh
    if (isApex) return APEX_PROFESSIONALS[state.proj] || APEX_PROFESSIONALS.sfh
    if (isHollySprings) return HOLLY_SPRINGS_PROFESSIONALS[state.proj] || HOLLY_SPRINGS_PROFESSIONALS.sfh
    if (isWakeForest) return WAKE_FOREST_PROFESSIONALS[state.proj] || WAKE_FOREST_PROFESSIONALS.sfh
    if (isMorrisville) return MORRISVILLE_PROFESSIONALS[state.proj] || MORRISVILLE_PROFESSIONALS.sfh
    if (isGarner) return GARNER_PROFESSIONALS[state.proj] || GARNER_PROFESSIONALS.sfh
    if (isFuquayVarina) return FUQUAY_VARINA_PROFESSIONALS[state.proj] || FUQUAY_VARINA_PROFESSIONALS.sfh
    if (isCary) return CARY_PROFESSIONALS[state.proj] || CARY_PROFESSIONALS.sfh
    return PROFESSIONALS[state.proj] || PROFESSIONALS.sfh
  }

  function getInsps() {
    if (isDurham) return DURHAM_INSPECTIONS[state.proj] || DURHAM_INSPECTIONS.sfh
    if (isChapelHill) return CHAPEL_HILL_INSPECTIONS[state.proj] || CHAPEL_HILL_INSPECTIONS.sfh
    if (isApex) return APEX_INSPECTIONS[state.proj] || APEX_INSPECTIONS.sfh
    if (isHollySprings) return HOLLY_SPRINGS_INSPECTIONS[state.proj] || HOLLY_SPRINGS_INSPECTIONS.sfh
    if (isWakeForest) return WAKE_FOREST_INSPECTIONS[state.proj] || WAKE_FOREST_INSPECTIONS.sfh
    if (isMorrisville) return MORRISVILLE_INSPECTIONS[state.proj] || MORRISVILLE_INSPECTIONS.sfh
    if (isGarner) return GARNER_INSPECTIONS[state.proj] || GARNER_INSPECTIONS.sfh
    if (isFuquayVarina) return FUQUAY_VARINA_INSPECTIONS[state.proj] || FUQUAY_VARINA_INSPECTIONS.sfh
    if (isCary) return CARY_INSPECTIONS[state.proj] || CARY_INSPECTIONS.sfh
    return INSPECTIONS[state.proj] || INSPECTIONS.sfh
  }

  function getBuildabilityChecks() {
    const flags = { historic: state.historic, septic: state.septic, flood: state.flood, corner: state.corner }
    if (isChapelHill) return CHAPEL_HILL_BUILDABILITY_CHECKS(flags)
    if (isApex) return APEX_BUILDABILITY_CHECKS(flags)
    if (isHollySprings) return HOLLY_SPRINGS_BUILDABILITY_CHECKS(flags)
    if (isWakeForest) return WAKE_FOREST_BUILDABILITY_CHECKS(flags)
    if (isMorrisville) return MORRISVILLE_BUILDABILITY_CHECKS(flags)
    if (isGarner) return GARNER_BUILDABILITY_CHECKS(flags)
    if (isFuquayVarina) return FUQUAY_VARINA_BUILDABILITY_CHECKS(flags)
    if (isCary) return CARY_BUILDABILITY_CHECKS(flags)
    return getRaleighBuildabilityChecks(flags)
  }

  function getInspectionNote() {
    if (isDurham) return 'Schedule all inspections through the LDO portal at ldo4.durhamnc.gov'
    if (isChapelHill) return 'Schedule via Online Permit Center, call (919) 968-2718, or email permits@townofchapelhill.org. Cancel by 9:30 AM day-of to avoid $60 re-inspection fee.'
    if (isApex) return 'Schedule by 2:00 PM the day before via online form or call (919) 249-3388. Wake County performs all field inspections.'
    if (isHollySprings) return 'Request through CityView Portal or call 311. Before 4 PM = next day. After 4 PM = second business day. Wake County performs all field inspections.'
    if (isWakeForest) return 'Request through IDT Plans portal before 3 PM for next business day. Call (919) 435-9531 at 8:30 AM day-of for inspector ETA. Wake County performs all field inspections.'
    if (isMorrisville) return 'All inspections scheduled through CSS Portal only - no phone requests accepted. Wake County performs all field inspections.'
    if (isGarner) return 'Schedule through SmartGov Portal only - no phone or email. 24-hour notice required for ALL inspections. No same-day inspections. Garner Inspections Department performs its own field inspections.'
    if (isFuquayVarina) return 'Schedule through Fuquay-Varina permit portal. Wake County performs all field inspections.'
    if (isCary) return 'Schedule all inspections through coap.townofcary.org. Wake County performs all field inspections.'
    return 'Schedule all inspections through Wake County'
  }

  function shareRoadmap() {
    const params = new URLSearchParams({
      j: state.jurisdiction, p: state.proj, a: state.addr,
      h: state.historic ? '1' : '0', s: state.septic ? '1' : '0', f: state.flood ? '1' : '0',
    })
    const url = `${window.location.origin}/roadmap?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable roadmap link copied! Send it to your contractor, lender, or co-owner.')
    }).catch(() => window.open(url, '_blank'))
  }

  const data = getPermitData()
  const pros = getPros()
  const insps = getInsps()

  // Multi-project: aggregate permit counts, combine timelines, sum fees
  const allProjs = state.projs?.length > 0 ? state.projs : (state.proj ? [state.proj] : [])
  const allProjData = allProjs.map(p => getDataForProj(p))
  const totalPermitCount = allProjData.reduce((sum, d) => sum + (d?.count || 0), 0)
    + (state.historic ? 1 : 0) + (state.septic ? 1 : 0) + (state.flood ? 1 : 0)
  const permitCount = totalPermitCount
  // Timeline: take the longest single project timeline (they run in parallel on the same site)
  const maxTimeline = allProjData.reduce((max, d) => {
    const weeks = parseInt(d?.timeline) || 0
    return weeks > parseInt(max) ? d?.timeline : max
  }, data?.timeline || '0')
  // Fees: sum all project fees
  const totalFees = allProjData.reduce((sum, d) => {
    const fee = parseInt((d?.fees || '0').replace(/[^0-9]/g, '')) || 0
    return sum + fee
  }, 0)
  const combinedFees = totalFees > 0 ? `$${totalFees.toLocaleString()}` : data?.fees

  const over40k = parseInt((state.cost || '0').replace(/[^0-9]/g, '')) >= 40000 || ['sfh', 'adu', 'townhouse'].includes(state.proj)
  const jLabels = JURISDICTION_LABELS[state.jurisdiction] || JURISDICTION_LABELS.raleigh
  const displayActiveProj = activeProj || allProjs[0] || state.proj
  const cityName = isChapelHill ? 'Chapel Hill' : isDurham ? 'Durham' : isApex ? 'Apex' : isHollySprings ? 'Holly Springs' : isWakeForest ? 'Wake Forest' : isMorrisville ? 'Morrisville' : isGarner ? 'Garner' : isFuquayVarina ? 'Fuquay-Varina' : isCary ? 'Cary' : 'Raleigh'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Progress bar */}
      <div className="flex items-center mb-10">
        {STEPS.map((label, i) => {
          const num = i + 1
          const done = step > num
          const active = step === num
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? '✓' : num}
                </div>
                <span className={`text-xs hidden sm:block ${active ? 'text-gray-900 font-medium' : done ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-100 mx-2" />}
            </div>
          )
        })}
      </div>

      {/* ── Step 1 - Smart Address + Jurisdiction Detection ── */}
      {step === 1 && (
        <AddressDetector
          onComplete={(result) => {
            update('addr', result.addr)
            update('jurisdiction', result.jurisdiction)
            update('historic', result.historic)
            update('septic', result.septic)
            update('corner', result.corner)
            update('flood', result.flood)
            setState(s => ({ ...s,
              addr: result.addr,
              jurisdiction: result.jurisdiction,
              historic: result.historic,
              septic: result.septic,
              corner: result.corner,
              flood: result.flood,
              detectedFloodResult: result.floodResult,
            }))
            next()
          }}
        />
      )}

      {/* ── Step 2 - Buildability ── */}
      {step === 2 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 2 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Buildability check</h2>
          <p className="text-sm text-gray-500 mb-5">We run a live FEMA flood zone check on your address alongside your reported parcel conditions.</p>

          {isChapelHill && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex gap-2 text-xs text-amber-700">
              <span className="flex-shrink-0">⚠️</span>
              <span><strong>Chapel Hill CAPS requirement:</strong> Obtain your Certificate of Adequate Public Schools from Chapel Hill-Carrboro City Schools before any other permit.</span>
            </div>
          )}

          <BuildabilityChecker
            address={state.addr}
            jurisdiction={state.jurisdiction}
            flags={{ historic: state.historic, septic: state.septic, flood: state.flood, corner: state.corner }}
            onFloodDetected={(isHighRisk) => { if (isHighRisk) update('flood', true) }}
            customChecks={!isDurham && !isRaleigh ? getBuildabilityChecks() : undefined}
          />

          <div className="flex gap-2 mt-6">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← {t('wiz_back')}</button>
            <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">Continue to project type</button>
          </div>
        </div>
      )}

      {/* ── Step 3 - Project type ── */}
      {step === 3 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 3 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What are you building?</h2>
          <p className="text-sm text-gray-500 mb-1">Select all that apply — multiple projects on the same site get a combined permit roadmap.</p>
          <p className="text-xs text-gray-400 mb-5">Note: SFH, ADU, and Townhouse are standalone projects and can't be combined.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {PROJECT_TYPES.map(pt => {
              const selected = (state.projs || []).includes(pt.id)
              const isSolo = SOLO_TYPES.includes(pt.id)
              const otherSoloSelected = (state.projs || []).some(p => SOLO_TYPES.includes(p) && p !== pt.id)
              const disabled = !selected && otherSoloSelected && !isSolo
              return (
                <button key={pt.id} onClick={() => !disabled && toggleProj(pt.id)}
                  disabled={disabled}
                  className={`text-left border rounded-xl p-3 transition-all relative ${
                    selected
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : disabled
                        ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  {selected && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className={`text-xs font-semibold mb-0.5 ${selected ? 'text-brand-700' : 'text-gray-800'}`}>{pt.label}</div>
                  <div className="text-xs text-gray-400">{pt.sub}</div>
                </button>
              )
            })}
          </div>

          {/* Selected summary */}
          {(state.projs || []).length > 1 && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-5">
              <div className="text-xs font-semibold text-brand-800 mb-1">
                {state.projs.length} projects selected — combined roadmap
              </div>
              <div className="flex flex-wrap gap-1.5">
                {state.projs.map(p => (
                  <span key={p} className="text-xs bg-white border border-brand-200 text-brand-700 px-2 py-0.5 rounded-full">
                    {PROJ_LABELS[p] || p}
                    <button onClick={() => toggleProj(p)} className="ml-1 text-brand-400 hover:text-brand-700">×</button>
                  </span>
                ))}
              </div>
              <div className="text-xs text-brand-600 mt-2">
                Each project gets its own permit application. Timeline shows longest project; fees are combined.
              </div>
            </div>
          )}

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-700 block mb-1">Total estimated project cost</label>
            <p className="text-xs text-gray-400 mb-2">NC law requires a licensed GC and lien agent for projects $40,000+</p>
            <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. $280,000" value={state.cost} onChange={e => update('cost', e.target.value)} />
          </div>

          <div className="flex gap-2">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← {t('wiz_back')}</button>
            <button onClick={next} disabled={!(state.projs?.length > 0 || state.proj)}
              className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              Generate permit roadmap{(state.projs?.length || 0) > 1 ? ` for ${state.projs.length} projects` : ''}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4 - Permits (GATED) ── */}
      {step === 4 && (
        <div>
          {/* Multi-project tab bar */}
          {allProjs.length > 1 && (
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
              {allProjs.map(p => (
                <button key={p} onClick={() => setActiveProj(p)}
                  className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-all ${
                    displayActiveProj === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {PROJ_LABELS[p] || p}
                </button>
              ))}
              <button onClick={() => setActiveProj('combined')}
                className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-all ${
                  displayActiveProj === 'combined' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                All permits
              </button>
            </div>
          )}
          {!hasAccess() ? (
            <>
              <p className="text-xs text-gray-400 mb-1">Step 4 of 5</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {allProjs.length > 1 ? `Combined permit roadmap — ${allProjs.length} projects` : `Permit roadmap - ${PROJ_LABELS[state.proj] || 'your project'}`}
              </h2>
              <p className="text-xs text-gray-400 mb-5">{state.addr || `${cityName}, NC`}</p>

              {/* Stats - always visible */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { n: permitCount, l: t('wiz_permits_req') },
                  { n: allProjs.length > 1 ? maxTimeline : data.timeline, l: t('wiz_est_timeline') },
                  { n: allProjs.length > 1 ? combinedFees : data.fees, l: t('wiz_est_fees') },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">{s.n}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Free preview - first 2 permits visible */}
              {(() => {
                const allPermits = data.phases.flatMap(ph => ph.permits.map(pm => ({ ...pm, phaseLabel: ph.label })))
                const freePermits = allPermits.slice(0, 2)
                const lockedCount = permitCount - 2
                return (
                  <div>
                    {/* Visible permits */}
                    {freePermits.map((pm, i) => (
                      <div key={i} className={`flex gap-3 items-start border rounded-lg p-3 mb-2 ${pm.warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium mb-0.5 ${pm.warn ? 'text-amber-800' : 'text-gray-900'}`}>{pm.name}</div>
                          <div className={`text-xs leading-relaxed mb-2 ${pm.warn ? 'text-amber-700' : 'text-gray-500'}`}>{pm.desc}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${JURISDICTION_STYLES[pm.jurisdiction]}`}>{jLabels[pm.jurisdiction]}</span>
                            <span className="text-xs text-gray-400">⏱ {pm.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Blurred locked permits */}
                    <div className="relative">
                      {/* Blurred preview cards */}
                      <div className="blur-sm pointer-events-none select-none">
                        {[...Array(Math.min(3, lockedCount))].map((_, i) => (
                          <div key={i} className="flex gap-3 items-start border border-gray-100 rounded-lg p-3 mb-2 bg-white">
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                              <div className="flex gap-2">
                                <div className="h-5 bg-gray-100 rounded-full w-20" />
                                <div className="h-5 bg-gray-100 rounded-full w-16" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Paywall overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.97) 60%)'}}>
                        <div className="bg-white border-2 border-brand-200 rounded-2xl p-6 mx-4 text-center shadow-sm w-full max-w-sm">
                          <div className="text-2xl font-semibold text-gray-900 mb-1">
                            +{lockedCount} more permit{lockedCount !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-500 mb-4 leading-relaxed">
                            Unlock the full roadmap, AI Concierge, licensed professionals guide, and Plan Pre-Check for $79.
                          </div>
                          <PaywallInline jurisdiction={state.jurisdiction} proj={state.proj} addr={state.addr} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              <button onClick={back} className="w-full mt-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
                ← Back to project type
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-1">Step 4 of 5</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {allProjs.length > 1 ? `Combined permit roadmap — ${allProjs.length} projects` : `Permit roadmap - ${PROJ_LABELS[state.proj] || 'your project'}`}
              </h2>
              <p className="text-xs text-gray-400 mb-5">{state.addr || `${cityName}, NC`}</p>

              {isDurham && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex gap-2 text-xs text-amber-700">
                  <span className="flex-shrink-0">ℹ️</span>
                  <span><strong>Durham dual portal:</strong> Building permits → Dplans. Trade permits, fees & inspections → LDO portal.</span>
                </div>
              )}
              {isChapelHill && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex gap-2 text-xs text-amber-700">
                  <span className="flex-shrink-0">⚠️</span>
                  <span><strong>CAPS first:</strong> Obtain your Certificate of Adequate Public Schools from CHCCS before submitting any permits.</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { n: permitCount, l: t('wiz_permits_req') },
                  { n: allProjs.length > 1 ? maxTimeline : data.timeline, l: t('wiz_est_timeline') },
                  { n: allProjs.length > 1 ? combinedFees : data.fees, l: t('wiz_est_fees') },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">{s.n}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* In multi-project mode, show active tab's data OR all combined */}
              {(() => {
                const renderProjs = displayActiveProj === 'combined'
                  ? allProjs
                  : [displayActiveProj || state.proj]
                return renderProjs.map(projId => {
                  const projData = getDataForProj(projId)
                  return (
                    <div key={projId}>
                      {allProjs.length > 1 && displayActiveProj === 'combined' && (
                        <div className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-1.5 mb-3">
                          {PROJ_LABELS[projId] || projId}
                        </div>
                      )}
                      {projData.phases.map((ph, pi) => (
                        <div key={pi} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{ph.label}</span>
                            <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  {ph.permits.map((pm, i) => (
                    <div key={i} className={`flex gap-3 items-start border rounded-lg p-3 mb-2 ${pm.warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium mb-0.5 ${pm.warn ? 'text-amber-800' : 'text-gray-900'}`}>{pm.name}</div>
                        <div className={`text-xs leading-relaxed mb-2 ${pm.warn ? 'text-amber-700' : 'text-gray-500'}`}>{pm.desc}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${JURISDICTION_STYLES[pm.jurisdiction]}`}>{jLabels[pm.jurisdiction]}</span>
                          {pm.portal && isDurham && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">{pm.portal}</span>}
                          <span className="text-xs text-gray-400">⏱ {pm.time}</span>
                        </div>
                        <a href={pm.url} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-700 mt-1.5 inline-block">Apply / view details ↗</a>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
                    </div>
                  )
                })
              })()}

              {state.historic && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Historic district</span><div className="flex-1 h-px bg-amber-100" /></div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-amber-800 mb-1">{isDurham ? 'Durham HPC approval required' : isChapelHill ? 'Chapel Hill Historic District Commission approval' : 'Certificate of appropriateness'}</div>
                    <div className="text-xs text-amber-700 leading-relaxed">Historic preservation approval required before building permit submission. Adds 4–8 weeks.</div>
                  </div>
                </div>
              )}
              {state.septic && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Well & septic</span><div className="flex-1 h-px bg-amber-100" /></div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-amber-800 mb-1">{isDurham ? 'Durham County Environmental Health approval' : isChapelHill ? 'Orange County Environmental Health approval' : 'Wake County septic / well approval'}</div>
                    <div className="text-xs text-amber-700 leading-relaxed">County environmental health must approve before city accepts permit application.</div>
                  </div>
                </div>
              )}
              {state.flood && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Floodplain - FEMA</span><div className="flex-1 h-px bg-red-100" /></div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-red-800 mb-1">FEMA elevation certificate required</div>
                    <div className="text-xs text-red-700 leading-relaxed">A licensed NC surveyor must complete an elevation certificate before any permits are issued.</div>
                  </div>
                </div>
              )}

              {/* Contractor directory CTA - shown on every run */}
              <div className="mt-5 bg-brand-50 border border-brand-100 rounded-xl px-4 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-brand-900">Find verified contractors</div>
                  <div className="text-xs text-brand-700 mt-0.5">Browse NC license-verified professionals in the Triangle.</div>
                </div>
                <a href="/directory"
                  className="flex-shrink-0 text-xs px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium whitespace-nowrap">
                  Browse directory ↗
                </a>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← {t('wiz_back')}</button>
                <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">See required professionals</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Step 5 - Professionals ── */}
      {step === 5 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 5 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Licensed professionals required</h2>
          <p className="text-sm text-gray-500 mb-5">Based on your project, location, and cost - exactly who NC law requires and why.</p>

          {over40k && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-amber-800">NC licensing law applies to your project</div>
                <div className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Projects $40,000+ require a licensed NC General Contractor. Owner-builders must file an <strong>Owner Exemption Affidavit</strong> - only valid for homes you intend to occupy, not for resale.
                  {isChapelHill && ' In Chapel Hill, the GC of record is responsible for paying all permit fees.'}
                </div>
              </div>
            </div>
          )}

          {['required', 'recommended', 'optional'].map(level => {
            const group = pros.filter(p => p.level === level)
            if (!group.length) return null
            return (
              <div key={level} className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{PRO_LABELS[level]}</div>
                {group.map((p, i) => (
                  <div key={i} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-3 mb-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${PRO_STYLES[p.level].dot}`} />
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-0.5">{p.name}</div>
                      <div className="text-xs text-gray-500 leading-relaxed mb-1.5">{p.why}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRO_STYLES[p.level].badge}`}>{PRO_LABELS[p.level]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}

          {/* Contractor directory CTA */}
          <div className="my-5 bg-brand-50 border border-brand-100 rounded-xl px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-brand-900">Find verified contractors</div>
              <div className="text-xs text-brand-700 mt-0.5">Browse Parcoria's directory of NC license-verified professionals in the Triangle.</div>
            </div>
            <a
              href="/directory"
              className="flex-shrink-0 text-xs px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium whitespace-nowrap"
            >
              Browse directory ↗
            </a>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          <h3 className="text-sm font-semibold text-gray-900 mb-1">Inspection timeline</h3>
          <p className="text-xs text-gray-400 mb-3">{getInspectionNote()}</p>
          {insps.map((ins, i) => (
            <div key={i} className="flex gap-3 items-center py-2.5 border-b border-gray-100 last:border-none">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</div>
              <span className="text-sm text-gray-700">{ins}</span>
            </div>
          ))}

          {/* AI Concierge */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2">Ask the AI Concierge</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <Concierge projectData={{
              addr: state.addr, proj: state.proj, cost: state.cost,
              historic: state.historic, septic: state.septic, flood: state.flood, corner: state.corner,
              jurisdiction: state.jurisdiction, permitCount, timeline: data.timeline, fees: data.fees,
            }} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button onClick={back} className="py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← {t('wiz_back')}</button>
            <button onClick={() => navigate('/action-plan', { state: { proj: state.proj, addr: state.addr, jurisdiction: state.jurisdiction } })}
              className="py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
              {t('wiz_action_plan')}
            </button>
          </div>
          {/* Save to dashboard button - only shown when authenticated */}
          <SaveToDashboard
            state={state}
            data={data}
            saveStatus={saveStatus}
            setSaveStatus={setSaveStatus}
          />

          {!isContractor() && <button onClick={shareRoadmap}
            className="w-full mt-2 py-2.5 border border-brand-200 text-brand-700 bg-brand-50 text-sm font-medium rounded-lg hover:bg-brand-100 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t('wiz_share')}
          </button>}
          <button
            onClick={() => {
              const params = new URLSearchParams({
                j: state.jurisdiction, p: state.proj, a: state.addr || '',
                c: state.cost || '', h: state.historic ? '1' : '0',
                s: state.septic ? '1' : '0', f: state.flood ? '1' : '0',
                co: state.corner ? '1' : '0',
              })
              window.open(`/brief?${params.toString()}`, '_blank')
            }}
            className="w-full mt-2 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('wiz_generate_brief')}
          </button>
          {['durham', 'raleigh'].includes(state.jurisdiction) && (
            allProjs.length > 1 ? (
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-600 mb-1.5">Pre-fill {state.jurisdiction === 'raleigh' ? 'Raleigh' : 'Durham'} permit applications:</div>
                <div className="space-y-1.5">
                  {allProjs.map(projId => (
                    <button key={projId}
                      onClick={() => {
                        const params = new URLSearchParams({
                          a: state.addr || '', p: projId,
                          s: state.septic ? '1' : '0', j: state.jurisdiction,
                        })
                        window.open(`/apply?${params.toString()}`, '_blank')
                      }}
                      className="w-full py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Pre-fill — {PROJ_LABELS[projId] || projId}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    a: state.addr || '', p: state.proj || 'sfh',
                    s: state.septic ? '1' : '0', j: state.jurisdiction,
                  })
                  window.open(`/apply?${params.toString()}`, '_blank')
                }}
                className="w-full mt-2 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Pre-fill {state.jurisdiction === 'raleigh' ? 'Raleigh' : 'Durham'} permit application
              </button>
            )
          )}
          <button onClick={() => window.location.href = '/'}
            className="w-full mt-2 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
            Back to home
          </button>
        </div>
      )}
    </div>
  )
}
