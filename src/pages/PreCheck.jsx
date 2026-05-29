import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { hasAccess, isDeveloper } from '../lib/access'

// ─── Helpers ────────────────────────────────────────────────────────────────

function cleanMarkdown(text) {
  if (!text) return text
  return text.split('\n').map(line => {
    if (/^[•·▪▸]\s+/.test(line)) return line.replace(/^[•·▪▸]\s+/, '- ')
    if (/[•·]/.test(line) && !line.startsWith('#') && !line.startsWith('-')) {
      const parts = line.split(/\s*[•·]\s+/)
      if (parts.length > 1) return (parts[0].trim() ? parts[0].trim() + '\n' : '') + parts.slice(1).map(p => p.trim() ? '- ' + p.trim() : '').join('\n')
    }
    return line
  }).join('\n')
}

// ─── Stage 1: Text questionnaire ────────────────────────────────────────────

const STAGE1_SYSTEM = `You are Parcoria's AI Plan Pre-Check Engine — an expert at reviewing residential construction plans for compliance with the 2024 NC Residential Building Code and City of Raleigh requirements.

Your job is to analyze the project details provided and return a structured pre-submission compliance report.

Your report must always include these four sections:

## Likely to Pass ✓
List items that appear compliant based on the information provided.

## Potential Issues ⚠️
List specific items that may trigger correction notices from Raleigh plan reviewers. Be specific — reference the actual NC Building Code concern or Raleigh UDO requirement.

## Missing Information 📋
List documents or details the user must have ready before submission that are not yet confirmed.

## Priority Actions Before Submission 🎯
A numbered list of the most important things to resolve or verify before submitting, in priority order.

Tone: Direct and specific. Reference actual Raleigh/Wake County requirements. Flag real issues that cause real correction cycles. Be honest about complexity.

End with an overall readiness score out of 10.

Disclaimer to include at end:
*This is an AI-assisted preliminary review based on the information provided. It is not a substitute for official plan review by the City of Raleigh. Always verify requirements directly with the Planning & Development department.*`

const QUESTIONS = [
  { id: 'project_type', label: 'Project type', type: 'select', options: ['New single-family home', 'Accessory dwelling unit (ADU)', 'Addition or expansion', 'Major renovation', 'Deck or porch', 'Pool or spa', 'Townhouse or duplex'] },
  { id: 'address', label: 'Property address', type: 'text', placeholder: 'e.g. 123 Glenwood Ave, Raleigh, NC' },
  { id: 'sqft', label: 'Proposed square footage (heated)', type: 'text', placeholder: 'e.g. 2,400 sq ft' },
  { id: 'stories', label: 'Number of stories', type: 'select', options: ['1 story', '1.5 stories', '2 stories', '3 stories'] },
  { id: 'foundation', label: 'Foundation type', type: 'select', options: ['Slab on grade', 'Crawl space', 'Basement', 'Piers / posts', 'Not yet determined'] },
  { id: 'roof_pitch', label: 'Roof pitch', type: 'select', options: ['Flat (under 2:12)', 'Low slope (2:12 - 4:12)', 'Standard (4:12 - 8:12)', 'Steep (over 8:12)', 'Not yet determined'] },
  { id: 'large_spans', label: 'Any structural spans over 20 feet?', type: 'select', options: ['Yes', 'No', 'Not sure'] },
  { id: 'architect', label: 'Do you have stamped architectural drawings?', type: 'select', options: ['Yes - stamped by NC-licensed architect', 'Yes - but not yet stamped', 'In progress', 'No'] },
  { id: 'structural_engineer', label: 'Do you have stamped structural engineering drawings?', type: 'select', options: ['Yes - stamped by NC-licensed engineer', 'In progress', 'No', 'Not sure if required'] },
  { id: 'survey', label: 'Do you have a sealed lot survey / plot plan?', type: 'select', options: ['Yes - sealed by NC-licensed surveyor', 'In progress', 'No'] },
  { id: 'setbacks', label: 'Have setbacks been verified against Raleigh UDO?', type: 'select', options: ['Yes - confirmed compliant', 'Not yet verified', 'Borderline - may need variance'] },
  { id: 'lot_coverage', label: 'Estimated lot coverage percentage', type: 'select', options: ['Under 30%', '30% - 40%', '40% - 50%', 'Over 50%', 'Not calculated yet'] },
  { id: 'utilities', label: 'Utility connections', type: 'select', options: ['City water & sewer', 'Well & septic', 'City water + septic', 'Not yet determined'] },
  { id: 'energy_compliance', label: 'Energy code compliance method', type: 'select', options: ['REScheck software report', 'Prescriptive path', 'Performance path', 'Not yet determined'] },
  { id: 'historic', label: 'Is the property in a Raleigh historic district?', type: 'select', options: ['Yes', 'No', 'Not sure'] },
  { id: 'flood', label: 'Is the property in a FEMA flood zone?', type: 'select', options: ['Yes - elevation certificate obtained', 'Yes - no certificate yet', 'No', 'Not sure'] },
  { id: 'contractor', label: 'Do you have a licensed NC General Contractor?', type: 'select', options: ['Yes - license verified at nclbgc.org', 'Yes - not yet verified', 'No - still selecting', 'Owner-building with exemption affidavit'] },
  { id: 'lien_agent', label: 'Has a lien agent been appointed?', type: 'select', options: ['Yes - filed at liensnc.com', 'Not yet', 'Project under $40,000 - not required'] },
  { id: 'additional', label: 'Anything else the reviewer should know?', type: 'textarea', placeholder: 'e.g. corner lot, unusual site conditions, previous permit history, HOA requirements...', optional: true },
]

