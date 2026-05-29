// ApplicationPrefill.jsx
// Durham Building Permit Application Pre-fill
// Generates a completed application ready for review and submission to Dplans
// First jurisdiction: Durham (most complex, most requested by beta user)

import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProfile } from '../lib/contractor-profile'
import { getUser } from '../lib/supabase'

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

const COST_FIELDS = [
  { key: 'building',   label: 'Building work',        hint: 'Structural, framing, roofing, insulation, drywall' },
  { key: 'electrical', label: 'Electrical work',       hint: 'Wiring, panel, fixtures — leave $0 if separate permit' },
  { key: 'plumbing',   label: 'Plumbing work',         hint: 'Rough-in, fixtures — leave $0 if separate permit' },
  { key: 'mechanical', label: 'Mechanical / HVAC work', hint: 'Ducts, equipment — leave $0 if separate permit' },
  { key: 'fire',       label: 'Fire protection work',  hint: 'Sprinklers — leave $0 if not applicable' },
]

export default function ApplicationPrefill() {
  const [params] = useSearchParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [printed, setPrinted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Pre-fill state
  const [form, setForm] = useState({
    // Project info
    jobAddress: params.get('a') || '',
    lotUnit: '',
    subdivision: '',
    jobDescription: PROJ_DESCRIPTIONS[params.get('p')] || '',
    // Contractor (from profile)
    contractorName: '',
    contractorLicense: '',
    durhamCID: '',
    contractorEmail: '',
    contractorPhone: '',
    contractorAddress: '',
    contractorCity: '',
    contractorState: 'NC',
    contractorZip: '',
    // Architect
    architectName: '',
    architectEmail: '',
    architectPhone: '',
    architectAddress: '',
    architectCity: '',
    architectState: 'NC',
    architectZip: '',
    // Owner
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    // Costs
    building: '',
    electrical: '',
    plumbing: '',
    mechanical: '',
    fire: '',
    // Yes/No flags
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
    // Signature
    signerName: '',
    signDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const user = await getUser()
      if (user) {
        const p = await getProfile()
        if (p) {
          setProfile(p)
          // Pre-fill contractor fields from profile
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
          }))
        }
      }
    } catch {}
    finally {
      setLoading(false)
    }
  }

  function updateForm(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  const totalCost = COST_FIELDS.reduce((sum, f) => {
    return sum + (parseFloat(form[f.key]?.replace(/[^0-9.]/g, '') || 0) || 0)
  }, 0)

  function formatMoney(val) {
    if (!val) return ''
    const n = parseFloat(val.replace(/[^0-9.]/g, ''))
    if (isNaN(n)) return val
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  function handlePrint() {
    window.print()
    setPrinted(true)
  }

  const Field = ({ label, value, onChange, placeholder, half, hint, type = 'text' }) => (
    <div className={`${half ? 'col-span-1' : 'col-span-2'} print:col-span-1`}>
      <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 print:border-gray-400 print:rounded-none"
      />
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

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse text-gray-400 text-sm">Loading your profile...</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
        <Link to="/wizard" className="text-xs text-gray-400 hover:text-gray-600">&larr; Back to wizard</Link>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400 hidden sm:block">Review all fields, then print or save as PDF to submit via Dplans</div>
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
      <div className="bg-gray-900 text-white rounded-xl px-6 py-5 mb-6 print:bg-white print:text-gray-900 print:border-2 print:border-gray-900 print:rounded-none">
        <div className="text-xs font-medium text-gray-400 print:text-gray-500 mb-1">Doc.983 Rev.08.01.2025</div>
        <div className="text-lg font-semibold mb-0.5">Building Permit Application</div>
        <div className="text-sm text-gray-300 print:text-gray-600">City-County Building & Safety Department - 101 City Hall Plaza, Suite 400, Durham NC 27701</div>
        <div className="text-xs text-gray-400 print:text-gray-500 mt-1">Submit to: durhamnc.gov/467/Dplans - Phone: (919) 560-4144</div>
      </div>

      {/* Durham CID warning */}
      {!form.durhamCID && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-3 print:hidden">
          <span className="text-base flex-shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-amber-800">Durham Contractor ID (CID) required</div>
            <div className="text-xs text-amber-700 mt-0.5">Durham requires a CID for all contractors. If you don't have one, email <span className="font-medium">permittechnicians@durhamnc.gov</span> with your license info to request one. Enter it below once you have it.</div>
          </div>
        </div>
      )}

      {/* Profile pre-fill notice */}
      {profile && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5 text-xs text-green-700 print:hidden">
          ✓ Contractor fields pre-filled from your Parcoria profile. Review and update as needed before submitting.
        </div>
      )}

      <div className="space-y-6">

        {/* Project information */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Information</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Job address *</label>
                <input value={form.jobAddress} onChange={e => updateForm('jobAddress', e.target.value)}
                  placeholder="123 Main St, Durham, NC 27701"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <Field label="Lot / Unit" value={form.lotUnit} onChange={v => updateForm('lotUnit', v)} placeholder="e.g. Lot 14" half />
              <Field label="Subdivision" value={form.subdivision} onChange={v => updateForm('subdivision', v)} placeholder="e.g. Brightleaf" half />
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Job description * <span className="font-normal text-gray-400">(must align with checklist and plans)</span></label>
                <textarea value={form.jobDescription} onChange={e => updateForm('jobDescription', e.target.value)}
                  rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Contractor information */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contractor Information</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contractor / business name *" value={form.contractorName} onChange={v => updateForm('contractorName', v)} placeholder="Smith Construction LLC" />
              <Field label="NC Contractor license no. *" value={form.contractorLicense} onChange={v => updateForm('contractorLicense', v)} placeholder="78234" half />
              <div className="col-span-1">
                <label className="text-xs font-medium text-gray-500 block mb-1">Durham Contractor ID (CID) *</label>
                <input value={form.durhamCID} onChange={e => updateForm('durhamCID', e.target.value)}
                  placeholder="Request from Durham if needed"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${!form.durhamCID ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`} />
              </div>
              <Field label="Email" value={form.contractorEmail} onChange={v => updateForm('contractorEmail', v)} placeholder="john@smithconstruction.com" half type="email" />
              <Field label="Phone" value={form.contractorPhone} onChange={v => updateForm('contractorPhone', v)} placeholder="(919) 555-0100" half />
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Address</label>
                <div className="grid grid-cols-3 gap-2">
                  <input value={form.contractorAddress} onChange={e => updateForm('contractorAddress', e.target.value)} placeholder="Street address" className="col-span-3 sm:col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input value={form.contractorCity} onChange={e => updateForm('contractorCity', e.target.value)} placeholder="City" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input value={form.contractorZip} onChange={e => updateForm('contractorZip', e.target.value)} placeholder="ZIP" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architect */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Architect <span className="font-normal normal-case text-gray-400">(if applicable)</span></h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Architect name" value={form.architectName} onChange={v => updateForm('architectName', v)} placeholder="Jane Doe, AIA" half />
              <Field label="Email" value={form.architectEmail} onChange={v => updateForm('architectEmail', v)} placeholder="jane@doearchitecture.com" half type="email" />
              <Field label="Phone" value={form.architectPhone} onChange={v => updateForm('architectPhone', v)} placeholder="(919) 555-0200" half />
            </div>
          </div>
        </section>

        {/* Property owner */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Property Owner</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Property owner name *</label>
                <input value={form.ownerName} onChange={e => updateForm('ownerName', e.target.value)} placeholder="Full legal name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <Field label="Owner email" value={form.ownerEmail} onChange={v => updateForm('ownerEmail', v)} placeholder="owner@email.com" half type="email" />
              <Field label="Owner phone" value={form.ownerPhone} onChange={v => updateForm('ownerPhone', v)} placeholder="(919) 555-0300" half />
            </div>
          </div>
        </section>

        {/* Construction costs */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Construction Costs</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-4 leading-relaxed">
              Must reflect current market value for all labor and materials. Materials obtained for free must be accounted for. Durham requires no line left blank.
            </div>
            <div className="space-y-3">
              {COST_FIELDS.map(f => (
                <div key={f.key} className="flex items-center gap-4">
                  {f.key !== 'building' && (
                    <input type="checkbox" checked={form[`has${f.key.charAt(0).toUpperCase() + f.key.slice(1)}`] ?? true}
                      onChange={e => updateForm(`has${f.key.charAt(0).toUpperCase() + f.key.slice(1)}`, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-brand-600 flex-shrink-0" />
                  )}
                  {f.key === 'building' && <div className="w-4 h-4 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{f.label}</div>
                    <div className="text-xs text-gray-400">{f.hint}</div>
                  </div>
                  <input
                    value={form[f.key]}
                    onChange={e => updateForm(f.key, e.target.value)}
                    onBlur={e => updateForm(f.key, formatMoney(e.target.value))}
                    placeholder="$0.00"
                    className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <div className="text-sm font-semibold text-gray-900">Total project cost</div>
                <div className="text-sm font-semibold text-gray-900">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Yes/No questions */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Required Questions</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <YesNo label="Does this project exceed 12,000 sq ft of land disturbance?" checked={form.landDisturbance} onChange={v => updateForm('landDisturbance', v)} />
            <YesNo label="Does this project include public food service areas?" checked={form.publicFood} onChange={v => updateForm('publicFood', v)} />
            <YesNo label="Is this a single-family, duplex, or townhome that includes a sprinkler system?" checked={form.sprinkler} onChange={v => updateForm('sprinkler', v)} />
            <YesNo label="Will a sub-slab soil exhaust system be installed?" checked={form.subSlab} onChange={v => updateForm('subSlab', v)} />
            <YesNo label="Is this property serviced or planned to be serviced by a well or septic tank?" checked={form.wellSeptic} onChange={v => updateForm('wellSeptic', v)} />
            <YesNo label="Is an alteration to an existing natural or man-made drainage system proposed?" checked={form.drainage} onChange={v => updateForm('drainage', v)} />

            {form.wellSeptic && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mt-3 text-xs text-amber-700">
                Well/septic selected: Contact Durham Environmental Health at (919) 560-7800 for approval before proceeding.
              </div>
            )}
            {form.drainage && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mt-2 text-xs text-amber-700">
                Drainage alteration selected: A separate drainage permit application may be required. Contact (919) 560-4326.
              </div>
            )}
          </div>
        </section>

        {/* Signature */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Authorization</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-500 leading-relaxed mb-4">
              The owner or authorized agent signing this application is responsible for determining whether sewer, water, gas and other utilities are available. All easements and restrictions must be shown on the plot plan. The applicant must adhere to all codes and ordinances. Applications which are not completed to "Issued" status within 6 months will expire.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Print name *" value={form.signerName} onChange={v => updateForm('signerName', v)} placeholder="Full name" half />
              <Field label="Date" value={form.signDate} onChange={v => updateForm('signDate', v)} placeholder="MM/DD/YYYY" half />
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">Signature <span className="font-normal text-gray-400">(sign on printed copy)</span></label>
                <div className="border border-dashed border-gray-200 rounded-lg h-12 flex items-center justify-center text-xs text-gray-300 print:border-gray-400">
                  Sign here after printing
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submit instructions */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 print:hidden">
          <div className="text-sm font-semibold text-brand-900 mb-2">How to submit this application</div>
          <ol className="text-xs text-brand-700 leading-relaxed space-y-1">
            <li>1. Review every field above carefully — Durham requires no blanks or TBD entries</li>
            <li>2. Print this page or save as PDF using the button above</li>
            <li>3. Sign the printed copy</li>
            <li>4. Upload the signed application along with your construction drawings to <a href="https://www.durhamnc.gov/467/Dplans" target="_blank" rel="noreferrer" className="underline font-medium">durhamnc.gov/467/Dplans</a></li>
            <li>5. Also upload the completed <a href="https://www.durhamnc.gov/DocumentCenter/View/22135/Residential-Plan-Review-Checklist-PDF" target="_blank" rel="noreferrer" className="underline font-medium">Residential Plan Review Checklist</a></li>
            <li>6. Pay the plan review fee at the time of submission (deducted from permit fee at issuance)</li>
          </ol>
        </div>

      </div>

      <style>{`
        @media print {
          @page { margin: 0.6in; }
          .print\\:hidden { display: none !important; }
          body { font-size: 11px; }
          input, textarea { border: 1px solid #666 !important; padding: 2px 4px !important; }
        }
      `}</style>
    </div>
  )
}
