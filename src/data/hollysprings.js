// Holly Springs, NC — Permit Intelligence
// Jurisdiction: Town of Holly Springs
// County: Wake County (inspections shared with Raleigh)
// Portal: CityView Portal — single portal for applications, payments, inspections, status
// Key note: One of fastest growing towns in US — active residential construction market

export const HOLLY_SPRINGS_META = {
  city: 'Holly Springs',
  county: 'Wake County',
  state: 'NC',
  portals: {
    main: 'https://cityview.hollyspringsnc.us/portal',
    tracker: 'https://www.hollyspringsnc.gov/669/Permit-Tracker',
    forms: 'https://www.hollyspringsnc.gov/107/Forms',
  },
  contacts: {
    main: '311 or (919) 577-3111',
    email: 'DSPermitting@hollyspringsnc.gov',
    address: '128 S. Main St, Holly Springs, NC 27540',
    hours: 'Mon–Fri 8:00 AM – 5:00 PM',
  },
  notes: [
    'Holly Springs uses a single CityView Portal for everything — applications, payments, inspections, and status tracking',
    'Inspection requests received before 4:00 PM scheduled for next business day. After 4:00 PM scheduled for second business day',
    'Owner-builders allowed for single family dwellings only — must be primary residence for 12 months, notarized affidavit required',
    'Projects over $40,000 require licensed NC General Contractor and lien agent appointment',
    'Wake County performs all field inspections — same as Raleigh',
    'Progress Energy premise number required for reporting approved inspections for electrical finals',
    'Holly Springs is one of the fastest growing towns in the US — plan review backlogs possible during peak seasons',
  ],
}

