import { useLocation, Link } from 'react-router-dom'

const SFH_PLAN = [
  {
    phase: 'Phase 1 — Pre-application', color: 'bg-brand-600',
    weeks: [
      {
        week: 'Week 1', title: 'Secure your parcel intelligence', badge: 'Critical',
        badgeColor: 'bg-red-50 text-red-700 border border-red-100',
        tasks: [
          'Pull your Wake County parcel record at wake.gov — confirm parcel ID, zoning, and lot dimensions',
          'Order a boundary survey from a NC Licensed Land Surveyor — budget $1,500–$3,500, takes 1–2 weeks',
          'Contact Raleigh GIS Addressing at addressing@raleighnc.gov to lock in your official address assignment',
          'Register on the Raleigh Permit Portal at permitportal.raleighnc.gov — verification takes 1–2 days',
          'File your Lien Agent Appointment at liensnc.com before any work begins — required for projects over $40,000',
        ],
        warning: 'Do not hire a contractor or break ground until your lien agent is appointed. NC law is strict — failure to file exposes you to serious financial risk.',
      },
      {
        week: 'Week 2', title: 'Hire your licensed GC and design team', badge: 'Critical',
        badgeColor: 'bg-red-50 text-red-700 border border-red-100',
        tasks: [
          'Verify GC license at nclbgc.org — search by name or license number before signing anything',
          'Get at least 3 GC bids — scope must include permit pulling, trade coordination, and inspection scheduling',
          'Engage an architect or residential designer — full construction drawings required for building permit',
          'Confirm your GC carries general liability and workers comp insurance — request certificates before signing',
        ],
        tip: 'Ask each GC how many active Raleigh permits they currently hold. A GC with existing city relationships moves faster through plan review.',
      },
      {
        week: 'Weeks 3–4', title: 'Zoning and site permits', badge: 'Permit action',
        badgeColor: 'bg-blue-50 text-blue-700 border border-blue-100',
        tasks: [
          'Submit Zoning Permit application — confirm UDO compliance, setbacks, and lot coverage',
          'Submit Site / Grading Permit — include stormwater management plan and tree conservation plan',
          'Confirm water and sewer availability — email water.review@raleighnc.gov and begin connection permit',
          'Receive sealed plot plan from your surveyor — required for building permit submission',
        ],
        tip: 'Zoning and site permits run in parallel. Target 5–15 day approvals. Follow up at day 10 if no response.',
      },
    ]
  },
  {
    phase: 'Phase 2 — Building permits', color: 'bg-green-600',
    weeks: [
      {
        week: 'Weeks 5–6', title: 'Submit full building permit package', badge: 'Permit action',
        badgeColor: 'bg-blue-50 text-blue-700 border border-blue-100',
        tasks: [
          'Submit Residential Building Permit with complete construction drawings, energy compliance, and structural calculations',
          'Submit Electrical, Plumbing, and Mechanical permits concurrently — reviewed alongside the building permit',
          'Pay permit fees at submission — budget $8,000–$18,000 total depending on square footage',
          'Assign a permit contact person — someone who checks the portal daily and responds to comments within 24 hours',
        ],
        warning: 'The city targets 15-day initial review. Most correction cycles happen because drawings are incomplete at submission. Have your architect review the submittal checklist line by line.',
      },
      {
        week: 'Weeks 7–9', title: 'Plan review and correction cycle', badge: 'Watch item',
        badgeColor: 'bg-amber-50 text-amber-700 border border-amber-100',
        tasks: [
          'Monitor the permit portal daily — reviewer comments can arrive any time and the clock stops until you respond',
          'Address all plan review corrections within 48 hours — delays here cascade across your entire schedule',
          'If no comments by day 12, call the plans examiner directly — proactive contact is acceptable and often faster',
          'Begin material procurement for long-lead items — windows, doors, HVAC — while permit is in review',
        ],
        tip: 'Most first-time submissions go through 1–2 correction cycles. Budget 2 extra weeks in your schedule for this.',
      },
      {
        week: 'Week 10', title: 'Permit approved — mobilize', badge: 'Critical',
        badgeColor: 'bg-red-50 text-red-700 border border-red-100',
        tasks: [
          'Download and print all approved permit cards — must be posted on site at all times during construction',
          'Post the permit placard visibly at the job site entrance before any work begins',
          'Schedule temporary power and site utilities with your GC',
          'Confirm inspection scheduling process with Wake County — test the inspection request workflow',
        ],
      },
    ]
  },
  {
    phase: 'Phase 3 — Construction & inspections', color: 'bg-amber-600',
    weeks: [
      {
        week: 'Weeks 11–12', title: 'Site work and foundation', badge: 'Inspection',
        badgeColor: 'bg-green-50 text-green-700 border border-green-100',
        tasks: [
          'Clear and grade site — erosion control measures must be in place before any soil disturbance',
          'Pour footings — schedule footing / foundation inspection through Wake County before pouring concrete',
          'Do not pour until inspector has signed off — failure here means breaking out concrete',
          'Begin water and sewer connection work with city-licensed utility contractor',
        ],
        warning: 'Inspection 1 of 9. Never cover or conceal work before the relevant inspection passes. This is the most common — and most expensive — mistake on residential builds.',
      },
      {
        week: 'Weeks 13–15', title: 'Framing', badge: 'Inspection',
        badgeColor: 'bg-green-50 text-green-700 border border-green-100',
        tasks: [
          'Complete structural framing — walls, floors, roof structure',
          'Schedule framing inspection before any insulation or sheathing goes up',
          'Begin rough-in work for electrical, plumbing, and HVAC in parallel with late framing',
          'Confirm window and door deliveries are on schedule — delays here stall weathertight closure',
        ],
      },
      {
        week: 'Weeks 16–17', title: 'Rough-in inspections', badge: 'Inspection',
        badgeColor: 'bg-green-50 text-green-700 border border-green-100',
        tasks: [
          'Schedule rough-in inspection for electrical, plumbing, and HVAC — all three reviewed before walls close',
          'Ensure all penetrations are properly fire-blocked and sealed before inspector arrives',
          'Schedule insulation inspection immediately after rough-in passes',
          'Begin exterior work — siding, roofing, windows — while interior inspections run',
        ],
        tip: 'Inspections 3, 4, and 5 of 9. Stack these as close together as possible — each one waiting costs 3–5 days of schedule.',
      },
      {
        week: 'Weeks 18–20', title: 'Interior finish and final inspections', badge: 'Inspection',
        badgeColor: 'bg-green-50 text-green-700 border border-green-100',
        tasks: [
          'Complete interior finishes — drywall, paint, flooring, trim, fixtures',
          'Schedule final building, electrical, plumbing, and mechanical inspections — all four must pass',
          'Walk the property with your GC before the inspector arrives — punch list everything that could fail',
          'Confirm smoke detectors, CO detectors, and GFCI outlets are installed per NC code',
        ],
      },
    ]
  },
  {
    phase: 'Phase 4 — Close-out', color: 'bg-purple-600',
    weeks: [
      {
        week: 'Weeks 21–22', title: 'Certificate of occupancy', badge: 'Critical',
        badgeColor: 'bg-red-50 text-red-700 border border-red-100',
        tasks: [
          'Submit Certificate of Occupancy application after all final inspections pass',
          'City targets 5–10 business days for CO issuance after application',
          'Collect all lien waivers from every contractor and supplier before CO is issued — protects your title',
          'Compile your Parcoria evidence vault — all permits, inspection reports, stamped drawings, and lien waivers',
        ],
        warning: 'You cannot legally occupy the home until the CO is in hand. Do not schedule your move-in date until CO is confirmed.',
      },
      {
        week: 'Weeks 23–24', title: 'Post-CO and project close-out', badge: 'Wrap-up',
        badgeColor: 'bg-gray-100 text-gray-600 border border-gray-200',
        tasks: [
          'Transfer all contractor warranties to your name — HVAC, roofing, appliances, windows',
          'Notify your homeowner\'s insurance carrier — CO triggers conversion from builder\'s risk coverage',
          'File your homestead exemption with Wake County Tax Administration if this is your primary residence',
          'Archive your complete project record — every permit, inspection, drawing, and lien waiver — permanently',
        ],
        tip: 'Your project record is worth money at resale. Buyers and appraisers pay premium for homes with clean, documented permit and inspection history.',
      },
    ]
  },
]

