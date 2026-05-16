import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROJECT_TYPES, PERMIT_DATA, PROFESSIONALS, INSPECTIONS } from '../data/raleigh'
import { DURHAM_PERMIT_DATA, DURHAM_PROFESSIONALS, DURHAM_INSPECTIONS } from '../data/durham'
import {
  CHAPEL_HILL_PERMIT_DATA, CHAPEL_HILL_PROFESSIONALS,
  CHAPEL_HILL_INSPECTIONS, CHAPEL_HILL_BUILDABILITY_CHECKS
} from '../data/chapelhill'
import Concierge from '../components/Concierge'
import BuildabilityChecker from '../components/BuildabilityChecker'

const STEPS = ['Jurisdiction', 'Address', 'Buildability', 'Project', 'Permits', 'Professionals']

const JURISDICTIONS = [
  {
    id: 'raleigh',
    name: 'Raleigh',
    county: 'Wake County',
    desc: 'City of Raleigh permit portal + Wake County inspections',
    badge: 'Most active',
    badgeColor: 'bg-brand-50 text-brand-700 border-brand-100',
  },
  {
    id: 'durham',
    name: 'Durham',
    county: 'Durham County',
    desc: 'Dplans (building) + LDO portal (trade permits & inspections)',
    badge: 'Dual portal',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    id: 'chapelhill',
    name: 'Chapel Hill',
    county: 'Orange County',
    desc: 'Online Permit Center (OpenGov) · OWASA utilities · CAPS required',
    badge: 'UNC district',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
  },
]

const JURISDICTION_STYLES = {
  city:   'bg-blue-50 text-blue-700 border border-blue-100',
  county: 'bg-amber-50 text-amber-700 border border-amber-100',
  state:  'bg-green-50 text-green-700 border border-green-100',
}

const JURISDICTION_LABELS = {
  raleigh:    { city: 'City of Raleigh',   county: 'Wake County',    state: 'NC State' },
  durham:     { city: 'City of Durham',    county: 'Durham County',  state: 'NC State' },
  chapelhill: { city: 'Town of Chapel Hill', county: 'Orange County', state: 'NC State' },
}

