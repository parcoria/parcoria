// SampleRoadmap.jsx
// A fully rendered example permit roadmap — no paywall, no blur
// Shows exactly what paying customers see
// Uses a realistic Raleigh new SFH as the example project

import { Link } from 'react-router-dom'

const SAMPLE = {
  proj: 'New single-family home',
  addr: '4521 Oberlin Rd, Raleigh, NC 27608',
  jurisdiction: 'Raleigh',
  permitCount: 10,
  timeline: '3–5 months',
  fees: '$8,000–$14,000',
  phases: [
    {
      label: 'Before you apply',
      permits: [
        {
          name: 'Lot survey & site plan',
          desc: 'Site plan drawn to scale required showing building footprint, distances to property lines, driveway location, and impervious surface calculations.',
          jurisdiction: 'county',
          jLabel: 'Wake County',
          jColor: 'bg-amber-50 text-amber-700 border border-amber-100',
          time: '1–2 wks',
          url: 'https://www.wakegov.com/departments-government/register-of-deeds',
        },
        {
          name: 'Lien agent appointment',
          desc: 'Required by NC law for all projects $40,000 or more. Must be designated before permits are issued. File at liensnc.com and post on job site.',
          jurisdiction: 'state',
          jLabel: 'NC State',
          jColor: 'bg-green-50 text-green-700 border border-green-100',
          time: '1 day',
          url: 'https://www.liensnc.com',
          warn: true,
        },
      ],
    },
    {
      label: 'Phase 1 — zoning',
      permits: [
        {
          name: 'Zoning compliance permit',
          desc: 'Confirms your project complies with Raleigh Unified Development Ordinance — setbacks, height limits, lot coverage, and use. Required before building permit is issued.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: '5–10 days',
          url: 'https://raleighnc.gov/permits',
        },
      ],
    },
    {
      label: 'Phase 2 — building & trade permits',
      permits: [
        {
          name: 'Residential building permit',
          desc: 'Primary permit for new construction. Full plan review against NC Residential Code required. Submit architectural drawings, floor plans, elevations, and energy compliance documentation.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: '10–15 working days',
          url: 'https://raleighnc.gov/permits',
        },
        {
          name: 'Electrical permit',
          desc: 'Must be submitted by a licensed NC electrical contractor. Covers service entrance, panel, rough-in wiring, and all fixtures.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: 'Concurrent with building',
          url: 'https://raleighnc.gov/permits',
        },
        {
          name: 'Plumbing permit',
          desc: 'Must be submitted by a licensed NC plumbing contractor. Covers water supply, DWV rough-in, and all fixtures.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: 'Concurrent with building',
          url: 'https://raleighnc.gov/permits',
        },
        {
          name: 'Mechanical / HVAC permit',
          desc: 'Must be submitted by a licensed NC mechanical contractor. Covers ductwork, equipment, and ventilation systems.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: 'Concurrent with building',
          url: 'https://raleighnc.gov/permits',
        },
      ],
    },
    {
      label: 'Phase 3 — utilities & compliance',
      permits: [
        {
          name: 'Water & sewer connection permit',
          desc: 'Raleigh Water issues connection permit. Submit water availability form to water.review@raleighnc.gov before breaking ground. Tap fees due at permit issuance.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: '5–10 days',
          url: 'https://raleighnc.gov/water',
        },
        {
          name: 'Land disturbance / grading permit',
          desc: 'Required for any site disturbance over 12,000 sq ft or within a watershed protection overlay. Erosion and sediment control plan required.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: '5–10 days',
          url: 'https://raleighnc.gov/permits',
        },
      ],
    },
    {
      label: 'Phase 4 — inspections',
      permits: [
        {
          name: 'Construction inspections (7 stages)',
          desc: 'Footing → Foundation → Framing → Rough-in (electrical, plumbing, HVAC) → Insulation → Final building → Final trade inspections. Schedule through Wake County before 3 PM for next business day.',
          jurisdiction: 'county',
          jLabel: 'Wake County',
          jColor: 'bg-amber-50 text-amber-700 border border-amber-100',
          time: 'Throughout construction',
          url: 'https://www.wakegov.com/building',
        },
        {
          name: 'Certificate of Occupancy',
          desc: 'Issued after all final inspections pass. Required before the home can be legally occupied. All permit fees including reinspection fees must be paid before CO is issued.',
          jurisdiction: 'city',
          jLabel: 'City of Raleigh',
          jColor: 'bg-blue-50 text-blue-700 border border-blue-100',
          time: '3–5 days after final inspection',
          url: 'https://raleighnc.gov/permits',
        },
      ],
    },
  ],
  professionals: [
    { level: 'required', name: 'Licensed General Contractor (GC)', why: 'NC law requires a licensed GC for all projects $40,000 or more. Must designate a Mechanics Lien Agent before permits are issued. Verify license at nclbgc.org.' },
    { level: 'required', name: 'Licensed Electrician', why: 'All electrical work requires an NC licensed electrical contractor. Separate electrical permit required — cannot be pulled by the GC.' },
    { level: 'required', name: 'Licensed Plumber', why: 'All plumbing work requires an NC licensed plumbing contractor. Separate plumbing permit required.' },
    { level: 'required', name: 'Licensed HVAC Contractor', why: 'All mechanical systems require an NC licensed mechanical contractor. Separate mechanical permit required.' },
    { level: 'required', name: 'Licensed Land Surveyor', why: 'Site plan drawn to scale is required for permit submission. Must show building footprint, setbacks, impervious surface area, and driveway location.' },
    { level: 'recommended', name: 'Architect or Residential Designer', why: 'Full construction drawings required for plan review. Experienced architects know what Raleigh reviewers look for — complete drawings on the first submission saves 2–4 weeks.' },
    { level: 'recommended', name: 'Structural Engineer', why: 'Required for any engineered lumber products (LVL beams, trusses). All truss drawings must be sealed by a licensed engineer.' },
  ],
  inspections: [
    'Footing / foundation — before concrete is poured',
    'Foundation walls — after forms are set',
    'Framing — after complete, before insulation or drywall',
    'Rough-in electrical — before walls are closed',
    'Rough-in plumbing — before walls are closed',
    'Rough-in HVAC — before walls are closed',
    'Insulation — before drywall',
    'Final building — after all work complete',
    'Final electrical — after all fixtures installed',
    'Final plumbing — after all fixtures installed',
    'Final HVAC — after all equipment installed',
    'Certificate of Occupancy walkthrough',
  ],
}