const GENERIC_PLAN = [
  {
    phase: 'Phase 1 — Pre-application', color: 'bg-brand-600',
    weeks: [
      {
        week: 'Week 1', title: 'Gather your parcel documents', badge: 'Critical',
        badgeColor: 'bg-red-50 text-red-700 border border-red-100',
        tasks: [
          'Pull your Wake County parcel record at wake.gov — confirm parcel ID and zoning',
          'Register on the Raleigh Permit Portal at permitportal.raleighnc.gov',
          'If project exceeds $40,000, file Lien Agent Appointment at liensnc.com before any work begins',
          'Verify any contractor licenses at nclbgc.org',
        ],
      },
    ]
  },
  {
    phase: 'Phase 2 — Permits', color: 'bg-green-600',
    weeks: [
      {
        week: 'Weeks 2–3', title: 'Submit permit applications', badge: 'Permit action',
        badgeColor: 'bg-blue-50 text-blue-700 border border-blue-100',
        tasks: [
          'Submit all required permits through the Raleigh Permit Portal',
          'Pay permit fees at submission',
          'Monitor portal daily for reviewer comments — respond within 48 hours',
        ],
        tip: 'Check the portal every day during review. The clock stops the moment a comment is posted — until you respond.',
      },
    ]
  },
  {
    phase: 'Phase 3 — Inspections', color: 'bg-amber-600',
    weeks: [
      {
        week: 'During construction', title: 'Schedule and pass all inspections', badge: 'Inspection',
        badgeColor: 'bg-green-50 text-green-700 border border-green-100',
        tasks: [
          'Schedule each inspection through Wake County before covering or concealing any work',
          'Never proceed past an inspection stage without a signed-off inspection card',
          'Keep all permit placards posted visibly on site at all times',
        ],
        warning: 'Never cover work before the relevant inspection passes. This is the most common and most expensive mistake on any build.',
      },
    ]
  },
  {
    phase: 'Phase 4 — Close-out', color: 'bg-purple-600',
    weeks: [
      {
        week: 'Final week', title: 'Certificate of occupancy', badge: 'Critical',
        badgeColor: 'bg-red-50 text-red-700 border border-red-100',
        tasks: [
          'Submit Certificate of Occupancy application after all final inspections pass',
          'Collect all lien waivers from contractors and suppliers',
          'Archive all permits, drawings, and inspection records permanently',
        ],
      },
    ]
  },
]

