import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROJECT_TYPES, PERMIT_DATA, PROFESSIONALS, INSPECTIONS } from '../data/raleigh'
import { DURHAM_PERMIT_DATA, DURHAM_PROFESSIONALS, DURHAM_INSPECTIONS } from '../data/durham'
import { CHAPEL_HILL_PERMIT_DATA, CHAPEL_HILL_PROFESSIONALS, CHAPEL_HILL_INSPECTIONS, CHAPEL_HILL_BUILDABILITY_CHECKS } from '../data/chapelhill'
import { APEX_PERMIT_DATA, APEX_PROFESSIONALS, APEX_INSPECTIONS, APEX_BUILDABILITY_CHECKS } from '../data/apex'
import { HOLLY_SPRINGS_PERMIT_DATA, HOLLY_SPRINGS_PROFESSIONALS, HOLLY_SPRINGS_INSPECTIONS, HOLLY_SPRINGS_BUILDABILITY_CHECKS } from '../data/hollysprings'
import Concierge from '../components/Concierge'
import BuildabilityChecker from '../components/BuildabilityChecker'
import { startCheckout } from '../lib/checkout'
import { hasAccess } from '../lib/access'
import { saveProject, getUser } from '../lib/supabase'
import SaveToDashboard from '../components/SaveToDashboard'
import Paywall from '../components/Paywall'

const STEPS = ['Jurisdiction', 'Address', 'Buildability', 'Project', 'Permits', 'Professionals']

const JURISDICTIONS = [
  { id: 'raleigh', name: 'Raleigh', county: 'Wake County', desc: 'City of Raleigh permit portal + Wake County inspections', badge: 'Most active', badgeColor: 'bg-brand-50 text-brand-700 border-brand-100' },
  { id: 'durham', name: 'Durham', county: 'Durham County', desc: 'Dplans (building) + LDO portal (trade permits & inspections)', badge: 'Dual portal', badgeColor: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 'chapelhill', name: 'Chapel Hill', county: 'Orange County', desc: 'Online Permit Center · OWASA utilities · CAPS required', badge: 'UNC district', badgeColor: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'apex', name: 'Apex', county: 'Wake County', desc: 'IDT Plans (submissions) + ePermits (payments) · Wake County inspections', badge: 'Fast growing', badgeColor: 'bg-green-50 text-green-700 border-green-100' },
  { id: 'hollysprings', name: 'Holly Springs', county: 'Wake County', desc: 'CityView Portal · Wake County inspections · One of fastest growing US towns', badge: 'High volume', badgeColor: 'bg-purple-50 text-purple-700 border-purple-100' },
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
    { ok: true, title: 'Wake County inspection district', desc: 'Inspections scheduled through Wake County — separate from city permit applications.' },
    { ok: !flags.historic, title: flags.historic ? 'Historic district — flagged by you' : 'No historic district reported', desc: flags.historic ? 'Certificate of Appropriateness from RHDC required before any building permit submission.' : 'You indicated no historic district. Verify at raleighnc.gov before submitting.', verifyUrl: 'https://raleighnc.gov/planning/services/historic-preservation', verifyLabel: 'Verify historic district' },
    { ok: !flags.septic, title: flags.septic ? 'Private well/septic — Wake County approval needed' : 'City water & sewer reported', desc: flags.septic ? 'Wake County Environmental Services must approve before city accepts your application.' : 'You indicated city utilities. Confirm availability with Raleigh Water at water.review@raleighnc.gov.' },
    { ok: !flags.corner, title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages. Verify with your surveyor.' : 'Standard setbacks apply. Confirm for your zoning district in Raleigh UDO.' },
  ]
}

