// Morrisville, NC — Permit Intelligence
// Jurisdiction: Town of Morrisville
// County: Wake County
// Portal: CSS Portal (Customer Self Service) — morrisvillenc.gov e-Permits
// Inspections: Wake County (same as Raleigh, Apex, Holly Springs)
// Key note: No phone inspection requests — online portal only

export const MORRISVILLE_META = {
  city: 'Morrisville',
  county: 'Wake County',
  state: 'NC',
  portals: {
    main: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications',
    inspections: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications',
    planning: 'https://www.morrisvillenc.gov/government/departments-services/planning/permits-and-applications',
  },
  contacts: {
    main: '(919) 463-6200',
    address: '100 Town Hall Drive, Morrisville, NC 27560',
    hours: 'Mon–Fri 8:00 AM – 5:00 PM',
  },
  notes: [
    'Morrisville uses CSS (Customer Self Service) Portal for all permits and inspections',
    'No phone inspection requests accepted — all inspections scheduled through online portal',
    'Wake County performs all field inspections — same as Raleigh, Apex, Holly Springs',
    'Projects $40,000+ require licensed NC General Contractor and lien agent',
    'Owner-builders may act as own GC for home they own and will personally occupy',
    'Review Combined Site & Construction Plan Informational Packet before submitting',
  ],
}