export const HOLLY_SPRINGS_PERMIT_DATA = {
  sfh: {
    count: 11, timeline: '3–5 months', fees: '$7,500–$16,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          {
            icon: 'map',
            name: 'Lot survey & plot plan',
            desc: 'Plot plan required showing proposed building area on the lot. A survey is drawn to show what is actually on the plot — must be signed and sealed by a licensed NC Surveyor.',
            jurisdiction: 'county',
            time: '1–2 wks',
            url: 'https://www.wakegov.com/departments-government/register-of-deeds',
            warn: false,
          },
          {
            icon: 'map-pin',
            name: 'Address & premise number',
            desc: 'Confirm official address with Holly Springs. Also obtain your Progress Energy premise number — required for reporting electrical inspection approvals.',
            jurisdiction: 'city',
            time: '1–3 days',
            url: 'https://www.hollyspringsnc.gov',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 1 — zoning & site',
        permits: [
          {
            icon: 'building-community',
            name: 'Zoning compliance review',
            desc: 'Submit through CityView Portal. Confirms compliance with Holly Springs Unified Development Ordinance (UDO) and zoning classification.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
          {
            icon: 'layers',
            name: 'Site / grading permit',
            desc: 'Required for land disturbance, grading, drainage, and stormwater management. Submit through CityView Portal.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 2 — building permits (CityView)',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit',
            desc: 'Apply online through CityView Portal, check status, upload documents, and pay fees all in one place. Full NC Building Code plan review.',
            jurisdiction: 'city',
            time: '5–15 working days',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Apply through CityView Portal. Progress Energy premise number required for final electrical inspection reporting.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Apply through CityView Portal. Covers all water supply, waste lines, and sewer connections.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
          {
            icon: 'wind',
            name: 'Mechanical / HVAC permit',
            desc: 'Apply through CityView Portal for all heating, ventilation, and air conditioning systems.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 3 — connections & compliance',
        permits: [
          {
            icon: 'droplets',
            name: 'Water & sewer connection',
            desc: 'Contact Holly Springs Public Utilities at (919) 557-2591 to confirm availability. Apply through CityView Portal.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
          {
            icon: 'receipt',
            name: 'Lien agent appointment',
            desc: 'Required by NC law for projects over $40,000. File at liensnc.com before any work begins.',
            jurisdiction: 'state',
            time: '1 day',
            url: 'https://www.liensnc.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 4 — inspections & close-out',
        permits: [
          {
            icon: 'clipboard-check',
            name: 'Construction inspections',
            desc: 'Request inspections through CityView Portal or call 311. Requests before 4:00 PM scheduled next day. After 4:00 PM scheduled second business day. Wake County performs all field inspections.',
            jurisdiction: 'county',
            time: 'Throughout',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
          {
            icon: 'certificate',
            name: 'Certificate of occupancy',
            desc: 'Issued after all final inspections pass. All fees must be paid before CO is issued. Required before occupancy.',
            jurisdiction: 'city',
            time: '3–5 days',
            url: 'https://cityview.hollyspringsnc.us/portal',
            warn: false,
          },
        ],
      },
    ],
  },
  adu: {
    count: 5, timeline: '6–10 weeks', fees: '$2,000–$6,000',
    phases: [
      {
        label: 'Pre-application',
        permits: [
          { icon: 'zoom-check', name: 'Zoning eligibility check', desc: 'Confirm lot qualifies for ADU under Holly Springs UDO. Email DSPermitting@hollyspringsnc.gov.', jurisdiction: 'city', time: '1–3 days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
      {
        label: 'Permits (CityView)',
        permits: [
          { icon: 'home', name: 'Residential building permit', desc: 'Apply through CityView Portal. Detached ADUs treated as single-family dwelling.', jurisdiction: 'city', time: '5–15 working days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Apply through CityView Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'Required if ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
      {
        label: 'Completion',
        permits: [
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required before ADU can be rented or occupied.', jurisdiction: 'city', time: '3–5 days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
    ],
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$1,000',
    phases: [
      {
        label: 'Permits (CityView)',
        permits: [
          { icon: 'tools', name: 'Residential building permit — deck / porch', desc: 'Apply through CityView Portal or email DSPermitting@hollyspringsnc.gov.', jurisdiction: 'city', time: '5–10 working days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Required if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
    ],
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [
      {
        label: 'Permits (CityView)',
        permits: [
          { icon: 'ripple', name: 'Swimming pool / spa permit', desc: 'Apply through CityView Portal. Required for all in-ground and above-ground pools over 24 inches.', jurisdiction: 'city', time: '5–10 working days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting. Progress Energy premise number required for final.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'barrier-block', name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier around all pools.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
    ],
  },
  shed: {
    count: 1, timeline: '1–2 weeks', fees: '$100–$400',
    phases: [
      {
        label: 'Permits',
        permits: [
          { icon: 'home-2', name: 'Accessory structure permit', desc: 'Required for structures over 144 sq ft or 12 ft tall. Apply through CityView Portal.', jurisdiction: 'city', time: '3–5 working days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
    ],
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      {
        label: 'Permits (CityView)',
        permits: [
          { icon: 'layout-sidebar-right-expand', name: 'Residential building permit', desc: 'Apply through CityView Portal. Required for structural changes and additions.', jurisdiction: 'city', time: '5–15 working days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'If scope includes electrical modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'If scope includes plumbing modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
      {
        label: 'Completion',
        permits: [
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3–5 days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
    ],
  },
  townhouse: {
    count: 12, timeline: '4–6 months', fees: '$10,000–$22,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { icon: 'map', name: 'Lot survey & plot plan', desc: 'Sealed survey required. File with Wake County Register of Deeds.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wakegov.com', warn: false },
          { icon: 'building-community', name: 'Zoning compliance review', desc: 'Multi-unit residential requires UDO compliance review. May require Board of Adjustment approval.', jurisdiction: 'city', time: '10–20 days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
      {
        label: 'Building permits (CityView)',
        permits: [
          { icon: 'home', name: 'Residential building permit (per unit)', desc: 'Apply through CityView Portal. Each unit may require separate permit.', jurisdiction: 'city', time: '5–15 working days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'bolt', name: 'Electrical permit (per unit)', desc: 'Apply through CityView Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'droplet', name: 'Plumbing permit (per unit)', desc: 'Apply through CityView Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'wind', name: 'Mechanical / HVAC permit (per unit)', desc: 'Apply through CityView Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
      {
        label: 'Connections & compliance',
        permits: [
          { icon: 'droplets', name: 'Water & sewer connection', desc: 'Contact Holly Springs Public Utilities at (919) 557-2591 early — connection timelines vary.', jurisdiction: 'city', time: '5–10 days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required — townhouse always exceeds $40,000. File at liensnc.com.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
          { icon: 'fire-extinguisher', name: 'Fire code compliance review', desc: 'Multi-unit triggers fire separation and egress review.', jurisdiction: 'city', time: 'Concurrent', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
      {
        label: 'Completion',
        permits: [
          { icon: 'clipboard-check', name: 'Construction inspections', desc: 'Request through CityView Portal or call 311. Before 4 PM = next day. After 4 PM = second business day.', jurisdiction: 'county', time: 'Throughout', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
          { icon: 'certificate', name: 'Certificate of occupancy (per unit)', desc: 'All fees must be paid before CO issued. Required before occupancy.', jurisdiction: 'city', time: '3–5 days', url: 'https://cityview.hollyspringsnc.us/portal', warn: false },
        ],
      },
    ],
  },
}

HOLLY_SPRINGS_PERMIT_DATA.reno = HOLLY_SPRINGS_PERMIT_DATA.addition

export const HOLLY_SPRINGS_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires a licensed GC for projects $40,000+. Verify at nclbgc.org before signing.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical work requires a NC licensed electrical contractor. Progress Energy premise number required for final inspection.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing work requires a NC licensed plumbing contractor.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Mechanical systems require a NC licensed mechanical contractor.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required. Must show what is actually on the plot — hand-drawn plans not accepted for new SFH.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required for CityView Portal submission.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for unconventional spans or complex structural elements.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites with fill, slope, or expansive soils in rapidly developing Holly Springs.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000. NC law requires licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Required for all ADU electrical systems.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom plumbing.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for CityView Portal submission.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required. Below that, homeowner may self-contract in NC.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex elevated decks benefit from professional drawings.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires licensed specialty contractor for in-ground pool installation.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting. Progress Energy premise number required for final.' },
    { level: 'optional', name: 'Fence / barrier installer', why: 'NC code requires approved pool barrier.' },
  ],
  shed: [{ level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' }],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit residential requires NC licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit. Progress Energy premise number required for electrical finals.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit plumbing.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit mechanical systems.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required for fire separation and egress compliance.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required.' },
  ],
}
HOLLY_SPRINGS_PROFESSIONALS.addition = HOLLY_SPRINGS_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Required if scope includes electrical modifications.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Required if scope includes plumbing modifications.' },
  { level: 'optional', name: 'Designer or architect', why: 'Drawings required for CityView Portal submission.' },
]

export const HOLLY_SPRINGS_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing — after complete, before insulation', 'Rough-in — electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const HOLLY_SPRINGS_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Holly Springs jurisdiction confirmed', desc: 'All permits through Holly Springs Development Services. Single CityView Portal for applications, payments, inspections, and status tracking.' },
  { ok: true, title: 'Wake County inspection district', desc: 'Wake County performs all field inspections. Request through CityView Portal — before 4 PM for next day, after 4 PM for second business day.' },
  { ok: true, title: 'Progress Energy premise number required', desc: 'Obtain your Progress Energy premise number early — required for reporting approved electrical inspections including finals. Contact Progress Energy when you apply for service.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district — flagged by you' : 'No historic district reported', desc: flags.historic ? 'Historic review required before building permit. Contact Holly Springs Planning at DSPermitting@hollyspringsnc.gov.' : 'You indicated no historic district. Verify with Holly Springs Planning before submitting.', verifyUrl: 'https://www.hollyspringsnc.gov', verifyLabel: 'Verify with Holly Springs' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic — Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Holly Springs accepts permit application.' : 'You indicated city utilities. Confirm availability with Holly Springs Public Utilities at (919) 557-2591.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots in Holly Springs have setback requirements on both street frontages per Holly Springs UDO.' : 'Confirm setbacks for your zoning district in Holly Springs UDO before finalizing plans.' },
]