const PRO_STYLES = {
  required:    { badge: 'bg-red-50 text-red-700 border border-red-100', dot: 'bg-red-500' },
  recommended: { badge: 'bg-amber-50 text-amber-700 border border-amber-100', dot: 'bg-amber-500' },
  optional:    { badge: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
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
    { ok: !flags.historic, title: flags.historic ? 'Historic district overlay — flagged by you' : 'No historic district overlay reported', desc: flags.historic ? 'Certificate of Appropriateness from RHDC required before any building permit submission.' : 'You indicated no historic district. Verify at raleighnc.gov before submitting.', verifyUrl: 'https://raleighnc.gov/planning/services/historic-preservation', verifyLabel: 'Verify historic district' },
    { ok: !flags.septic, title: flags.septic ? 'Private well/septic — Wake County approval needed' : 'City water & sewer reported', desc: flags.septic ? 'Wake County Environmental Services must approve before city accepts your application.' : 'You indicated city utilities. Confirm availability with Raleigh Water at water.review@raleighnc.gov.' },
    { ok: !flags.corner, title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot configuration reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages. Verify with your surveyor.' : 'Standard setbacks apply. Confirm for your zoning district in Raleigh UDO.' },
  ]
}

export default function Wizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [state, setState] = useState({
    jurisdiction: '',
    addr: '', proj: '', cost: '',
    historic: false, septic: false, flood: false, corner: false,
  })

  function update(key, val) { setState(s => ({ ...s, [key]: val })) }
  function next() { setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }

  const isDurham = state.jurisdiction === 'durham'
  const isChapelHill = state.jurisdiction === 'chapelhill'

  function getPermitData() {
    if (isDurham) return DURHAM_PERMIT_DATA[state.proj] || DURHAM_PERMIT_DATA.sfh
    if (isChapelHill) return CHAPEL_HILL_PERMIT_DATA[state.proj] || CHAPEL_HILL_PERMIT_DATA.sfh
    return PERMIT_DATA[state.proj] || PERMIT_DATA.sfh
  }

  function getPros() {
    if (isDurham) return DURHAM_PROFESSIONALS[state.proj] || DURHAM_PROFESSIONALS.sfh
    if (isChapelHill) return CHAPEL_HILL_PROFESSIONALS[state.proj] || CHAPEL_HILL_PROFESSIONALS.sfh
    return PROFESSIONALS[state.proj] || PROFESSIONALS.sfh
  }

  function getInsps() {
    if (isDurham) return DURHAM_INSPECTIONS[state.proj] || DURHAM_INSPECTIONS.sfh
    if (isChapelHill) return CHAPEL_HILL_INSPECTIONS[state.proj] || CHAPEL_HILL_INSPECTIONS.sfh
    return INSPECTIONS[state.proj] || INSPECTIONS.sfh
  }

  function getBuildabilityChecks() {
    const flags = { historic: state.historic, septic: state.septic, flood: state.flood, corner: state.corner }
    if (isChapelHill) return CHAPEL_HILL_BUILDABILITY_CHECKS(flags)
    return getRaleighBuildabilityChecks(flags)
  }

  const data = getPermitData()
  const pros = getPros()
  const insps = getInsps()
  const permitCount = (data?.count || 0) + (state.historic ? 1 : 0) + (state.septic ? 1 : 0) + (state.flood ? 1 : 0)
  const over40k = parseInt((state.cost || '0').replace(/[^0-9]/g, '')) >= 40000 || ['sfh', 'adu', 'townhouse'].includes(state.proj)
  const jLabels = JURISDICTION_LABELS[state.jurisdiction] || JURISDICTION_LABELS.raleigh

  function getInspectionNote() {
    if (isDurham) return 'Schedule all inspections through the LDO portal at ldo4.durhamnc.gov'
    if (isChapelHill) return 'Schedule via Online Permit Center, call (919) 968-2718, or email permits@townofchapelhill.org. Cancel by 9:30 AM day-of to avoid $60 re-inspection fee.'
    return 'Schedule all inspections through Wake County'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Progress */}
      <div className="flex items-center mb-10">
        {STEPS.map((label, i) => {
          const num = i + 1
          const done = step > num
          const active = step === num
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                  ${done ? 'bg-green-500 text-white' : active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? '✓' : num}
                </div>
                <span className={`text-xs hidden sm:block ${active ? 'text-gray-900 font-medium' : done ? 'text-green-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-100 mx-2" />}
            </div>
          )
        })}
      </div>

      {/* Step 1 — Jurisdiction */}
      {step === 1 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 1 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Where are you building?</h2>
          <p className="text-sm text-gray-500 mb-6">Select your jurisdiction. Each city has different permit portals, requirements, and review timelines.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {JURISDICTIONS.map(j => (
              <button
                key={j.id}
                onClick={() => update('jurisdiction', j.id)}
                className={`text-left border rounded-xl p-4 transition-all ${
                  state.jurisdiction === j.id
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`text-base font-semibold ${state.jurisdiction === j.id ? 'text-brand-700' : 'text-gray-900'}`}>
                    {j.name}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${j.badgeColor}`}>
                    {j.badge}
                  </span>
                </div>
                <div className={`text-xs mb-1 font-medium ${state.jurisdiction === j.id ? 'text-brand-600' : 'text-gray-500'}`}>
                  {j.county}
                </div>
                <div className={`text-xs leading-relaxed ${state.jurisdiction === j.id ? 'text-brand-600' : 'text-gray-400'}`}>
                  {j.desc}
                </div>
              </button>
            ))}
          </div>

          {isDurham && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-1">Durham uses two separate portals</div>
                <div className="text-xs text-amber-700 leading-relaxed">
                  Building and fire permits submit via <strong>Dplans</strong>. Trade permits, fee payments, and inspection scheduling go through the <strong>LDO portal</strong>. You will need accounts on both. Parcoria tells you exactly which portal to use for each permit.
                </div>
              </div>
            </div>
          )}

          {isChapelHill && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">ℹ️</span>
              <div>
                <div className="text-sm font-semibold text-blue-800 mb-1">Chapel Hill has a unique school certificate requirement</div>
                <div className="text-xs text-blue-700 leading-relaxed">
                  All new residential units in Orange County require a <strong>Certificate of Adequate Public Schools (CAPS)</strong> from Chapel Hill-Carrboro City Schools before any Zoning Compliance Permit is issued. This is unique to Chapel Hill — we will surface this at every step.
                </div>
              </div>
            </div>
          )}

          <div className="mt-2">
            <button
              onClick={next}
              disabled={!state.jurisdiction}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue — enter address
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Address */}
      {step === 2 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 2 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Where is your property?</h2>
          <p className="text-sm text-gray-500 mb-6">
            We identify your zoning, jurisdiction overlays, and lot-level conditions before anything else.
          </p>
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
            placeholder={`e.g. 123 Main St, ${isChapelHill ? 'Chapel Hill' : isDurham ? 'Durham' : 'Raleigh'}, NC`}
            value={state.addr}
            onChange={e => update('addr', e.target.value)}
          />
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 mb-5">
            Enter your {isChapelHill ? 'Chapel Hill or Orange County' : isDurham ? 'Durham or Durham County' : 'Raleigh or Wake County'} address. We will run a live FEMA flood zone check on the next screen.
          </div>
          {[
            { key: 'historic', label: 'Historic district', sub: isChapelHill ? 'Chapel Hill Historic District Commission approval required' : isDurham ? 'Durham HPC approval required — adds 4–8 weeks' : 'Adds Certificate of Appropriateness — 4–8 weeks' },
            { key: 'septic', label: 'Private well or septic', sub: isChapelHill ? 'Orange County Environmental Health approval required' : isDurham ? 'Durham County Environmental Health approval required first' : 'Wake County approval required first' },
            { key: 'corner', label: 'Corner lot', sub: 'Dual street setbacks apply' },
          ].map(t => (
            <div key={t.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
              <div>
                <div className="text-sm text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
              </div>
              <button
                onClick={() => update(t.key, !state[t.key])}
                className={`relative w-9 h-5 rounded-full transition-colors ${state[t.key] ? 'bg-brand-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${state[t.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
          <div className="mt-2 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3 text-xs text-brand-700">
            🔍 Flood zone will be automatically checked on the next screen using live FEMA data.
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button
              onClick={next}
              disabled={state.addr.trim().length < 5}
              className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Run buildability check
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Buildability */}
      {step === 3 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 3 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Buildability check</h2>
          <p className="text-sm text-gray-500 mb-5">
            We run a live FEMA flood zone check on your address alongside your reported parcel conditions.
          </p>

          {isChapelHill && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex gap-2 text-xs text-amber-700">
              <span className="flex-shrink-0">⚠️</span>
              <span><strong>Chapel Hill CAPS requirement:</strong> Before any permit, obtain your Certificate of Adequate Public Schools from Chapel Hill-Carrboro City Schools. This is required for all new residential units in Orange County.</span>
            </div>
          )}

          {isDurham ? (
            <div>
              {(() => {
                const checks = [
                  { ok: true, title: 'Durham City-County jurisdiction confirmed', desc: 'Durham City and County share one unified building department. All permits processed through 101 City Hall Plaza.' },
                  { ok: true, title: 'Dual portal system — Dplans + LDO', desc: 'Building permits → Dplans. Trade permits, fees & inspections → LDO portal. Both accounts needed.' },
                  { ok: !state.historic, title: state.historic ? 'Historic district — flagged by you' : 'No historic district reported', desc: state.historic ? 'Durham HPC approval required before building permit. Verify at durhamnc.gov.' : 'You indicated no historic district. Verify at durhamnc.gov before submitting.', verifyUrl: 'https://www.durhamnc.gov/292/Planning', verifyLabel: 'Verify historic status' },
                  { ok: !state.septic, title: state.septic ? 'Private septic — Durham County EH approval needed' : 'City utilities reported', desc: state.septic ? 'Durham County Environmental Health (919) 560-7600 must approve before city accepts application.' : 'You indicated city utilities. Confirm with Durham One Call at (919) 560-1200.' },
                  { ok: !state.corner, title: state.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot reported', desc: state.corner ? 'Dual setback requirements on both street frontages per Durham UDO.' : 'Confirm setbacks for your zoning district in Durham UDO.' },
                ]
                const hasWarn = checks.some(c => !c.ok)
                return (
                  <div>
                    <div className={`flex gap-3 items-start rounded-xl p-4 mb-5 ${hasWarn ? 'bg-amber-50 border border-amber-100' : 'bg-green-50 border border-green-100'}`}>
                      <span className="text-lg">{hasWarn ? '⚠️' : '✅'}</span>
                      <div>
                        <div className={`text-sm font-semibold ${hasWarn ? 'text-amber-800' : 'text-green-800'}`}>{hasWarn ? 'Buildable with conditions' : 'No major parcel blockers detected'}</div>
                        <div className={`text-xs mt-1 ${hasWarn ? 'text-amber-700' : 'text-green-700'}`}>{hasWarn ? 'Review flagged items before submitting.' : 'Continue to select your project type.'}</div>
                      </div>
                    </div>
                    {checks.map((c, i) => (
                      <div key={i} className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-none">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${c.ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.ok ? '✓' : '!'}</div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-medium text-gray-800">{c.title}</div>
                            {!c.ok && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">Self-reported</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.desc}</div>
                          {c.verifyUrl && <a href={c.verifyUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 mt-1 inline-block">{c.verifyLabel} ↗</a>}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700 leading-relaxed">
                      <strong>Flood zone:</strong> Durham has significant floodplain areas along the Eno and Little Rivers. Verify at <a href="https://msc.fema.gov/portal/search" target="_blank" rel="noreferrer" className="underline">msc.fema.gov</a> before submitting.
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : (
            <BuildabilityChecker
              address={state.addr}
              jurisdiction={state.jurisdiction}
              flags={{ historic: state.historic, septic: state.septic, flood: state.flood, corner: state.corner }}
              onFloodDetected={(isHighRisk) => { if (isHighRisk) update('flood', true) }}
              customChecks={isChapelHill ? getBuildabilityChecks() : undefined}
            />
          )}

          <div className="flex gap-2 mt-6">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">Continue to project type</button>
          </div>
        </div>
      )}

      {/* Step 4 — Project type */}
      {step === 4 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 4 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What are you building?</h2>
          <p className="text-sm text-gray-500 mb-5">Your project type determines every permit and professional required.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {PROJECT_TYPES.map(pt => (
              <button
                key={pt.id}
                onClick={() => update('proj', pt.id)}
                className={`text-left border rounded-xl p-3 transition-all ${state.proj === pt.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className={`text-xs font-semibold mb-0.5 ${state.proj === pt.id ? 'text-brand-700' : 'text-gray-800'}`}>{pt.label}</div>
                <div className="text-xs text-gray-400">{pt.sub}</div>
              </button>
            ))}
          </div>
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-700 block mb-1">Estimated project cost</label>
            <p className="text-xs text-gray-400 mb-2">NC law requires a licensed GC and lien agent for projects $40,000+</p>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. $280,000"
              value={state.cost}
              onChange={e => update('cost', e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button
              onClick={next}
              disabled={!state.proj}
              className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Generate permit roadmap
            </button>
          </div>
        </div>
      )}

      {/* Step 5 — Permits */}
      {step === 5 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 5 of 6</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Permit roadmap — {PROJ_LABELS[state.proj] || 'your project'}
          </h2>
          <p className="text-xs text-gray-400 mb-5">{state.addr || `${isChapelHill ? 'Chapel Hill' : isDurham ? 'Durham' : 'Raleigh'}, NC`}</p>

          {isDurham && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex gap-2 text-xs text-amber-700">
              <span className="flex-shrink-0">ℹ️</span>
              <span><strong>Durham dual portal:</strong> Building permits → Dplans. Trade permits, fees & inspections → LDO portal. Each card below shows which portal to use.</span>
            </div>
          )}

          {isChapelHill && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex gap-2 text-xs text-amber-700">
              <span className="flex-shrink-0">⚠️</span>
              <span><strong>CAPS first:</strong> Obtain your Certificate of Adequate Public Schools from CHCCS before submitting any permits. All other permits depend on this.</span>
            </div>
          )}

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
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${JURISDICTION_STYLES[pm.jurisdiction]}`}>
                        {jLabels[pm.jurisdiction]}
                      </span>
                      {pm.portal && isDurham && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          {pm.portal}
                        </span>
                      )}
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

          {state.historic && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Historic district</span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="text-sm font-medium text-amber-800 mb-1">
                  {isChapelHill ? 'Chapel Hill Historic District Commission approval' : isDurham ? 'Durham HPC approval required' : 'Certificate of appropriateness'}
                </div>
                <div className="text-xs text-amber-700 leading-relaxed">
                  {isChapelHill ? 'Historic District Commission approval required before building permit submission. Adds 4–8 weeks.' : isDurham ? 'Durham Historic Preservation Commission must approve before building permit. Adds 4–8 weeks.' : 'RHDC approval required BEFORE building permit submission. Adds 4–8 weeks.'}
                </div>
              </div>
            </div>
          )}
          {state.septic && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Well & septic</span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="text-sm font-medium text-amber-800 mb-1">
                  {isChapelHill ? 'Orange County Environmental Health approval' : isDurham ? 'Durham County Environmental Health approval' : 'Wake County septic / well approval'}
                </div>
                <div className="text-xs text-amber-700 leading-relaxed">
                  {isChapelHill ? 'Orange County Division of Environmental Health (919) 245-2360 must approve before town accepts permit application. OWASA bill or OC EH approval required at submission.' : isDurham ? 'Durham County Environmental Health (919) 560-7600 must approve before city accepts permit application.' : 'Wake County Environmental Services must approve before city accepts your permit application.'}
                </div>
              </div>
            </div>
          )}
          {state.flood && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Floodplain — FEMA</span>
                <div className="flex-1 h-px bg-red-100" />
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <div className="text-sm font-medium text-red-800 mb-1">FEMA elevation certificate required</div>
                <div className="text-xs text-red-700 leading-relaxed">
                  Your parcel is in or near a FEMA flood zone. A licensed NC surveyor must complete an elevation certificate before any permits are issued.
                  {isChapelHill ? ' Chapel Hill has floodplain areas near Morgan Creek and New Hope Creek.' : isDurham ? ' Durham has significant floodplain areas along the Eno and Little Rivers.' : ' Raleigh has significant floodplain areas along the Neuse River.'}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">See required professionals</button>
          </div>
        </div>
      )}

      {/* Step 6 — Professionals */}
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
            <Concierge
              projectData={{
                addr: state.addr,
                proj: state.proj,
                cost: state.cost,
                historic: state.historic,
                septic: state.septic,
                flood: state.flood,
                corner: state.corner,
                jurisdiction: state.jurisdiction,
                permitCount,
                timeline: data.timeline,
                fees: data.fees,
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button onClick={back} className="py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button
              onClick={() => navigate('/action-plan', { state: { proj: state.proj, addr: state.addr, jurisdiction: state.jurisdiction } })}
              className="py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Get my action plan ↗
            </button>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full mt-2 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors"
          >
            Back to home
          </button>
        </div>
      )}
    </div>
  )
}