const STEPS = [
  { label: 'Project basics', ids: ['project_type', 'address', 'sqft', 'stories'] },
  { label: 'Structure & design', ids: ['foundation', 'roof_pitch', 'large_spans', 'architect', 'structural_engineer'] },
  { label: 'Site & zoning', ids: ['survey', 'setbacks', 'lot_coverage', 'utilities'] },
  { label: 'Compliance & team', ids: ['energy_compliance', 'historic', 'flood', 'contractor', 'lien_agent', 'additional'] },
]

// ─── Stage 2: PDF review ─────────────────────────────────────────────────────

const STAGE2_SYSTEM = `You are Parcoria's AI Plan Review Engine — an expert in residential construction plan review under the 2024 NC Residential Building Code, local jurisdiction requirements for the Research Triangle (Raleigh, Durham, Chapel Hill, Cary, Apex), and common failure patterns in residential permit submissions.

You are analyzing uploaded construction drawing PDFs. Your job is to provide a structured, actionable plan review report that mirrors what a municipal plan reviewer would flag.

Your report must include these sections:

## Overall Assessment
A brief (2-3 sentence) summary of the submission's readiness. Include an overall readiness score (X/10).

## Page-by-Page Review
For each page or sheet you can identify, note:
- What the sheet appears to be (site plan, floor plan, elevations, structural, etc.)
- What is clearly present and correct
- What is missing, unclear, or non-compliant

## Code Compliance Flags 🚩
Specific items that would likely trigger a correction notice from a municipal plan reviewer. Reference the actual NC code section or local ordinance where possible.

## Missing Documents / Sheets
What appears to be absent from this submission that would be required for a complete submittal.

## Corrections Required Before Submission ✏️
A prioritized numbered list of corrections the design team should make before submitting.

## What's Well-Done ✓
Items that are clearly correct and would not trigger corrections.

Tone:
- Specific and technical — cite code sections, dimensions, and requirements
- Do not hedge excessively — give a real professional assessment
- Flag genuine issues; do not invent problems that aren't visible in the drawings
- If something is unclear due to scan quality or resolution, say so explicitly

End with:
*This AI plan review is intended to help identify likely issues before submission. It is not a substitute for official plan review by the local jurisdiction. Parcoria does not guarantee permit approval. Always verify requirements with your local building department.*`

// ─── Paywall components ───────────────────────────────────────────────────────

function Stage1Paywall() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-4xl mb-4">📋</div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Plan Pre-Check</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Answer questions about your project and Parcoria's AI flags likely issues before you submit to the permit office — saving weeks of correction cycles.
      </p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
        {['AI compliance review against NC Building Code', 'Flags missing documents before submission', 'Identifies common rejection reasons for your project type', 'Saves weeks of back-and-forth with reviewers'].map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 text-xs text-gray-600">
            <svg className="w-4 h-4 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </div>
        ))}
      </div>
      <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors">
        Unlock Plan Pre-Check - $79 ↗
      </a>
      <div className="mt-4">
        <a href="/restore" className="text-xs text-gray-400 hover:text-gray-600">Already paid? Restore access ↗</a>
      </div>
    </div>
  )
}

function Stage2Paywall() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
      <div className="text-4xl mb-4">🔍</div>
      <div className="text-base font-semibold text-gray-900 mb-2">PDF Plan Review</div>
      <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-sm mx-auto">
        Upload your construction drawings and get a page-by-page AI review that mirrors what a municipal plan reviewer would flag — before you submit.
      </p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 max-w-sm mx-auto">
        {[
          'Page-by-page review of your actual drawings',
          'Flags code compliance issues with NC code citations',
          'Identifies missing sheets and incomplete callouts',
          'Mirrors real municipal plan reviewer standards',
          'Available for all 10 Research Triangle jurisdictions',
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 text-xs text-gray-600">
            <svg className="w-4 h-4 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </div>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-2 text-xs text-amber-700 font-medium mb-5">
        Developer plan required — $299/month
      </div>
      <div>
        <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors">
          Upgrade to Developer ↗
        </a>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        Already a developer? <a href="/restore" className="underline hover:text-gray-600">Restore access ↗</a>
      </div>
    </div>
  )
}

