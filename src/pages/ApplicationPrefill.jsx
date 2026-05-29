// ApplicationPrefill.jsx
// Durham Permit Application Pre-fill
// Supports: Building (Doc.983), Electrical, Plumbing, Mechanical
// All trade permits submit via Durham LDO portal: ldo4.durhamnc.gov/DurhamWeb

import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProfile } from '../lib/contractor-profile'
import { getMyContractors, TRADE_TYPES } from '../lib/contractors'
import { getUser } from '../lib/supabase'
import { downloadPermitPDF } from '../lib/permit-pdf'

// ─── Shared data ──────────────────────────────────────────────────────────────

const PROJ_DESCRIPTIONS = {
  sfh:       'New single-family residential structure',
  adu:       'Accessory dwelling unit (ADU) - new detached residential structure',
  addition:  'Residential addition to existing single-family structure',
  reno:      'Interior renovation to existing single-family residential structure',
  deck:      'Attached deck/porch to existing single-family residential structure',
  pool:      'In-ground swimming pool and associated equipment',
  shed:      'Detached accessory structure',
  townhouse: 'New attached townhouse / duplex residential structure',
}

const PERMIT_TYPES = [
  { id: 'building',    label: 'Building Permit',       portal: 'Dplans',  icon: '🏗️', doc: 'Doc.983 Rev.08.01.2025' },
  { id: 'electrical',  label: 'Electrical Permit',     portal: 'LDO',     icon: '⚡', doc: 'Durham LDO Portal' },
  { id: 'plumbing',    label: 'Plumbing Permit',       portal: 'LDO',     icon: '🔧', doc: 'Durham LDO Portal' },
  { id: 'mechanical',  label: 'Mechanical/HVAC Permit', portal: 'LDO',    icon: '❄️', doc: 'Durham LDO Portal' },
]

// ─── Building permit cost fields ─────────────────────────────────────────────

const COST_FIELDS = [
  { key: 'building',   label: 'Building work',         hint: 'Structural, framing, roofing, insulation, drywall' },
  { key: 'electrical', label: 'Electrical work',       hint: 'Wiring, panel, fixtures — leave $0 if separate permit' },
  { key: 'plumbing',   label: 'Plumbing work',         hint: 'Rough-in, fixtures — leave $0 if separate permit' },
  { key: 'mechanical', label: 'Mechanical / HVAC work', hint: 'Ducts, equipment — leave $0 if separate permit' },
  { key: 'fire',       label: 'Fire protection work',  hint: 'Sprinklers — leave $0 if not applicable' },
]

// ─── Electrical scope options ──────────────────────────────────────────────

const ELECTRICAL_SCOPE_OPTIONS = [
  'New service installation (panel + meter base)',
  'Service upgrade (panel replacement)',
  'New branch circuits — general lighting/outlets',
  'HVAC / mechanical equipment connections',
  'EV charging station',
  'Pool / hot tub bonding and equipment',
  'Whole-house generator interlock',
  'Low-voltage / data / alarm systems',
  'Temporary power (construction)',
  'Other (describe in notes)',
]

const PLUMBING_SCOPE_OPTIONS = [
  'New water service connection',
  'Water supply rough-in (supply lines)',
  'DWV (drain-waste-vent) rough-in',
  'Fixtures (sinks, toilets, tubs, showers)',
  'Water heater installation',
  'Gas piping (natural gas or LP)',
  'Sewer tap / connection',
  'Irrigation / lawn sprinkler system',
  'Other (describe in notes)',
]

const MECHANICAL_SCOPE_OPTIONS = [
  'New HVAC system (air handler + condenser)',
  'Ductwork — new installation',
  'Ductwork — modification or repair',
  'Mini-split / ductless system',
  'Gas furnace or heat pump replacement',
  'Exhaust fans (bath, kitchen, laundry)',
  'Dryer vent installation',
  'Combustion air system',
  'Fireplace / gas appliance venting',
  'Other (describe in notes)',
]

// ─── Initial form state ────────────────────────────────────────────────────

