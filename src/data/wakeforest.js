// Wake Forest, NC — Permit Intelligence
// Jurisdiction: Town of Wake Forest
// County: Wake County
// Portal: IDT Plans (wakeforest.idtplans.com) — same system as Apex, different town account
// Inspections: Wake County (same as Raleigh, Apex, Holly Springs)
// Key note: Inspections must be requested before 3 PM for next business day

export const WAKE_FOREST_META = {
  city: 'Wake Forest',
  county: 'Wake County',
  state: 'NC',
  portals: {
    main: 'https://wakeforest.idtplans.com/secure/',
    epermits: 'https://eutil.wakeforestnc.gov/eSuite.Permits/',
    inspections: 'https://wakeforest.idtplans.com/secure/',
  },
  contacts: {
    main: '(919) 435-9531',
    email: 'inspections@wakeforestnc.gov',
    address: '301 S. Brooks St, Wake Forest, NC 27587',
    hours: 'Mon–Fri 8:00 AM – 5:00 PM',
  },
  notes: [
    'Wake Forest uses IDT Plans portal for all permit applications — same system as Apex, different account',
    'All inspections must be requested before 3 PM for next business day scheduling',
    'Wake County performs all field inspections — same as Raleigh, Apex, Holly Springs',
    'Lien agent required for all projects $40,000 or more — must be filed before permit issued',
    'No permit issued for $40,000+ projects without Mechanics Lien Agent designation',
    'Reinspection fees apply — must be paid before next inspection can be scheduled',
  ],
}