// ─── Stage 2: PDF Review component ───────────────────────────────────────────

function PdfReview() {
  const [file, setFile] = useState(null)
  const [jurisdiction, setJurisdiction] = useState('raleigh')
  const [projectType, setProjectType] = useState('sfh')
  const [notes, setNotes] = useState('')
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const fileRef = useRef()

  const JURISDICTIONS = [
    { id: 'raleigh', label: 'Raleigh' }, { id: 'durham', label: 'Durham' },
    { id: 'chapelhill', label: 'Chapel Hill' }, { id: 'cary', label: 'Cary' },
    { id: 'apex', label: 'Apex' }, { id: 'hollysprings', label: 'Holly Springs' },
    { id: 'wakeforest', label: 'Wake Forest' }, { id: 'morrisville', label: 'Morrisville' },
    { id: 'garner', label: 'Garner' }, { id: 'fuquayvarina', label: 'Fuquay-Varina' },
  ]

  const PROJ_TYPES = [
    { id: 'sfh', label: 'New single-family home' }, { id: 'adu', label: 'ADU' },
    { id: 'addition', label: 'Addition' }, { id: 'reno', label: 'Renovation' },
    { id: 'deck', label: 'Deck / porch' }, { id: 'pool', label: 'Pool' },
    { id: 'townhouse', label: 'Townhouse / duplex' },
  ]

  function handleDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') setFile(f)
    else setError('Please upload a PDF file.')
  }

  async function runReview() {
    if (!file) return
    setLoading(true)
    setError('')
    setReport('')
    setProgress('Reading PDF...')

    try {
      // Convert PDF to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setProgress('Sending to AI reviewer...')

      const jur = JURISDICTIONS.find(j => j.id === jurisdiction)?.label || jurisdiction
      const proj = PROJ_TYPES.find(p => p.id === projectType)?.label || projectType

      const userPrompt = `Please review these construction drawings for a ${proj} project in ${jur}, NC.

Jurisdiction: ${jur}, NC
Project type: ${proj}
File name: ${file.name}
${notes ? `Additional context from applicant: ${notes}` : ''}

Provide a thorough plan review report as described in your instructions.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: STAGE2_SYSTEM,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64,
                },
              },
              { type: 'text', text: userPrompt },
            ],
          }],
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || `API error ${response.status}`)
      }

      setProgress('Generating report...')
      const data = await response.json()
      setReport(cleanMarkdown(data.content?.[0]?.text || 'Unable to generate report.'))
    } catch (err) {
      console.error('PDF review error:', err)
      if (err.message.includes('Could not process PDF')) {
        setError('This PDF could not be processed — it may be a scanned image without a text layer, or the file may be corrupted. Try a digital (not scanned) PDF, or use Stage 1 text review instead.')
      } else {
        setError(`Review failed: ${err.message}`)
      }
    } finally {
      setLoading(false)
      setProgress('')
    }
  }

  if (report) return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">P</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">PDF Plan Review</div>
            <div className="text-xs text-gray-400">{file.name} · {JURISDICTIONS.find(j => j.id === jurisdiction)?.label}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded-full font-medium">Developer</span>
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-full font-medium">AI assisted</span>
          </div>
        </div>
        <div className="px-5 py-5">
          <div className="prose prose-sm max-w-none [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:pl-5 [&_li]:my-1.5 [&_li]:leading-snug [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:text-gray-500 [&_em]:text-xs">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => { setReport(''); setFile(null) }}
          className="py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors">
          Review another PDF
        </button>
        <button onClick={() => window.print()}
          className="py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
          Print report ↗
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Jurisdiction + project type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1.5">Jurisdiction</label>
          <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
            {JURISDICTIONS.map(j => <option key={j.id} value={j.id}>{j.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1.5">Project type</label>
          <select value={projectType} onChange={e => setProjectType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
            {PROJ_TYPES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* PDF upload */}
      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1.5">Construction drawings (PDF)</label>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !file && fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50 cursor-pointer'
          }`}>
          {file ? (
            <div>
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm font-medium text-green-800">{file.name}</div>
              <div className="text-xs text-green-600 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
              <button onClick={e => { e.stopPropagation(); setFile(null) }}
                className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors">
                Remove file ×
              </button>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-3">📁</div>
              <div className="text-sm font-medium text-gray-700">Drop PDF here or click to upload</div>
              <div className="text-xs text-gray-400 mt-1">Digital PDFs work best — scanned images may have limited accuracy</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden"
          onChange={e => { const f = e.target.files[0]; if (f) setFile(f); e.target.value = '' }} />
      </div>

      {/* Optional notes */}
      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1.5">
          Context for the reviewer <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          placeholder="e.g. This is a Phase 1 resubmission after corrections. Concerns: structural beam spans on Sheet S2, energy code compliance method."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed">
        <strong>Best results:</strong> Upload digital (not scanned) PDFs with text layers. Larger files (&gt;20MB) may time out — try splitting into separate plan sheets if needed. This review is AI-assisted and not a substitute for official plan review.
      </div>

      {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-700">{error}</div>}

      <button onClick={runReview} disabled={!file || loading}
        className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {progress || 'Reviewing drawings...'}
          </span>
        ) : (
          '🔍 Run AI plan review ↗'
        )}
      </button>
    </div>
  )
}