export const MORRISVILLE_PERMIT_DATA = {
  sfh: {
    count: 10, timeline: '3–5 months', fees: '$7,000–$15,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { icon: 'map', name: 'Lot survey & site plan', desc: 'Site plan required per Combined Site & Construction Plan Informational Packet. Review packet at morrisvillenc.gov before submitting.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        ],
      },
      {
        label: 'Phase 1 — zoning',
        permits: [
          { icon: 'building-community', name: 'Zoning compliance permit', desc: 'Required before building permit. Confirms compliance with Morrisville UDO. Submit through CSS Portal.', jurisdiction: 'city', time: '5–10 days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        ],
      },
      {
        label: 'Phase 2 — building permits (CSS Portal)',
        permits: [
          { icon: 'home', name: 'Residential building permit', desc: 'Apply through CSS Portal. View permit status, plan review status, and pay fees through same portal. NC Building Code plan review required.', jurisdiction: 'city', time: '5–15 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Apply through CSS Portal. NC licensed electrical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'Apply through CSS Portal. NC licensed plumbing contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
          { icon: 'wind', name: 'Mechanical / HVAC permit', desc: 'Apply through CSS Portal. Required for all heating, AC, and venting systems.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        ],
      },
      {
        label: 'Phase 3 — compliance',
        permits: [
          { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required for projects $40,000+. File at liensnc.com before work begins.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
          { icon: 'droplets', name: 'Water & sewer connection', desc: 'Contact Morrisville Public Works for utility availability before applying.', jurisdiction: 'city', time: '5–10 days', url: 'https://www.morrisvillenc.gov', warn: false },
        ],
      },
      {
        label: 'Phase 4 — inspections & close-out',
        permits: [
          { icon: 'clipboard-check', name: 'Construction inspections', desc: 'All inspections scheduled through CSS Portal — no phone requests accepted. Wake County performs all field inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Issued after all final inspections pass. All fees must be paid through CSS Portal before CO issued.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        ],
      },
    ],
  },
  adu: {
    count: 4, timeline: '6–10 weeks', fees: '$2,000–$5,500',
    phases: [
      { label: 'Pre-application', permits: [
        { icon: 'zoom-check', name: 'Zoning eligibility check', desc: 'Confirm lot qualifies for ADU under Morrisville UDO.', jurisdiction: 'city', time: '1–3 days', url: 'https://www.morrisvillenc.gov/government/departments-services/planning', warn: false },
      ]},
      { label: 'Permits (CSS Portal)', permits: [
        { icon: 'home', name: 'Residential building permit', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: '5–15 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required before ADU can be rented or occupied.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
    ],
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$900',
    phases: [{ label: 'Permits (CSS Portal)', permits: [
      { icon: 'tools', name: 'Residential building permit — deck / porch', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: '5–10 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      { icon: 'bolt', name: 'Electrical permit', desc: 'Required if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
    ]}],
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [{ label: 'Permits (CSS Portal)', permits: [
      { icon: 'ripple', name: 'Swimming pool / spa permit', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: '5–10 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      { icon: 'bolt', name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      { icon: 'barrier-block', name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
    ]}],
  },
  shed: {
    count: 1, timeline: '1–2 weeks', fees: '$100–$400',
    phases: [{ label: 'Permits', permits: [
      { icon: 'home-2', name: 'Accessory structure permit', desc: 'Required for structures over 12 feet in any dimension or 144 sq ft.', jurisdiction: 'city', time: '3–5 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
    ]}],
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      { label: 'Permits (CSS Portal)', permits: [
        { icon: 'layout-sidebar-right-expand', name: 'Residential building permit', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: '5–15 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'bolt', name: 'Electrical permit', desc: 'If scope includes electrical modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If scope includes plumbing modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
    ],
  },
  townhouse: {
    count: 11, timeline: '4–6 months', fees: '$9,000–$20,000',
    phases: [
      { label: 'Before you apply', permits: [
        { icon: 'map', name: 'Lot survey & site plan', desc: 'Sealed survey required per Combined Site & Construction Plan packet.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wakegov.com', warn: false },
        { icon: 'building-community', name: 'Zoning compliance permit', desc: 'Multi-unit residential requires full zoning review.', jurisdiction: 'city', time: '10–20 days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
      { label: 'Building permits (CSS Portal)', permits: [
        { icon: 'home', name: 'Residential building permit (per unit)', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: '5–15 working days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'bolt', name: 'Electrical permit (per unit)', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'droplet', name: 'Plumbing permit (per unit)', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'wind', name: 'Mechanical / HVAC permit (per unit)', desc: 'Apply through CSS Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
      { label: 'Compliance', permits: [
        { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required — always exceeds $40,000.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
        { icon: 'fire-extinguisher', name: 'Fire code compliance', desc: 'Multi-unit triggers fire separation and egress review.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'clipboard-check', name: 'Construction inspections', desc: 'All inspections through CSS Portal — no phone requests. Wake County performs all field inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
        { icon: 'certificate', name: 'Certificate of occupancy (per unit)', desc: 'All fees paid through CSS Portal before CO issued.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', warn: false },
      ]},
    ],
  },
}
MORRISVILLE_PERMIT_DATA.reno = MORRISVILLE_PERMIT_DATA.addition

export const MORRISVILLE_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires licensed GC for projects $40,000+. Verify at nclbgc.org.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical requires NC licensed contractor. Apply trade permit through CSS Portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing requires NC licensed contractor. Apply trade permit through CSS Portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'All mechanical requires NC licensed contractor. Apply trade permit through CSS Portal.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Site plan required per Combined Site & Construction Plan Informational Packet.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required for CSS Portal submission.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for engineered products. Stamped drawings required.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites in Morrisville — significant development pressure on varied soil conditions.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit through CSS Portal.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for CSS Portal submission.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex decks benefit from professional drawings.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires licensed specialty contractor for in-ground pools.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting.' },
    { level: 'optional', name: 'Fence / barrier installer', why: 'NC code requires approved pool barrier.' },
  ],
  shed: [{ level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' }],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit requires NC licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit. CSS Portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit. CSS Portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit. CSS Portal.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan per Combined Site & Construction Plan packet.' },
  ],
}
MORRISVILLE_PROFESSIONALS.addition = MORRISVILLE_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Trade permit via CSS Portal.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Trade permit via CSS Portal.' },
  { level: 'optional', name: 'Designer or architect', why: 'Drawings required for CSS Portal submission.' },
]

export const MORRISVILLE_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing — after complete, before insulation', 'Rough-in — electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const MORRISVILLE_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Morrisville jurisdiction confirmed', desc: 'All permits through Morrisville Inspections via CSS Portal. No phone inspection requests — online only.' },
  { ok: true, title: 'Wake County inspection district', desc: 'Wake County performs all field inspections. All inspection requests through CSS Portal.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district — flagged by you' : 'No historic district reported', desc: flags.historic ? 'Contact Morrisville Planning at (919) 463-6200 for historic district requirements.' : 'You indicated no historic district. Verify with Morrisville Planning before submitting.', verifyUrl: 'https://www.morrisvillenc.gov/government/departments-services/planning', verifyLabel: 'Verify with Morrisville Planning' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic — Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Morrisville accepts permit application.' : 'Confirm utility availability with Morrisville Public Works before applying.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages per Morrisville UDO.' : 'Confirm setbacks for your zoning district in Morrisville UDO.' },
]