export const WAKE_FOREST_PERMIT_DATA = {
  sfh: {
    count: 10, timeline: '3–5 months', fees: '$7,000–$15,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { icon: 'map', name: 'Lot survey & site plan', desc: 'Site plan drawn to scale required showing building footprint, distances to property lines, driveway location, and impervious surface calculations.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wakegov.com/departments-government/register-of-deeds', warn: false },
          { icon: 'map-pin', name: 'Address assignment', desc: 'Confirm official address with Wake Forest before permit application.', jurisdiction: 'city', time: '1–3 days', url: 'https://www.wakeforestnc.gov', warn: false },
        ],
      },
      {
        label: 'Phase 1 — zoning',
        permits: [
          { icon: 'building-community', name: 'Zoning compliance review', desc: 'Planning staff reviews application for zoning compliance before building permit is issued. Contact Wake Forest Planning Department.', jurisdiction: 'city', time: '5–10 days', url: 'https://www.wakeforestnc.gov/planning', warn: false },
        ],
      },
      {
        label: 'Phase 2 — building permit (IDT Plans)',
        permits: [
          { icon: 'home', name: 'Residential building permit', desc: 'Submit through IDT Plans portal at wakeforest.idtplans.com. Once zoning signs off, contact office for permit purchase. Full NC Building Code plan review required.', jurisdiction: 'city', time: '5–15 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Submit through IDT Plans portal. Must be submitted by a licensed NC electrical contractor.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'Submit through IDT Plans portal. Must be submitted by a licensed NC plumbing contractor.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
          { icon: 'wind', name: 'Mechanical / HVAC permit', desc: 'Submit through IDT Plans portal. Must be submitted by a licensed NC mechanical contractor.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        ],
      },
      {
        label: 'Phase 3 — compliance',
        permits: [
          { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required by NC law for projects $40,000+. Must be designated before permit is issued. File at liensnc.com and post on job site.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
          { icon: 'droplets', name: 'Water & sewer connection', desc: 'Contact Wake Forest Public Works for utility availability confirmation before applying.', jurisdiction: 'city', time: '5–10 days', url: 'https://www.wakeforestnc.gov', warn: false },
        ],
      },
      {
        label: 'Phase 4 — inspections & close-out',
        permits: [
          { icon: 'clipboard-check', name: 'Construction inspections', desc: 'Request before 3 PM via IDT Plans portal for next business day scheduling. Wake County performs all field inspections. Call (919) 435-9531 at 8:30 AM day-of for inspector ETA.', jurisdiction: 'county', time: 'Throughout', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Issued after all final inspections pass. All fees must be paid including any reinspection fees before CO issued.', jurisdiction: 'city', time: '3–5 days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        ],
      },
    ],
  },
  adu: {
    count: 4, timeline: '6–10 weeks', fees: '$2,000–$5,500',
    phases: [
      { label: 'Pre-application', permits: [
        { icon: 'zoom-check', name: 'Zoning eligibility check', desc: 'Confirm lot qualifies for ADU under Wake Forest UDO. Only one ADU permitted per lot.', jurisdiction: 'city', time: '1–3 days', url: 'https://www.wakeforestnc.gov/planning', warn: false },
      ]},
      { label: 'Permits (IDT Plans)', permits: [
        { icon: 'home', name: 'Residential building permit', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: '5–15 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required before ADU can be rented or occupied.', jurisdiction: 'city', time: '3–5 days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
    ],
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$900',
    phases: [{ label: 'Permits (IDT Plans)', permits: [
      { icon: 'tools', name: 'Residential building permit — deck / porch', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: '5–10 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      { icon: 'bolt', name: 'Electrical permit', desc: 'Required if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
    ]}],
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [{ label: 'Permits (IDT Plans)', permits: [
      { icon: 'ripple', name: 'Swimming pool / spa permit', desc: 'Submit through IDT Plans portal. Site plan showing pool location required.', jurisdiction: 'city', time: '5–10 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      { icon: 'bolt', name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      { icon: 'barrier-block', name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier around all pools.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
    ]}],
  },
  shed: {
    count: 1, timeline: '1–2 weeks', fees: '$100–$400',
    phases: [{ label: 'Permits', permits: [
      { icon: 'home-2', name: 'Accessory structure permit', desc: 'Required for structures exceeding 12 feet in any dimension or 144 sq ft. Submit through IDT Plans portal.', jurisdiction: 'city', time: '3–5 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
    ]}],
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      { label: 'Permits (IDT Plans)', permits: [
        { icon: 'layout-sidebar-right-expand', name: 'Residential building permit', desc: 'Submit through IDT Plans portal. Required for structural changes and additions.', jurisdiction: 'city', time: '5–15 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'bolt', name: 'Electrical permit', desc: 'If scope includes electrical modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If scope includes plumbing modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3–5 days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
    ],
  },
  townhouse: {
    count: 11, timeline: '4–6 months', fees: '$9,000–$20,000',
    phases: [
      { label: 'Before you apply', permits: [
        { icon: 'map', name: 'Lot survey & site plan', desc: 'Sealed survey required. File with Wake County Register of Deeds.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wakegov.com', warn: false },
        { icon: 'building-community', name: 'Zoning compliance review', desc: 'Multi-unit residential requires full zoning review. May require Board of Adjustment approval.', jurisdiction: 'city', time: '10–20 days', url: 'https://www.wakeforestnc.gov/planning', warn: false },
      ]},
      { label: 'Building permits (IDT Plans)', permits: [
        { icon: 'home', name: 'Residential building permit (per unit)', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: '5–15 working days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'bolt', name: 'Electrical permit (per unit)', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'droplet', name: 'Plumbing permit (per unit)', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'wind', name: 'Mechanical / HVAC permit (per unit)', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
      { label: 'Compliance', permits: [
        { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required — townhouse always exceeds $40,000. Must be posted on job site.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
        { icon: 'fire-extinguisher', name: 'Fire code compliance', desc: 'Multi-unit residential triggers fire separation and egress review.', jurisdiction: 'city', time: 'Concurrent', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'clipboard-check', name: 'Construction inspections', desc: 'Request before 3 PM via IDT Plans portal. Wake County performs all field inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
        { icon: 'certificate', name: 'Certificate of occupancy (per unit)', desc: 'All fees including reinspection fees must be paid before CO issued.', jurisdiction: 'city', time: '3–5 days', url: 'https://wakeforest.idtplans.com/secure/', warn: false },
      ]},
    ],
  },
}

WAKE_FOREST_PERMIT_DATA.reno = WAKE_FOREST_PERMIT_DATA.addition

export const WAKE_FOREST_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires licensed GC for projects $40,000+. GC must provide Mechanics Lien Agent info at permit application — must be posted on job site.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical work requires NC licensed electrical contractor. Submit trade permit through IDT Plans portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing work requires NC licensed plumbing contractor. Submit trade permit through IDT Plans portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Mechanical systems require NC licensed mechanical contractor. Submit trade permit through IDT Plans portal.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Site plan drawn to scale required. Must show impervious surface calculations and all distances to property lines.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required for IDT Plans submission. Plans must include braced wall locations and construction details.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for engineered products (trusses, beams). All truss drawings must be sealed by appropriate engineer.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites with fill, slope, or watershed protection areas common in Wake Forest.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000. Lien agent required.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit required.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for IDT Plans submission.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required. Lien agent required.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex elevated decks benefit from professional drawings.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires licensed specialty contractor for in-ground pools.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting.' },
    { level: 'optional', name: 'Fence / barrier installer', why: 'NC code requires approved pool barrier.' },
  ],
  shed: [{ level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' }],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit requires NC licensed GC. Lien agent required and must be posted on job site.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit. Trade permit via IDT Plans.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit. Trade permit via IDT Plans.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit. Trade permit via IDT Plans.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required for fire separation and egress compliance.' },
    { level: 'required', name: 'Structural engineer', why: 'All engineered products require sealed drawings.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required.' },
  ],
}
WAKE_FOREST_PROFESSIONALS.addition = WAKE_FOREST_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000. Lien agent required.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Trade permit required if scope includes electrical.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Trade permit required if scope includes plumbing.' },
  { level: 'optional', name: 'Designer or architect', why: 'Drawings required for IDT Plans submission.' },
]

export const WAKE_FOREST_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing — after complete, before insulation', 'Rough-in — electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const WAKE_FOREST_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Wake Forest jurisdiction confirmed', desc: 'All permits through Wake Forest Inspections Department via IDT Plans portal. Inspections performed by Wake County.' },
  { ok: true, title: 'Wake County inspection district', desc: 'Wake County performs all field inspections. Request before 3 PM via IDT Plans portal for next business day. Call (919) 435-9531 at 8:30 AM for inspector ETA.' },
  { ok: true, title: 'IDT Plans portal required', desc: 'All permit applications must be submitted through IDT Plans at wakeforest.idtplans.com. Once zoning approves, contact office to purchase permit.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district — flagged by you' : 'No historic district reported', desc: flags.historic ? 'Wake Forest Historic District review required before building permit. Contact Planning at (919) 435-9400.' : 'You indicated no historic district. Verify with Wake Forest Planning before submitting.', verifyUrl: 'https://www.wakeforestnc.gov/planning', verifyLabel: 'Verify with Wake Forest Planning' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic — Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Wake Forest accepts permit application.' : 'Confirm water and sewer availability with Wake Forest Public Works before applying.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages per Wake Forest UDO.' : 'Confirm setbacks for your zoning district in Wake Forest UDO before finalizing plans.' },
]