// ─── Stage 1 questionnaire ────────────────────────────────────────────────────

function Questionnaire() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(id, val) { setAnswers(a => ({ ...a, [id]: val })) }

  function currentQuestions() {
    return STEPS[step].ids.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean)
  }

  function stepComplete() {
    return STEPS[step].ids.every(id => {
      const q = QUESTIONS.find(q => q.id === id)
      return q?.optional || answers[id]
    })
  }

  async function generateReport() {
    setLoading(true)
    setError('')
    const summary = QUESTIONS.filter(q => answers[q.id]).map(q => `${q.label}: ${answers[q.id]}`).join('\n')
    const prompt = `Please review this Raleigh, NC residential construction project and provide a pre-submission compliance report:\n\n${summary}`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: STAGE1_SYSTEM,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!response.ok) { const err = await response.json(); throw new Error(err.error?.message || 'API error') }
      const data = await response.json()
      setReport(cleanMarkdown(data.content?.[0]?.text || 'Unable to generate report.'))
    } catch (err) {
      setError('Something went wrong generating your report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (report) return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">P</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Pre-check report</div>
            <div className="text-xs text-gray-400">{answers.address || 'Raleigh, NC'} · {answers.project_type}</div>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-full font-medium">Beta - AI assisted</span>
          </div>
        </div>
        <div className="px-5 py-5">
          <div className="prose prose-sm max-w-none [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:pl-5 [&_li]:my-1.5 [&_li]:leading-snug [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:text-gray-500 [&_em]:text-xs">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => { setReport(''); setStep(0); setAnswers({}) }}
          className="py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors">
          Start new check
        </button>
        <Link to="/wizard" className="py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors text-center">
          Go to permit wizard ↗
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-1.5 ${i <= step ? 'text-brand-700' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden sm:block font-medium">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-100" />}
          </div>
        ))}
      </div>

      <div className="space-y-5 mb-8">
        <h2 className="text-base font-semibold text-gray-900">{STEPS[step].label}</h2>
        {currentQuestions().map(q => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {q.label}{q.optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
            </label>
            {q.type === 'select' && (
              <select value={answers[q.id] || ''} onChange={e => update(q.id, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select an option...</option>
                {q.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
            {q.type === 'text' && (
              <input type="text" value={answers[q.id] || ''} onChange={e => update(q.id, e.target.value)} placeholder={q.placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            )}
            {q.type === 'textarea' && (
              <textarea value={answers[q.id] || ''} onChange={e => update(q.id, e.target.value)} placeholder={q.placeholder} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!stepComplete()}
            className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Continue - {STEPS[step + 1].label}
          </button>
        ) : (
          <button onClick={generateReport} disabled={loading}
            className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing your project...
              </span>
            ) : 'Generate pre-check report ↗'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PreCheck() {
  const [activeTab, setActiveTab] = useState('stage1')

  if (!hasAccess()) return <Stage1Paywall />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
          AI Plan Pre-Check Engine
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Pre-submission plan review</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Catch issues before you submit — saves weeks of correction cycles with plan reviewers.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-7">
        <button onClick={() => setActiveTab('stage1')}
          className={`flex-1 flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'stage1' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <span>📋</span> Stage 1 — Questionnaire
        </button>
        <button onClick={() => setActiveTab('stage2')}
          className={`flex-1 flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'stage2' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <span>🔍</span> Stage 2 — PDF Review
          {!isDeveloper() && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1">Dev</span>}
        </button>
      </div>

      {activeTab === 'stage1' && <Questionnaire />}
      {activeTab === 'stage2' && (
        isDeveloper() ? <PdfReview /> : <Stage2Paywall />
      )}
    </div>
  )
}
