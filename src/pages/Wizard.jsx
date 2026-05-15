import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROJECT_TYPES, PERMIT_DATA, PROFESSIONALS, INSPECTIONS } from '../data/raleigh'

const STEPS = ['Address', 'Buildability', 'Project', 'Permits', 'Professionals']

const JURISDICTION_STYLES = {
  city:   'bg-blue-50 text-blue-700 border border-blue-100',
  county: 'bg-amber-50 text-amber-700 border border-amber-100',
  state:  'bg-green-50 text-green-700 border border-green-100',
}

const JURISDICTION_LABELS = { city: 'City of Raleigh', county: 'Wake County', state: 'NC State' }

const PRO_STYLES = {
  required:    { badge: 'bg-red-50 text-red-700 border border-red-100', dot: 'bg-red-500' },
  recommended: { badge: 'bg-amber-50 text-amber-700 border border-amber-100', dot: 'bg-amber-500' },
  optional:    { badge: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
}

const PRO_LABELS = { required: 'Required by NC law', recommended: 'Strongly recommended', optional: 'Optional / situational' }

export default function Wizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [state, setState] = useState({
    addr: '', proj: '', cost: '',
    historic: false, septic: false, flood: false, corner: false,
  })

  function update(key, val) { setState(s => ({ ...s, [key]: val })) }
  function next() { setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }

  const data = PERMIT_DATA[state.proj] || PERMIT_DATA.sfh
  const pros = PROFESSIONALS[state.proj] || PROFESSIONALS.sfh
  const insps = INSPECTIONS[state.proj] || INSPECTIONS.sfh
  const permitCount = (data?.count || 0) + (state.historic ? 1 : 0) + (state.septic ? 1 : 0) + (state.flood ? 1 : 0)
  const over40k = parseInt((state.cost || '0').replace(/[^0-9]/g, '')) >= 40000 || ['sfh', 'adu', 'townhouse'].includes(state.proj)

  const PROJ_LABELS = { sfh: 'New single-family home', adu: 'Accessory dwelling unit', addition: 'Addition', deck: 'Deck or porch', reno: 'Major renovation', pool: 'Pool or spa', shed: 'Shed / garage', townhouse: 'Townhouse / duplex' }

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

      {/* Step 1 — Address */}
      {step === 1 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 1 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Where is your property?</h2>
          <p className="text-sm text-gray-500 mb-6">We identify your zoning, jurisdiction, and lot-level conditions before anything else.</p>
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3"
            placeholder="e.g. 123 Glenwood Ave, Raleigh, NC"
            value={state.addr}
            onChange={e => update('addr', e.target.value)}
          />
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 mb-5">
            Enter any Raleigh or Wake County address. We check zoning, flood zones, historic overlays, and utility access.
          </div>
          {[
            { key: 'historic', label: 'Historic district', sub: 'Adds Certificate of Appropriateness — 4–8 weeks' },
            { key: 'septic',   label: 'Private well or septic', sub: 'Wake County approval required first' },
            { key: 'flood',    label: 'Floodplain or wetland', sub: 'May require FEMA elevation certificate' },
            { key: 'corner',   label: 'Corner lot', sub: 'Dual street setbacks apply' },
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
          <div className="mt-6">
            <button
              onClick={next}
              disabled={state.addr.trim().length < 5}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Check buildability
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Buildability */}
      {step === 2 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 2 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Buildability check</h2>
          <p className="text-sm text-gray-500 mb-5">Before permits, we verify what your parcel can support.</p>
          {(() => {
            const flags = [state.historic, state.septic, state.flood, state.corner]
            const hasWarn = flags.some(Boolean)
            return (
              <div className={`flex gap-3 items-start rounded-xl p-4 mb-5 ${hasWarn ? 'bg-amber-50 border border-amber-100' : 'bg-green-50 border border-green-100'}`}>
                <span className="text-lg">{hasWarn ? '⚠️' : '✅'}</span>
                <div>
                  <div className={`text-sm font-semibold ${hasWarn ? 'text-amber-800' : 'text-green-800'}`}>
                    {hasWarn ? 'Buildable with conditions' : 'Looks buildable — no major blockers'}
                  </div>
                  <div className={`text-xs mt-1 ${hasWarn ? 'text-amber-700' : 'text-green-700'}`}>
                    {hasWarn ? 'Flagged items below must be resolved before permits are issued.' : 'No parcel-level blockers detected. Continue to project type.'}
                  </div>
                </div>
              </div>
            )
          })()}
          {[
            { ok: true,           title: 'City jurisdiction confirmed', desc: 'Raleigh city limits confirmed. All permits through City of Raleigh Planning & Development.' },
            { ok: true,           title: 'Wake County inspection district', desc: 'Inspections scheduled through Wake County — separate from city permit applications.' },
            { ok: !state.flood,   title: state.flood   ? 'Floodplain overlay detected'        : 'No floodplain overlay',        desc: state.flood   ? 'FEMA elevation certificate required before permits. Hire a licensed NC surveyor first.' : 'No FEMA flood zone constraints on this parcel.' },
            { ok: !state.historic,title: state.historic ? 'Historic district overlay active'   : 'No historic district overlay',  desc: state.historic ? 'Certificate of Appropriateness from RHDC required before any building permit submission.' : 'Parcel is not in a Raleigh historic district.' },
            { ok: !state.septic,  title: state.septic   ? 'Septic/well — Wake County approval needed' : 'City water & sewer available', desc: state.septic ? 'Wake County Environmental Services must approve before city accepts your application.' : 'City water and sewer available. Connection permit required.' },
            { ok: !state.corner,  title: state.corner   ? 'Corner lot — dual setbacks apply'  : 'Standard lot setbacks apply',   desc: state.corner  ? 'Corner lots have setback requirements on both street frontages. Verify with your surveyor.' : 'Standard front, rear, and side setbacks apply for your zone.' },
          ].map((c, i) => (
            <div key={i} className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-none">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${c.ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {c.ok ? '✓' : '!'}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{c.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.desc}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-6">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">Continue to project type</button>
          </div>
        </div>
      )}

      {/* Step 3 — Project type */}
      {step === 3 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 3 of 5</p>
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

      {/* Step 4 — Permits */}
      {step === 4 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 4 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Permit roadmap — {PROJ_LABELS[state.proj] || 'your project'}
          </h2>
          <p className="text-xs text-gray-400 mb-5">{state.addr || 'Raleigh, NC'}</p>
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
                <div key={i} className="flex gap-3 items-start bg-white border border-gray-100 rounded-lg p-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 mb-0.5">{pm.name}</div>
                    <div className="text-xs text-gray-500 leading-relaxed mb-2">{pm.desc}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${JURISDICTION_STYLES[pm.jurisdiction]}`}>
                        {JURISDICTION_LABELS[pm.jurisdiction]}
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
          {state.historic && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Historic district</span><div className="flex-1 h-px bg-amber-100" /></div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="text-sm font-medium text-amber-800 mb-1">Certificate of appropriateness</div>
                <div className="text-xs text-amber-700 leading-relaxed">RHDC approval required BEFORE building permit submission. Adds 4–8 weeks to your schedule.</div>
              </div>
            </div>
          )}
          {state.septic && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Well & septic</span><div className="flex-1 h-px bg-amber-100" /></div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="text-sm font-medium text-amber-800 mb-1">Wake County septic / well approval</div>
                <div className="text-xs text-amber-700 leading-relaxed">Wake County Environmental Services must approve before city accepts your permit application.</div>
              </div>
            </div>
          )}
          {state.flood && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Floodplain</span><div className="flex-1 h-px bg-blue-100" /></div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-800 mb-1">FEMA elevation certificate</div>
                <div className="text-xs text-blue-700 leading-relaxed">Licensed surveyor must complete this before any permits are issued on a floodplain parcel.</div>
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button onClick={back} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button onClick={next} className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">See required professionals</button>
          </div>
        </div>
      )}

      {/* Step 5 — Professionals */}
      {step === 5 && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Step 5 of 5</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Licensed professionals required</h2>
          <p className="text-sm text-gray-500 mb-5">Based on your project, location, and cost — exactly who NC law requires and why.</p>

          {over40k && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex gap-3">
              <span className="text-base flex-shrink-0">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-amber-800">NC licensing law applies to your project</div>
                <div className="text-xs text-amber-700 mt-1 leading-relaxed">Projects $40,000+ require a licensed NC General Contractor. Owner-builders must file an <strong>Owner Exemption Affidavit</strong> — only valid for homes you intend to occupy, not for resale.</div>
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
          <p className="text-xs text-gray-400 mb-3">Required inspections from site prep to certificate of occupancy</p>
          {insps.map((ins, i) => (
            <div key={i} className="flex gap-3 items-center py-2.5 border-b border-gray-100 last:border-none">
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</div>
              <span className="text-sm text-gray-700">{ins}</span>
            </div>
          ))}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button onClick={back} className="py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">← Back</button>
            <button
              onClick={() => navigate('/action-plan', { state: { proj: state.proj, addr: state.addr } })}
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