const PRO_STYLES = {
  required:    { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border border-red-100', label: 'Required by NC law' },
  recommended: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border border-amber-100', label: 'Strongly recommended' },
}

export default function SampleRoadmap() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Sample banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
        <span className="text-base flex-shrink-0">📋</span>
        <div>
          <div className="text-xs font-semibold text-amber-800">This is a sample roadmap</div>
          <div className="text-xs text-amber-700 leading-relaxed">
            This shows exactly what paying customers see — a real permit sequence for a real project type. Enter your address to get your specific roadmap.{' '}
            <Link to="/wizard" className="underline font-medium">Try it free ↗</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <p className="text-xs text-gray-400 mb-1">Sample permit roadmap</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        Permit roadmap — {SAMPLE.proj}
      </h1>
      <p className="text-xs text-gray-400 mb-6">{SAMPLE.addr}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { n: SAMPLE.permitCount, l: 'Permits required' },
          { n: SAMPLE.timeline, l: 'Est. timeline' },
          { n: SAMPLE.fees, l: 'Est. permit fees' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-lg font-semibold text-gray-900">{s.n}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Permits by phase */}
      {SAMPLE.phases.map((phase, pi) => (
        <div key={pi} className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{phase.label}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          {phase.permits.map((pm, i) => (
            <div key={i} className={`flex gap-3 items-start border rounded-lg p-3 mb-2 ${pm.warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium mb-0.5 ${pm.warn ? 'text-amber-800' : 'text-gray-900'}`}>{pm.name}</div>
                <div className={`text-xs leading-relaxed mb-2 ${pm.warn ? 'text-amber-700' : 'text-gray-500'}`}>{pm.desc}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pm.jColor}`}>{pm.jLabel}</span>
                  <span className="text-xs text-gray-400">⏱ {pm.time}</span>
                </div>
                <a href={pm.url} target="_blank" rel="noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 mt-1.5 inline-block">
                  Apply / view details ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Professionals */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Licensed professionals required</h2>
        <p className="text-xs text-gray-500 mb-4">Based on project type and NC law — exactly who you need and why.</p>
        {['required', 'recommended'].map(level => {
          const group = SAMPLE.professionals.filter(p => p.level === level)
          return (
            <div key={level} className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{PRO_STYLES[level].label}</div>
              {group.map((p, i) => (
                <div key={i} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-3 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${PRO_STYLES[level].dot}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-0.5">{p.name}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{p.why}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Inspection timeline */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Inspection timeline</h2>
        <p className="text-xs text-gray-400 mb-3">Schedule all inspections through Wake County. Request before 3 PM for next business day.</p>
        {SAMPLE.inspections.map((ins, i) => (
          <div key={i} className="flex gap-3 items-center py-2.5 border-b border-gray-100 last:border-none">
            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</div>
            <span className="text-sm text-gray-700">{ins}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-brand-600 rounded-2xl p-6 text-center">
        <div className="text-white font-semibold text-lg mb-1">Get your specific permit roadmap</div>
        <div className="text-brand-200 text-sm mb-5 leading-relaxed">
          This sample is for a Raleigh new construction. Your project — different address, different type, different jurisdiction — will have a different sequence. Enter your address and get the exact roadmap for your build.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/wizard"
            className="px-6 py-3 bg-white text-brand-700 text-sm font-semibold rounded-xl hover:bg-brand-50 transition-colors">
            Try the wizard free — 2 minutes ↗
          </Link>
          <Link to="/pricing"
            className="px-6 py-3 border border-brand-400 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors">
            See pricing — from $79
          </Link>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link to="/learn" className="text-xs text-gray-400 hover:text-gray-600">
          ← Learn how the permit process works
        </Link>
      </div>
    </div>
  )
}