function buildInitialForm(params) {
  return {
    // Shared
    jobAddress: params.get('a') || '',
    lotUnit: '',
    subdivision: '',
    jobDescription: PROJ_DESCRIPTIONS[params.get('p')] || '',
    contractorName: '',
    contractorLicense: '',
    durhamCID: '',
    contractorEmail: '',
    contractorPhone: '',
    contractorAddress: '',
    contractorCity: '',
    contractorState: 'NC',
    contractorZip: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    signerName: '',
    signDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    notes: '',
    // Building-only
    architectName: '',
    architectEmail: '',
    architectPhone: '',
    building: '',
    electrical: '',
    plumbing: '',
    mechanical: '',
    fire: '',
    hasElectrical: true,
    hasPlumbing: true,
    hasMechanical: true,
    hasFire: false,
    landDisturbance: false,
    publicFood: false,
    sprinkler: false,
    subSlab: false,
    wellSeptic: params.get('s') === '1',
    drainage: false,
    // Trade-only
    workScope: [],
    serviceAmps: '',
    wiringMethod: '',
    numCircuits: '',
    gasWork: false,
    gasType: '',
    newService: false,
    existingPanelAmps: '',
    estimatedCost: '',
  }
}

export default function ApplicationPrefill() {
  const [params] = useSearchParams()
  const [permitType, setPermitType] = useState(params.get('type') || 'building')
  const [profile, setProfile] = useState(null)
  const [myContractors, setMyContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  const [lastFilename, setLastFilename] = useState('')
  const [form, setForm] = useState(() => buildInitialForm(params))

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    try {
      const user = await getUser()
      if (user) {
        const [p, contractors] = await Promise.all([getProfile(), getMyContractors()])
        if (p) {
          setProfile(p)
          const parts = (p.address || '').split(',')
          setForm(f => ({
            ...f,
            contractorName: p.business_name || '',
            contractorLicense: p.license_number || '',
            contractorEmail: p.email || '',
            contractorPhone: p.phone || '',
            contractorAddress: parts[0]?.trim() || '',
            contractorCity: parts[1]?.trim() || '',
            contractorZip: parts[2]?.trim() || '',
            signerName: p.business_name || '',
            durhamCID: p.jurisdiction_ids?.durham || '',
          }))
        }
        setMyContractors(contractors || [])
      }
    } catch {}
    finally { setLoading(false) }
  }

  function fillFromContractor(contractorId) {
    if (!contractorId) return
    const c = myContractors.find(x => x.id === contractorId)
    if (!c) return
    const parts = (c.address || '').split(',')
    setForm(f => ({
      ...f,
      contractorName: c.company || c.name || '',
      contractorLicense: c.license_number || '',
      contractorEmail: c.email || '',
      contractorPhone: c.phone || '',
      contractorAddress: parts[0]?.trim() || '',
      contractorCity: parts[1]?.trim() || '',
      contractorZip: parts[2]?.trim() || '',
      signerName: f.signerName || c.company || c.name || '',
    }))
  }

  function fillFromArchitect(contractorId) {
    if (!contractorId) return
    const c = myContractors.find(x => x.id === contractorId)
    if (!c) return
    setForm(f => ({
      ...f,
      architectName: c.company || c.name || '',
      architectEmail: c.email || '',
      architectPhone: c.phone || '',
    }))
  }

  const savedArchitects = myContractors.filter(c => c.trade_type === 'architect')

  function update(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function toggleScope(item) {
    setForm(f => ({
      ...f,
      workScope: f.workScope.includes(item)
        ? f.workScope.filter(x => x !== item)
        : [...f.workScope, item],
    }))
  }

  function formatMoney(val) {
    if (!val) return ''
    const n = parseFloat(val.replace(/[^0-9.]/g, ''))
    if (isNaN(n)) return val
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const totalCost = COST_FIELDS.reduce((sum, f) => {
    return sum + (parseFloat(form[f.key]?.replace(/[^0-9.]/g, '') || 0) || 0)
  }, 0)

  // ─── Shared sub-components ──────────────────────────────────────────────

  const Field = ({ label, value, onChange, placeholder, half, hint, type = 'text', required }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="text-xs font-medium text-gray-500 block mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 print:border-gray-400" />
      {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
    </div>
  )

  const YesNo = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-none">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="radio" checked={checked === true} onChange={() => onChange(true)} className="w-4 h-4 text-brand-600" />
          <span className="text-sm text-gray-600">Yes</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="radio" checked={checked === false} onChange={() => onChange(false)} className="w-4 h-4 text-brand-600" />
          <span className="text-sm text-gray-600">No</span>
        </label>
      </div>
    </div>
  )

  // Shared contractor network dropdown + fields
  const ContractorSection = () => (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contractor Information</h2>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        {myContractors.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Quick-fill from my contractor network</label>
            <select defaultValue="" onChange={e => fillFromContractor(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50">
              <option value="" disabled>Select a contractor to auto-fill fields below...</option>
              {myContractors.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company ? `${c.company} (${c.name})` : c.name}
                  {c.trade_type ? ` — ${TRADE_TYPES[c.trade_type] || c.trade_type}` : ''}
                  {c.license_number ? ` · Lic. ${c.license_number}` : ''}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-400 mt-1">Fields below will be filled automatically. Edit anything as needed.</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contractor / business name" value={form.contractorName} onChange={v => update('contractorName', v)} placeholder="Smith Construction LLC" required />
          <Field label="NC license no." value={form.contractorLicense} onChange={v => update('contractorLicense', v)} placeholder="78234" half required />
          <div className="col-span-1">
            <label className="text-xs font-medium text-gray-500 block mb-1">Durham Contractor ID (CID)<span className="text-red-400 ml-0.5">*</span></label>
            <input value={form.durhamCID} onChange={e => update('durhamCID', e.target.value)} placeholder="Request from Durham if needed"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${!form.durhamCID ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`} />
          </div>
          <Field label="Email" value={form.contractorEmail} onChange={v => update('contractorEmail', v)} placeholder="john@smithconstruction.com" half type="email" />
          <Field label="Phone" value={form.contractorPhone} onChange={v => update('contractorPhone', v)} placeholder="(919) 555-0100" half />
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 block mb-1">Address</label>
            <div className="grid grid-cols-3 gap-2">
              <input value={form.contractorAddress} onChange={e => update('contractorAddress', e.target.value)} placeholder="Street address"
                className="col-span-3 sm:col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <input value={form.contractorCity} onChange={e => update('contractorCity', e.target.value)} placeholder="City"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <input value={form.contractorZip} onChange={e => update('contractorZip', e.target.value)} placeholder="ZIP"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const OwnerSection = () => (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Property Owner</h2>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 block mb-1">Property owner name<span className="text-red-400 ml-0.5">*</span></label>
            <input value={form.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="Full legal name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <Field label="Owner email" value={form.ownerEmail} onChange={v => update('ownerEmail', v)} placeholder="owner@email.com" half type="email" />
          <Field label="Owner phone" value={form.ownerPhone} onChange={v => update('ownerPhone', v)} placeholder="(919) 555-0300" half />
        </div>
      </div>
    </section>
  )

  const SignatureSection = ({ disclaimer }) => (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Authorization</h2>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs text-gray-500 leading-relaxed mb-4">{disclaimer}</div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Print name" value={form.signerName} onChange={v => update('signerName', v)} placeholder="Full name" half required />
          <Field label="Date" value={form.signDate} onChange={v => update('signDate', v)} placeholder="MM/DD/YYYY" half />
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 block mb-1">Signature <span className="font-normal text-gray-400">(sign on printed copy)</span></label>
            <div className="border border-dashed border-gray-200 rounded-lg h-12 flex items-center justify-center text-xs text-gray-300 print:border-gray-400">
              Sign here after printing
            </div>
          </div>
        </div>
        {form.notes !== undefined && (
          <div className="mt-4">
            <label className="text-xs font-medium text-gray-500 block mb-1">Additional notes <span className="text-gray-400">(optional)</span></label>
            <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Any special conditions or clarifications..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
        )}
      </div>
    </section>
  )

  // ─── Trade permit scope picker ────────────────────────────────────────────

  const ScopePicker = ({ options, label }) => (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{label}</h2>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs text-gray-400 mb-3">Check all items that apply to this project.</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map(item => (
            <label key={item} className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
              form.workScope.includes(item) ? 'border-brand-200 bg-brand-50' : 'border-gray-100 hover:border-gray-200'
            }`}>
              <input type="checkbox" checked={form.workScope.includes(item)} onChange={() => toggleScope(item)}
                className="w-4 h-4 mt-0.5 text-brand-600 rounded border-gray-300 flex-shrink-0" />
              <span className="text-xs text-gray-700 leading-snug">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  )

  // ─── Permit-specific forms ────────────────────────────────────────────────

  const BuildingForm = () => (
    <>
      {!form.durhamCID && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-3 print:hidden">
          <span className="text-base flex-shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-amber-800">Durham Contractor ID (CID) required</div>
            <div className="text-xs text-amber-700 mt-0.5">Durham requires a CID for all contractors. Email <span className="font-medium">permittechnicians@durhamnc.gov</span> with your license info to request one.</div>
          </div>
        </div>
      )}
      {profile && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5 text-xs text-green-700 print:hidden">
          ✓ Contractor fields pre-filled from your Parcoria profile. Review and update as needed.
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Information</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Job address<span className="text-red-400 ml-0.5">*</span></label>
                <input value={form.jobAddress} onChange={e => update('jobAddress', e.target.value)} placeholder="123 Main St, Durham, NC 27701"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <Field label="Lot / Unit" value={form.lotUnit} onChange={v => update('lotUnit', v)} placeholder="e.g. Lot 14" half />
              <Field label="Subdivision" value={form.subdivision} onChange={v => update('subdivision', v)} placeholder="e.g. Brightleaf" half />
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Job description<span className="text-red-400 ml-0.5">*</span> <span className="font-normal text-gray-400">(must align with checklist and plans)</span></label>
                <textarea value={form.jobDescription} onChange={e => update('jobDescription', e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
            </div>
          </div>
        </section>

        <ContractorSection />

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Architect <span className="font-normal normal-case text-gray-400">(if applicable)</span></h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            {savedArchitects.length > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Quick-fill from my contractor network</label>
                <select defaultValue="" onChange={e => fillFromArchitect(e.target.value)}
                  className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50">
                  <option value="" disabled>Select an architect to auto-fill fields below...</option>
                  {savedArchitects.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.company ? `${c.company} (${c.name})` : c.name}
                      {c.license_number ? ` · Lic. ${c.license_number}` : ''}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-400 mt-1">Fields below will be filled automatically. Edit anything as needed.</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Architect name" value={form.architectName} onChange={v => update('architectName', v)} placeholder="Jane Doe, AIA" half />
              <Field label="Email" value={form.architectEmail} onChange={v => update('architectEmail', v)} placeholder="jane@doearchitecture.com" half type="email" />
              <Field label="Phone" value={form.architectPhone} onChange={v => update('architectPhone', v)} placeholder="(919) 555-0200" half />
            </div>
          </div>
        </section>

        <OwnerSection />

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Construction Costs</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-4 leading-relaxed">
              Must reflect current market value for all labor and materials. Durham requires no line left blank.
            </div>
            <div className="space-y-3">
              {COST_FIELDS.map(f => (
                <div key={f.key} className="flex items-center gap-4">
                  {f.key !== 'building' && (
                    <input type="checkbox" checked={form[`has${f.key.charAt(0).toUpperCase() + f.key.slice(1)}`] ?? true}
                      onChange={e => update(`has${f.key.charAt(0).toUpperCase() + f.key.slice(1)}`, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-brand-600 flex-shrink-0" />
                  )}
                  {f.key === 'building' && <div className="w-4 h-4 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{f.label}</div>
                    <div className="text-xs text-gray-400">{f.hint}</div>
                  </div>
                  <input value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                    onBlur={e => update(f.key, formatMoney(e.target.value))}
                    placeholder="$0.00" className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm font-semibold text-gray-900">Total project cost</div>
                <div className="text-sm font-semibold text-gray-900">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Required Questions</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <YesNo label="Does this project exceed 12,000 sq ft of land disturbance?" checked={form.landDisturbance} onChange={v => update('landDisturbance', v)} />
            <YesNo label="Does this project include public food service areas?" checked={form.publicFood} onChange={v => update('publicFood', v)} />
            <YesNo label="Is this a single-family, duplex, or townhome that includes a sprinkler system?" checked={form.sprinkler} onChange={v => update('sprinkler', v)} />
            <YesNo label="Will a sub-slab soil exhaust system be installed?" checked={form.subSlab} onChange={v => update('subSlab', v)} />
            <YesNo label="Is this property serviced or planned to be serviced by a well or septic tank?" checked={form.wellSeptic} onChange={v => update('wellSeptic', v)} />
            <YesNo label="Is an alteration to an existing natural or man-made drainage system proposed?" checked={form.drainage} onChange={v => update('drainage', v)} />
            {form.wellSeptic && <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mt-3 text-xs text-amber-700">Well/septic selected: Contact Durham Environmental Health at (919) 560-7800 for approval before proceeding.</div>}
            {form.drainage && <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mt-2 text-xs text-amber-700">Drainage alteration: A separate drainage permit application may be required. Contact (919) 560-4326.</div>}
          </div>
        </section>

        <SignatureSection disclaimer="The owner or authorized agent signing this application is responsible for determining whether sewer, water, gas and other utilities are available. All easements and restrictions must be shown on the plot plan. The applicant must adhere to all codes and ordinances. Applications which are not completed to 'Issued' status within 6 months will expire." />

        <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 print:hidden">
          <div className="text-sm font-semibold text-brand-900 mb-2">How to submit this application</div>
          <ol className="text-xs text-brand-700 leading-relaxed space-y-1">
            <li>1. Review every field above — Durham requires no blanks or TBD entries</li>
            <li>2. Click <strong>"Generate & Download PDF"</strong> above — a filled application PDF will download instantly</li>
            <li>3. Sign the PDF (wet signature required by Durham)</li>
            <li>4. Upload to <a href="https://dplans.durhamnc.gov" target="_blank" rel="noreferrer" className="underline font-medium">Dplans (dplans.durhamnc.gov)</a> along with stamped construction drawings</li>
            <li>5. Also upload the completed <a href="https://www.durhamnc.gov/DocumentCenter/View/22135/Residential-Plan-Review-Checklist-PDF" target="_blank" rel="noreferrer" className="underline font-medium">Residential Plan Review Checklist</a></li>
            <li>6. Pay the plan review fee at submission (deducted from permit fee at issuance)</li>
          </ol>
        </div>
      </div>
    </>
  )

  const ElectricalForm = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Information</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Job address<span className="text-red-400 ml-0.5">*</span></label>
              <input value={form.jobAddress} onChange={e => update('jobAddress', e.target.value)} placeholder="123 Main St, Durham, NC 27701"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Description of work<span className="text-red-400 ml-0.5">*</span></label>
              <textarea value={form.jobDescription} onChange={e => update('jobDescription', e.target.value)} rows={2}
                placeholder="e.g. New electrical service installation for new single-family home construction"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>
        </div>
      </section>

      <ScopePicker options={ELECTRICAL_SCOPE_OPTIONS} label="Scope of Electrical Work" />

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Electrical Details</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Service size (amps)</label>
              <select value={form.serviceAmps} onChange={e => update('serviceAmps', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select...</option>
                {['100A', '150A', '200A', '320A', '400A', 'Not applicable'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Number of circuits</label>
              <input value={form.numCircuits} onChange={e => update('numCircuits', e.target.value)} placeholder="e.g. 32"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Wiring method</label>
              <select value={form.wiringMethod} onChange={e => update('wiringMethod', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select...</option>
                {['NM-B (Romex)', 'EMT conduit', 'MC cable', 'PVC conduit', 'Mixed', 'Not yet determined'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Estimated cost of electrical work</label>
              <input value={form.estimatedCost} onChange={e => update('estimatedCost', e.target.value)}
                onBlur={e => update('estimatedCost', formatMoney(e.target.value))} placeholder="$0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
            <strong>NCBEEC license required:</strong> All electrical work in Durham requires a NC-licensed electrical contractor. Verify at <a href="https://www.ncbeec.org/license-lookup" target="_blank" rel="noreferrer" className="underline">ncbeec.org/license-lookup</a> before signing any contract.
          </div>
        </div>
      </section>

      <ContractorSection />
      <OwnerSection />
      <SignatureSection disclaimer="By submitting this application, the applicant certifies that all electrical work will be performed by or under the supervision of a NC-licensed electrical contractor, and that all work will conform to the 2023 NEC as adopted by NC and all applicable Durham codes." />

      <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 print:hidden">
        <div className="text-sm font-semibold text-brand-900 mb-2">How to submit — Electrical Permit</div>
        <ol className="text-xs text-brand-700 leading-relaxed space-y-1">
          <li>1. Review all fields above</li>
          <li>2. Sign the downloaded PDF (wet signature required by Durham)</li>
          <li>3. Submit via <a href="https://ldo4.durhamnc.gov/DurhamWeb" target="_blank" rel="noreferrer" className="underline font-medium">Durham LDO Portal (ldo4.durhamnc.gov/DurhamWeb)</a></li>
          <li>4. LDO portal requires a contractor account — your CID is your login identifier</li>
          <li>5. Electrical permits are typically issued same-day or next day for residential work</li>
        </ol>
      </div>
    </div>
  )

  const PlumbingForm = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Information</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Job address<span className="text-red-400 ml-0.5">*</span></label>
              <input value={form.jobAddress} onChange={e => update('jobAddress', e.target.value)} placeholder="123 Main St, Durham, NC 27701"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Description of work<span className="text-red-400 ml-0.5">*</span></label>
              <textarea value={form.jobDescription} onChange={e => update('jobDescription', e.target.value)} rows={2}
                placeholder="e.g. Plumbing rough-in and fixtures for new single-family home — 3 bathrooms, kitchen, laundry"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>
        </div>
      </section>

      <ScopePicker options={PLUMBING_SCOPE_OPTIONS} label="Scope of Plumbing Work" />

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Plumbing Details</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Number of fixtures</label>
              <input value={form.numCircuits} onChange={e => update('numCircuits', e.target.value)} placeholder="e.g. 12 fixtures total"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Estimated cost of plumbing work</label>
              <input value={form.estimatedCost} onChange={e => update('estimatedCost', e.target.value)}
                onBlur={e => update('estimatedCost', formatMoney(e.target.value))} placeholder="$0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <YesNo label="Does scope include gas piping (natural gas or LP)?" checked={form.gasWork} onChange={v => update('gasWork', v)} />
          {form.gasWork && (
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Gas type</label>
              <select value={form.gasType} onChange={e => update('gasType', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select...</option>
                <option value="Natural gas">Natural gas</option>
                <option value="LP / propane">LP / propane</option>
              </select>
            </div>
          )}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
            <strong>NC Plumbing/HVAC Board license required.</strong> Verify contractor license at <a href="https://www.nclicensing.org/license-lookup" target="_blank" rel="noreferrer" className="underline">nclicensing.org/license-lookup</a> before signing any contract. Gas piping requires a separate gas license classification.
          </div>
        </div>
      </section>

      <ContractorSection />
      <OwnerSection />
      <SignatureSection disclaimer="By submitting this application, the applicant certifies that all plumbing work will be performed by or under the supervision of a NC-licensed plumbing contractor, and that all work will conform to the 2018 NC Plumbing Code and applicable Durham amendments." />

      <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 print:hidden">
        <div className="text-sm font-semibold text-brand-900 mb-2">How to submit — Plumbing Permit</div>
        <ol className="text-xs text-brand-700 leading-relaxed space-y-1">
          <li>1. Review all fields above</li>
          <li>2. Sign the downloaded PDF (wet signature required by Durham)</li>
          <li>3. Submit via <a href="https://ldo4.durhamnc.gov/DurhamWeb" target="_blank" rel="noreferrer" className="underline font-medium">Durham LDO Portal</a> — separate submission from the building permit</li>
          <li>4. If scope includes gas piping, Durham may require a separate gas permit in addition to plumbing</li>
          <li>5. Rough-in inspection required before walls are closed — schedule via LDO portal</li>
        </ol>
      </div>
    </div>
  )

  const MechanicalForm = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Information</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Job address<span className="text-red-400 ml-0.5">*</span></label>
              <input value={form.jobAddress} onChange={e => update('jobAddress', e.target.value)} placeholder="123 Main St, Durham, NC 27701"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Description of work<span className="text-red-400 ml-0.5">*</span></label>
              <textarea value={form.jobDescription} onChange={e => update('jobDescription', e.target.value)} rows={2}
                placeholder="e.g. Install 3-ton heat pump system with air handler and ductwork for new single-family home"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>
        </div>
      </section>

      <ScopePicker options={MECHANICAL_SCOPE_OPTIONS} label="Scope of Mechanical Work" />

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mechanical Details</h2>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">System type</label>
              <select value={form.wiringMethod} onChange={e => update('wiringMethod', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select...</option>
                {['Heat pump (air-to-air)', 'Gas furnace + AC', 'Mini-split / ductless', 'Geothermal heat pump', 'Boiler', 'Not yet determined'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Estimated cost of mechanical work</label>
              <input value={form.estimatedCost} onChange={e => update('estimatedCost', e.target.value)}
                onBlur={e => update('estimatedCost', formatMoney(e.target.value))} placeholder="$0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
            <strong>NC Plumbing/HVAC Board license required.</strong> Verify contractor license at <a href="https://www.nclicensing.org/license-lookup" target="_blank" rel="noreferrer" className="underline">nclicensing.org/license-lookup</a>. Gas appliance connections require both a mechanical and plumbing/gas license.
          </div>
        </div>
      </section>

      <ContractorSection />
      <OwnerSection />
      <SignatureSection disclaimer="By submitting this application, the applicant certifies that all mechanical work will be performed by or under the supervision of a NC-licensed HVAC/mechanical contractor, and that all work will conform to the 2018 NC Mechanical Code and applicable Durham amendments." />

      <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 print:hidden">
        <div className="text-sm font-semibold text-brand-900 mb-2">How to submit — Mechanical Permit</div>
        <ol className="text-xs text-brand-700 leading-relaxed space-y-1">
          <li>1. Review all fields above</li>
          <li>2. Sign the downloaded PDF (wet signature required by Durham)</li>
          <li>3. Submit via <a href="https://ldo4.durhamnc.gov/DurhamWeb" target="_blank" rel="noreferrer" className="underline font-medium">Durham LDO Portal</a></li>
          <li>4. Rough-in inspection required before ductwork or equipment is covered</li>
          <li>5. Manual J load calculation may be requested by Durham for new construction — have it ready</li>
        </ol>
      </div>
    </div>
  )

  // ─── Page header metadata per type ───────────────────────────────────────

  // ─── PDF generation ───────────────────────────────────────────────────────

  async function handleGeneratePDF() {
    setPdfGenerating(true)
    try {
      // Small delay so the button state renders before jsPDF blocks the thread
      await new Promise(r => setTimeout(r, 80))
      const filename = downloadPermitPDF(permitType, form, totalCost)
      setLastFilename(filename)
      setShowChecklist(true)
    } catch (err) {
      console.error('PDF generation error:', err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setPdfGenerating(false)
    }
  }

  // ─── Submission checklist modal ───────────────────────────────────────────

  const PORTAL_URLS = {
    building:   'https://dplans.durhamnc.gov',
    electrical: 'https://ldo4.durhamnc.gov/DurhamWeb',
    plumbing:   'https://ldo4.durhamnc.gov/DurhamWeb',
    mechanical: 'https://ldo4.durhamnc.gov/DurhamWeb',
  }

  const SUBMISSION_STEPS = {
    building: [
      { done: true,  text: `PDF generated — "${lastFilename}"` },
      { done: false, text: 'Sign the PDF (wet signature required by Durham)' },
      { done: false, text: 'Log in to Dplans at dplans.durhamnc.gov' },
      { done: false, text: 'Click "New Project" → select "Residential Building Permit"' },
      { done: false, text: 'Upload your signed permit application (this PDF)' },
      { done: false, text: 'Upload stamped architectural + structural drawings' },
      { done: false, text: 'Upload completed Residential Plan Review Checklist' },
      { done: false, text: 'Pay plan review fee at submission' },
      { done: false, text: 'Note your application number — Durham will email status updates' },
    ],
    electrical: [
      { done: true,  text: `PDF generated — "${lastFilename}"` },
      { done: false, text: 'Sign the PDF' },
      { done: false, text: 'Log in to LDO portal at ldo4.durhamnc.gov/DurhamWeb (use your CID)' },
      { done: false, text: 'Click "Apply for Permit" → "Electrical"' },
      { done: false, text: 'Upload your signed application' },
      { done: false, text: 'Pay permit fee — residential electrical typically $80–$300' },
      { done: false, text: 'Note permit number — schedule rough-in inspection when ready' },
    ],
    plumbing: [
      { done: true,  text: `PDF generated — "${lastFilename}"` },
      { done: false, text: 'Sign the PDF' },
      { done: false, text: 'Log in to LDO portal at ldo4.durhamnc.gov/DurhamWeb (use your CID)' },
      { done: false, text: 'Click "Apply for Permit" → "Plumbing"' },
      { done: false, text: form.gasWork ? 'If gas piping is in scope, apply for a separate Gas permit' : 'Upload your signed application' },
      { done: false, text: 'Pay permit fee' },
      { done: false, text: 'Note permit number — schedule rough-in inspection before closing walls' },
    ],
    mechanical: [
      { done: true,  text: `PDF generated — "${lastFilename}"` },
      { done: false, text: 'Sign the PDF' },
      { done: false, text: 'Log in to LDO portal at ldo4.durhamnc.gov/DurhamWeb (use your CID)' },
      { done: false, text: 'Click "Apply for Permit" → "Mechanical"' },
      { done: false, text: 'Upload your signed application' },
      { done: false, text: 'Have Manual J load calculation ready — Durham may request it' },
      { done: false, text: 'Pay permit fee' },
      { done: false, text: 'Note permit number — schedule rough-in inspection before covering ductwork' },
    ],
  }

  function SubmissionChecklist() {
    if (!showChecklist) return null
    const steps = SUBMISSION_STEPS[permitType] || SUBMISSION_STEPS.building
    const portalUrl = PORTAL_URLS[permitType]
    const portalName = permitType === 'building' ? 'Open Dplans portal' : 'Open LDO portal'

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowChecklist(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-green-600 rounded-t-2xl px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">✅</div>
              <div>
                <div className="text-white font-semibold text-base">PDF ready to submit</div>
                <div className="text-green-100 text-xs mt-0.5">{lastFilename}</div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="px-6 py-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Next steps — {current?.label}
            </div>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    step.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <div className={`text-sm leading-snug ${step.done ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                    {step.text}
                  </div>
                </div>
              ))}
            </div>

            {/* CID warning if missing */}
            {!form.durhamCID && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                <strong>⚠️ CID missing.</strong> Email <span className="font-medium">permittechnicians@durhamnc.gov</span> with your license number to get your Durham Contractor ID before logging into the portal.
              </div>
            )}

            {/* Coming soon pill */}
            <div className="mt-4 flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 animate-pulse"></div>
              <div className="text-xs text-brand-700">
                <span className="font-semibold">Submission Agent coming soon</span> — Parcoria will submit directly to {permitType === 'building' ? 'Dplans' : 'LDO'} for you.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => setShowChecklist(false)}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-300 transition-colors">
              Back to form
            </button>
            <a href={portalUrl} target="_blank" rel="noreferrer"
              className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors text-center">
              {portalName} ↗
            </a>
          </div>
        </div>
      </div>
    )
  }

  const current = PERMIT_TYPES.find(t => t.id === permitType)

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse text-gray-400 text-sm">Loading your profile...</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <SubmissionChecklist />

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
        <Link to="/wizard" className="text-xs text-gray-400 hover:text-gray-600">&larr; Back to wizard</Link>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400 hidden sm:block">Fill all fields, then generate your submit-ready PDF</div>
          <button onClick={handleGeneratePDF} disabled={pdfGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
            {pdfGenerating ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Generate & Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Permit type switcher */}
      <div className="mb-6 print:hidden">
        <div className="text-xs font-medium text-gray-500 mb-2">Durham permit type</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PERMIT_TYPES.map(t => (
            <button key={t.id} onClick={() => setPermitType(t.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-medium transition-all ${
                permitType === t.id
                  ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-gray-100 text-gray-500 hover:border-gray-200 bg-white'
              }`}>
              <span className="text-lg">{t.icon}</span>
              <span>{t.label}</span>
              <span className={`text-xs font-normal ${permitType === t.id ? 'text-brand-500' : 'text-gray-400'}`}>{t.portal}</span>
            </button>
          ))}
        </div>
        {permitType !== 'building' && (
          <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            Trade permits submit via the <strong>LDO portal</strong>, not Dplans. You need a separate LDO contractor account with your Durham CID.
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-gray-900 text-white rounded-xl px-6 py-5 mb-6 print:bg-white print:text-gray-900 print:border-2 print:border-gray-900 print:rounded-none">
        <div className="text-xs font-medium text-gray-400 print:text-gray-500 mb-1">{current.doc}</div>
        <div className="text-lg font-semibold mb-0.5">{current.icon} {current.label} Application</div>
        <div className="text-sm text-gray-300 print:text-gray-600">City-County Building & Safety Department - 101 City Hall Plaza, Suite 400, Durham NC 27701</div>
        <div className="text-xs text-gray-400 print:text-gray-500 mt-1">
          {permitType === 'building'
            ? 'Submit to: durhamnc.gov/467/Dplans - Phone: (919) 560-4144'
            : 'Submit to: LDO Portal — ldo4.durhamnc.gov/DurhamWeb - Phone: (919) 560-4144'}
        </div>
      </div>

      {/* Permit form */}
      {permitType === 'building'    && <BuildingForm />}
      {permitType === 'electrical'  && <ElectricalForm />}
      {permitType === 'plumbing'    && <PlumbingForm />}
      {permitType === 'mechanical'  && <MechanicalForm />}

      <style>{`
        @media print {
          @page { margin: 0.6in; }
          .print\\:hidden { display: none !important; }
          body { font-size: 11px; }
          input, textarea, select { border: 1px solid #666 !important; padding: 2px 4px !important; }
        }
      `}</style>
    </div>
  )
}