import { t, useLang } from '../lib/i18n'

export default function ActionPlan() {
  useLang() // re-render on language change
  const { state } = useLocation()
  const proj = state?.proj || 'sfh'
  const addr = state?.addr || 'Raleigh, NC'
  const isSFH = proj === 'sfh'
  const plan = isSFH ? SFH_PLAN : GENERIC_PLAN

  const PROJ_LABELS = { sfh: t('proj_sfh'), adu: t('proj_adu'), addition: t('proj_addition'), deck: t('proj_deck'), reno: t('proj_reno'), pool: t('proj_pool'), shed: t('proj_shed'), townhouse: t('proj_townhouse') }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-xs text-gray-400 mb-1">Parcoria · {t('action_sub')}</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{PROJ_LABELS[proj] || t('action_title')}</h1>
        <p className="text-sm text-gray-400">{addr}</p>
      </div>

      {/* Print button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => window.print()}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1.5">
          🖨️ {t('action_print')}
        </button>
      </div>

      {/* Warning banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 text-xs text-amber-700">
        <span className="flex-shrink-0 font-semibold">{t('action_warning_hdr')}:</span>
        {t('action_warning_txt')}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { n: isSFH ? '20–24' : '4–12', l: 'Weeks to CO' },
          { n: isSFH ? '11+' : '2–5',    l: 'Permits needed' },
          { n: isSFH ? '9' : '2–4',      l: 'Inspections' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xl font-semibold text-gray-900">{s.n}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {plan.map((phase, pi) => (
        <div key={pi} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${phase.color}`} />
            <h2 className="text-sm font-semibold text-gray-900">{phase.phase}</h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          {phase.weeks.map((w, wi) => (
            <div key={wi} className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">{w.week}</div>
                  <div className="text-sm font-semibold text-gray-900">{w.title}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${w.badgeColor}`}>{w.badge}</span>
              </div>
              <ul className="flex flex-col gap-2 mb-3">
                {w.tasks.map((task, ti) => (
                  <li key={ti} className="flex gap-2 items-start text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-2" />
                    {task}
                  </li>
                ))}
              </ul>
              {w.warning && (
                <div className="flex gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 leading-relaxed">
                  <span className="flex-shrink-0">⚠️ {t('action_warning')}:</span>
                  {w.warning}
                </div>
              )}
              {w.tip && (
                <div className="flex gap-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 leading-relaxed">
                  <span className="flex-shrink-0">💡 {t('action_tip')}:</span>
                  {w.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-2 mt-8">
        <Link to="/wizard" className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors text-center">
          {t('action_start_over')}
        </Link>
        <Link to="/" className="flex-1 py-3 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors text-center">
          {t('nav_home')}
        </Link>
      </div>
    </div>
  )
}