export default function Wizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [state, setState] = useState({
    jurisdiction: '', addr: '', proj: '', cost: '',
    historic: false, septic: false, flood: false, corner: false,
  })
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  function update(key, val) { setState(s => ({ ...s, [key]: val })) }
  async function next() {
    // When moving from step 4 to step 5 and user has access, save project
    if (step === 4 && hasAccess() && state.proj && state.jurisdiction) {
      try {
        const user = await getUser()
        if (user) {
          await saveProject({
            name: `${state.proj === 'sfh' ? 'New Home' : state.proj} — ${state.addr || state.jurisdiction}`,
            jurisdiction: state.jurisdiction,
            addr: state.addr,
            proj: state.proj,
            cost: state.cost,
            historic: state.historic,
            septic: state.septic,
            flood: state.flood,
            corner: state.corner,
            permitCount: (data?.count || 0) + (state.historic ? 1 : 0) + (state.septic ? 1 : 0) + (state.flood ? 1 : 0),
            timeline: data?.timeline,
            fees: data?.fees,
            status: 'planning',
          })
        }
      } catch (err) {
        // Silent fail — don't block the wizard if save fails
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

  function getPermitData() {
    if (isDurham) return DURHAM_PERMIT_DATA[state.proj] || DURHAM_PERMIT_DATA.sfh
    if (isChapelHill) return CHAPEL_HILL_PERMIT_DATA[state.proj] || CHAPEL_HILL_PERMIT_DATA.sfh
    if (isApex) return APEX_PERMIT_DATA[state.proj] || APEX_PERMIT_DATA.sfh
    if (isHollySprings) return HOLLY_SPRINGS_PERMIT_DATA[state.proj] || HOLLY_SPRINGS_PERMIT_DATA.sfh
    return PERMIT_DATA[state.proj] || PERMIT_DATA.sfh
  }

  function getPros() {
    if (isDurham) return DURHAM_PROFESSIONALS[state.proj] || DURHAM_PROFESSIONALS.sfh
    if (isChapelHill) return CHAPEL_HILL_PROFESSIONALS[state.proj] || CHAPEL_HILL_PROFESSIONALS.sfh
    if (isApex) return APEX_PROFESSIONALS[state.proj] || APEX_PROFESSIONALS.sfh
    if (isHollySprings) return HOLLY_SPRINGS_PROFESSIONALS[state.proj] || HOLLY_SPRINGS_PROFESSIONALS.sfh
    return PROFESSIONALS[state.proj] || PROFESSIONALS.sfh
  }

  function getInsps() {
    if (isDurham) return DURHAM_INSPECTIONS[state.proj] || DURHAM_INSPECTIONS.sfh
    if (isChapelHill) return CHAPEL_HILL_INSPECTIONS[state.proj] || CHAPEL_HILL_INSPECTIONS.sfh
    if (isApex) return APEX_INSPECTIONS[state.proj] || APEX_INSPECTIONS.sfh
    if (isHollySprings) return HOLLY_SPRINGS_INSPECTIONS[state.proj] || HOLLY_SPRINGS_INSPECTIONS.sfh
    return INSPECTIONS[state.proj] || INSPECTIONS.sfh
  }

  function getBuildabilityChecks() {
    const flags = { historic: state.historic, septic: state.septic, flood: state.flood, corner: state.corner }
    if (isChapelHill) return CHAPEL_HILL_BUILDABILITY_CHECKS(flags)
    if (isApex) return APEX_BUILDABILITY_CHECKS(flags)
    if (isHollySprings) return HOLLY_SPRINGS_BUILDABILITY_CHECKS(flags)
    return getRaleighBuildabilityChecks(flags)
  }

  function getInspectionNote() {
    if (isDurham) return 'Schedule all inspections through the LDO portal at ldo4.durhamnc.gov'
    if (isChapelHill) return 'Schedule via Online Permit Center, call (919) 968-2718, or email permits@townofchapelhill.org. Cancel by 9:30 AM day-of to avoid $60 re-inspection fee.'
    if (isApex) return 'Schedule by 2:00 PM the day before via online form or call (919) 249-3388. Wake County performs all field inspections.'
    if (isHollySprings) return 'Request through CityView Portal or call 311. Before 4 PM = next day. After 4 PM = second business day. Wake County performs all field inspections.'
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
  const permitCount = (data?.count || 0) + (state.historic ? 1 : 0) + (state.septic ? 1 : 0) + (state.flood ? 1 : 0)
  const over40k = parseInt((state.cost || '0').replace(/[^0-9]/g, '')) >= 40000 || ['sfh', 'adu', 'townhouse'].includes(state.proj)
  const jLabels = JURISDICTION_LABELS[state.jurisdiction] || JURISDICTION_LABELS.raleigh
  const cityName = isChapelHill ? 'Chapel Hill' : isDurham ? 'Durham' : isApex ? 'Apex' : isHollySprings ? 'Holly Springs' : 'Raleigh'

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

      {/* ── Step 1 — Jurisdiction ── */}
      {step === 1 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 1 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Where are you building?</h2>
          <p className="text-sm text-gray-500 mb-6">Select your jurisdiction. Each city has different permit portals, requirements, and review timelines.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
            {JURISDICTIONS.map(j => (
              <button key={j.id} onClick={() => update('jurisdiction', j.id)}
                className={`text-left border rounded-xl p-4 transition-all ${state.jurisdiction === j.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium inline-block mb-2 ${j.badgeColor}`}>{j.badge}</span>
                <div className={`text-base font-semibold mb-1 ${state.jurisdiction === j.id ? 'text-brand-700' : 'text-gray-900'}`}>{j.name}</div>
                <div className={`text-xs mb-1 font-medium ${state.jurisdiction === j.id ? 'text-brand-600' : 'text-gray-500'}`}>{j.county}</div>
                <div className={`text-xs leading-relaxed ${state.jurisdiction === j.id ? 'text-brand-600' : 'text-gray-400'}`}>{j.desc}</div>
              </button>
            ))}
          </div>

          {isDurham && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-1">Durham uses two separate portals</div>
                <div className="text-xs text-amber-700 leading-relaxed">Building and fire permits via <strong>Dplans</strong>. Trade permits, fees, and inspections via <strong>LDO portal</strong>. Parcoria tells you which portal for each permit.</div>
              </div>
            </div>
          )}
          {isChapelHill && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">ℹ️</span>
              <div>
                <div className="text-sm font-semibold text-blue-800 mb-1">Chapel Hill has a unique school certificate requirement</div>
                <div className="text-xs text-blue-700 leading-relaxed">All new residential units require a <strong>Certificate of Adequate Public Schools (CAPS)</strong> from Chapel Hill-Carrboro City Schools before any Zoning Compliance Permit is issued.</div>
              </div>
            </div>
          )}
          {isApex && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">ℹ️</span>
              <div>
                <div className="text-sm font-semibold text-green-800 mb-1">Apex uses two portals — IDT Plans and ePermits</div>
                <div className="text-xs text-green-700 leading-relaxed">Submit all plans via <strong>IDT Plans</strong>. Pay fees via <strong>ePermits</strong>. Permit is not active until fees are paid.</div>
              </div>
            </div>
          )}
          {isHollySprings && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">ℹ️</span>
              <div>
                <div className="text-sm font-semibold text-purple-800 mb-1">Holly Springs — single CityView Portal for everything</div>
                <div className="text-xs text-purple-700 leading-relaxed">One <strong>CityView Portal</strong> for applications, payments, inspections, and status. Obtain your <strong>Progress Energy premise number</strong> early.</div>
              </div>
            </div>
          )}

          <button onClick={next} disabled={!state.jurisdiction}
            className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Continue — enter address
          </button>
        </div>
      )}

      {/* ── Step 2 — Address ── */}
      {step === 2 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 2 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Where is your property?</h2>
          <p className="text-sm text-gray-500 mb-6">We identify your zoning, jurisdiction overlays, and lot-level conditions before anything else.</p>

          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
            placeholder={`e.g. 123 Main St, ${cityName}, NC`}
            value={state.addr}
            onChange={e => update('addr', e.target.value)}
          />
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 mb-5">
            Enter your {cityName} address. We will run a live FEMA flood zone check on the next screen.
          </div>

          {[
            { key: 'historic', label: 'Historic district', sub: isDurham ? 'Durham HPC approval required — adds 4–8 weeks' : isChapelHill ? 'Chapel Hill Historic District Commission approval required' : 'Adds Certificate of Appropriateness — 4–8 weeks' },
            { key: 'septic', label: 'Private well or septic', sub: isDurham ? 'Durham County Environmental Health approval required first' : isChapelHill ? 'Orange County Environmental Health approval required' : 'Wake County approval required first' },
            { key: 'corner', label: 'Corner lot', sub: 'Dual street setbacks apply' },
          ].map(t => (
            <div key={t.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
              <div>
                <div className="text-sm text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
              </div>
              <button onClick={() => update(t.key, !state[t.key])}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${state[t.key] ? 'bg-brand-600' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${state[t.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}

          <div className="mt-2 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3 text-xs text-brand-700">
            🔍 Flood zone will be automatically checked on the next screen using live FEMA data.
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} disabled={state.addr.trim().length < 5}
              className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              Run buildability check
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3 — Buildability ── */}
      {step === 3 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 3 of 6</p>
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
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">Continue to project type</button>
          </div>
        </div>
      )}

      {/* ── Step 4 — Project type ── */}
      {step === 4 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 4 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What are you building?</h2>
          <p className="text-sm text-gray-500 mb-5">Your project type determines every permit and professional required.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {PROJECT_TYPES.map(pt => (
              <button key={pt.id} onClick={() => update('proj', pt.id)}
                className={`text-left border rounded-xl p-3 transition-all ${state.proj === pt.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${state.proj === pt.id ? 'text-brand-700' : 'text-gray-800'}`}>{pt.label}</div>
                <div className="text-xs text-gray-400">{pt.sub}</div>
              </button>
            ))}
          </div>

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-700 block mb-1">Estimated project cost</label>
            <p className="text-xs text-gray-400 mb-2">NC law requires a licensed GC and lien agent for projects $40,000+</p>
            <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. $280,000" value={state.cost} onChange={e => update('cost', e.target.value)} />
          </div>

          <div className="flex gap-2">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} disabled={!state.proj}
              className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              Generate permit roadmap
            </button>
          </div>
        </div>
      )}

      {/* ── Step 5 — Permits (GATED) ── */}
      {step === 5 && (
        <div>
          {!hasAccess() ? (
            <>
              <p className="text-xs text-gray-400 mb-1">Step 5 of 6</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your permit roadmap is ready</h2>
              <Paywall jurisdiction={state.jurisdiction} proj={state.proj} addr={state.addr} />
              <button onClick={back} className="w-full mt-3 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
                ← Back to project type
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-1">Step 5 of 6</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Permit roadmap — {PROJ_LABELS[state.proj] || 'your project'}</h2>
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
                {[{ n: permitCount, l: 'Permits required' }, { n: data.timeline, l: 'Est. timeline' }, { n: data.fees, l: 'Est. permit fees' }].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">{s.n}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {data.phases.map((ph, pi) => (
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
                  <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Floodplain — FEMA</span><div className="flex-1 h-px bg-red-100" /></div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-red-800 mb-1">FEMA elevation certificate required</div>
                    <div className="text-xs text-red-700 leading-relaxed">A licensed NC surveyor must complete an elevation certificate before any permits are issued.</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
                <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">See required professionals</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Step 6 — Professionals ── */}
      {step === 6 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 6 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Licensed professionals required</h2>
          <p className="text-sm text-gray-500 mb-5">Based on your project, location, and cost — exactly who NC law requires and why.</p>

          {over40k && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-amber-800">NC licensing law applies to your project</div>
                <div className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Projects $40,000+ require a licensed NC General Contractor. Owner-builders must file an <strong>Owner Exemption Affidavit</strong> — only valid for homes you intend to occupy, not for resale.
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
            <button onClick={back} className="py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={() => navigate('/action-plan', { state: { proj: state.proj, addr: state.addr, jurisdiction: state.jurisdiction } })}
              className="py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
              Get my action plan ↗
            </button>
          </div>
          {/* Save to dashboard button — only shown when authenticated */}
          <SaveToDashboard
            state={state}
            data={data}
            saveStatus={saveStatus}
            setSaveStatus={setSaveStatus}
          />

          <button onClick={shareRoadmap}
            className="w-full mt-2 py-2.5 border border-brand-200 text-brand-700 bg-brand-50 text-sm font-medium rounded-lg hover:bg-brand-100 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share this roadmap with my contractor
          </button>
          <button onClick={() => window.location.href = '/'}
            className="w-full mt-2 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
            Back to home
          </button>
        </div>
      )}
    </div>
  )
}
