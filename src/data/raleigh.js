export const PROJECT_TYPES = [
  { id: 'sfh',       label: 'New single-family home', sub: 'Ground-up build' },
  { id: 'adu',       label: 'Accessory dwelling unit', sub: 'Attached or detached' },
  { id: 'addition',  label: 'Addition or expansion', sub: 'Room, garage, story' },
  { id: 'deck',      label: 'Deck or porch', sub: 'Attached to home' },
  { id: 'reno',      label: 'Major renovation', sub: 'Structural / MEP' },
  { id: 'pool',      label: 'Pool or spa', sub: 'In-ground or above' },
  { id: 'shed',      label: 'Shed or garage', sub: 'Detached structure' },
  { id: 'townhouse', label: 'Townhouse or duplex', sub: 'Multi-unit residential' },
]

export const PERMIT_DATA = {
  sfh: {
    count: 11, timeline: '3–5 months', fees: '$8,000–$18,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { icon: 'map', name: 'Lot survey & recorded plat', desc: 'Sealed plot plan required. File with Wake County Register of Deeds before submission.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wake.gov' },
          { icon: 'map-pin', name: 'Address assignment', desc: 'Contact Raleigh GIS Addressing before any permit application.', jurisdiction: 'city', time: '1–3 days', url: 'https://raleighnc.gov/permits' },
        ]
      },
      {
        label: 'Phase 1 - site & zoning',
        permits: [
          { icon: 'building', name: 'Zoning permit', desc: 'Confirms compliance with Raleigh UDO and zoning classification.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
          { icon: 'layers', name: 'Site / grading permit', desc: 'Required for grading, drainage, and stormwater management.', jurisdiction: 'city', time: '10–15 days', url: 'https://raleighnc.gov/permits' },
        ]
      },
      {
        label: 'Phase 2 - building permits',
        permits: [
          { icon: 'home', name: 'Residential building permit', desc: 'Core structural permit. Full NC Building Code plan review.', jurisdiction: 'city', time: '15–30 days', url: 'https://permitportal.raleighnc.gov' },
          { icon: 'bolt', name: 'Electrical permit', desc: 'All electrical systems. Submitted with building permit.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'All plumbing rough-in and finish work.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
          { icon: 'wind', name: 'Mechanical / HVAC permit', desc: 'All heating, ventilation, and air conditioning systems.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
        ]
      },
      {
        label: 'Phase 3 - connections',
        permits: [
          { icon: 'droplets', name: 'Water & sewer connection', desc: 'Email water.review@raleighnc.gov to confirm availability first.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
          { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required by NC law for projects over $40,000. File at liensnc.com before work begins.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com' },
        ]
      },
      {
        label: 'Phase 4 - inspections & close-out',
        permits: [
          { icon: 'clipboard-check', name: 'Construction inspections', desc: 'Foundation, framing, rough-in, insulation, final - all through Wake County.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.wake.gov' },
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Issued after all inspections pass. Required before occupancy.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
        ]
      },
    ]
  },
  adu: {
    count: 5, timeline: '6–10 weeks', fees: '$2,000–$6,000',
    phases: [
      { label: 'Pre-application', permits: [
        { icon: 'zoom-check', name: 'Zoning eligibility check', desc: 'Confirm lot qualifies for ADU under Raleigh UDO.', jurisdiction: 'city', time: '1–3 days', url: 'https://raleighnc.gov/permits' },
      ]},
      { label: 'Permits', permits: [
        { icon: 'home', name: 'Residential building permit', desc: 'Detached ADUs treated as single-family. Full plan review.', jurisdiction: 'city', time: '15–30 days', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Required for all ADU electrical systems.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'Required if ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required before ADU can be rented or occupied.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
      ]},
    ]
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$1,200',
    phases: [
      { label: 'Permits', permits: [
        { icon: 'tools', name: 'Residential permit - deck / porch', desc: 'Submit via email to downtownDS@raleighnc.gov.', jurisdiction: 'city', time: '10–15 days', url: 'https://raleighnc.gov/permits' },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Required only if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
      ]},
    ]
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [
      { label: 'Permits', permits: [
        { icon: 'ripple', name: 'Swimming pool / spa permit', desc: 'Required for all in-ground and above-ground pools over 24".', jurisdiction: 'city', time: '10–20 days', url: 'https://raleighnc.gov/permits' },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Required for pool pump, lighting, and bonding.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'barrier-block', name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier around all pools.', jurisdiction: 'city', time: 'Concurrent', url: 'https://raleighnc.gov/permits' },
      ]},
    ]
  },
  shed: {
    count: 1, timeline: '1–2 weeks', fees: '$100–$400',
    phases: [
      { label: 'Permits', permits: [
        { icon: 'home-2', name: 'Accessory structure permit', desc: 'Required for structures over 144 sq ft or 12 ft tall.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
      ]},
    ]
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      { label: 'Permits', permits: [
        { icon: 'layout-sidebar-right-expand', name: 'Residential building permit', desc: 'Required for structural changes to load-bearing elements.', jurisdiction: 'city', time: '15–30 days', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'bolt', name: 'Electrical permit', desc: 'If scope includes electrical modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If scope includes plumbing modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
      ]},
    ]
  },
  townhouse: {
    count: 13, timeline: '4–6 months', fees: '$12,000–$25,000',
    phases: [
      { label: 'Before you apply', permits: [
        { icon: 'map', name: 'Lot survey & recorded plat', desc: 'Sealed plot plan required before any permit submission.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wake.gov' },
      ]},
      { label: 'Phase 1 - site & zoning', permits: [
        { icon: 'building-community', name: 'Zoning permit', desc: 'May require Board of Adjustment approval for multi-unit.', jurisdiction: 'city', time: '10–20 days', url: 'https://raleighnc.gov/permits' },
        { icon: 'layers', name: 'Site / grading permit', desc: 'Required for all grading, drainage, and stormwater.', jurisdiction: 'city', time: '10–15 days', url: 'https://raleighnc.gov/permits' },
      ]},
      { label: 'Phase 2 - building permits', permits: [
        { icon: 'home', name: 'Residential building permit (per unit)', desc: 'Each unit may require separate permit.', jurisdiction: 'city', time: '15–30 days', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Per unit.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'Per unit.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
        { icon: 'wind', name: 'Mechanical / HVAC permit', desc: 'Per unit.', jurisdiction: 'city', time: 'Concurrent', url: 'https://permitportal.raleighnc.gov' },
      ]},
      { label: 'Phase 3 - connections & compliance', permits: [
        { icon: 'droplets', name: 'Water & sewer connection', desc: 'Per unit or shared main - confirm with Raleigh Water.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
        { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required - townhouse projects always exceed $40,000.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com' },
        { icon: 'fire-extinguisher', name: 'Fire code compliance review', desc: 'Multi-unit triggers fire separation and egress review.', jurisdiction: 'city', time: 'Concurrent', url: 'https://raleighnc.gov/permits' },
      ]},
      { label: 'Phase 4 - completion', permits: [
        { icon: 'clipboard-check', name: 'Construction inspections', desc: 'All stages through Wake County.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.wake.gov' },
        { icon: 'certificate', name: 'Certificate of occupancy (per unit)', desc: 'Issued per unit after all inspections pass.', jurisdiction: 'city', time: '5–10 days', url: 'https://raleighnc.gov/permits' },
      ]},
    ]
  },
}

PERMIT_DATA.reno = PERMIT_DATA.addition

export const PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires a licensed GC for projects $40,000+. Coordinates all trades and is legally responsible for code compliance.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical work requires a NC licensed electrical contractor.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing work requires a NC licensed plumbing contractor.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Mechanical systems require a NC licensed mechanical contractor.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required before permit submission.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required. Not legally required to be licensed for SFH in NC but strongly recommended.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for unconventional spans, retaining walls, or complex structural elements.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Soil bearing capacity report recommended for new construction on fill or sloped sites.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000. NC law requires licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Required for electrical permit on any ADU.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom plumbing.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for permit submission.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required. Below that, homeowner may self-contract in NC.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex elevated or covered structures benefit from professional drawings.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires a licensed specialty contractor for in-ground pool installation.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting require a licensed electrical contractor.' },
    { level: 'optional', name: 'Fence / barrier installer', why: 'NC code requires an approved pool barrier.' },
  ],
  shed: [
    { level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' },
  ],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit residential requires NC licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit electrical systems.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit plumbing.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit mechanical systems.' },
    { level: 'required', name: 'Licensed architect', why: 'Fire separation, egress, and accessibility compliance requires architect-stamped drawings.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required before permit submission.' },
  ],
}

PROFESSIONALS.addition = PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project cost exceeds $40,000.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Required if scope includes electrical modifications.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Required if scope includes plumbing modifications.' },
  { level: 'optional', name: 'Designer or architect', why: 'Complex structural additions benefit from professional drawings.' },
]

export const INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing - after complete, before insulation', 'Rough-in - electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}
