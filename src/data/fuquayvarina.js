// Fuquay-Varina, NC - Permit Intelligence
// Jurisdiction: Town of Fuquay-Varina
// County: Wake County
// Portal: CSS Portal (same system as Morrisville)
// Inspections: Wake County (same as Raleigh, Apex, Holly Springs)
// Fast-growing town south of Raleigh — significant residential construction activity

export const FUQUAY_VARINA_META = {
  city: 'Fuquay-Varina',
  county: 'Wake County',
  state: 'NC',
  portals: {
    main: 'https://www.fuquay-varina.org/299/Permits-Inspections',
    inspections: 'https://www.fuquay-varina.org/299/Permits-Inspections',
  },
  contacts: {
    main: '(919) 552-1429',
    address: '401 Old Honeycutt Rd, Fuquay-Varina, NC 27526',
    hours: 'Mon-Fri 8:00 AM - 5:00 PM',
  },
  notes: [
    'Fuquay-Varina uses an online CSS-based portal for permit applications',
    'Wake County performs all field inspections',
    'One of the fastest-growing towns in Wake County - expect high permit volume and review times',
    'Lien agent required for all projects $40,000 or more',
    'Water and sewer availability must be confirmed with Public Works before applying',
  ],
}

export const FUQUAY_VARINA_PERMIT_DATA = {
  sfh: {
    count: 10, timeline: '3-5 months', fees: '$7,000-$15,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { name: 'Lot survey & site plan', desc: 'Sealed site plan required showing building footprint, setbacks, driveway, and impervious surface calculations.', jurisdiction: 'county', time: '1-2 wks', url: 'https://www.wake.gov/departments-government/register-deeds', warn: false },
          { name: 'Lien agent appointment', desc: 'Required for all projects $40,000+. File at liensnc.com before work begins. Post certificate on job site.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: true },
        ],
      },
      {
        label: 'Phase 1 - zoning',
        permits: [
          { name: 'Zoning compliance permit', desc: 'Required before building permit. Confirms project complies with Fuquay-Varina UDO. Submit through town permit portal.', jurisdiction: 'city', time: '5-10 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        ],
      },
      {
        label: 'Phase 2 - building & trade permits',
        permits: [
          { name: 'Residential building permit', desc: 'Apply through town permit portal. Full NC Residential Code plan review required. Submit architectural drawings, floor plans, and energy compliance docs.', jurisdiction: 'city', time: '10-15 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
          { name: 'Electrical permit', desc: 'Apply through town permit portal. NC licensed electrical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
          { name: 'Plumbing permit', desc: 'Apply through town permit portal. NC licensed plumbing contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
          { name: 'Mechanical / HVAC permit', desc: 'Apply through town permit portal. NC licensed mechanical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        ],
      },
      {
        label: 'Phase 3 - utilities',
        permits: [
          { name: 'Water & sewer connection', desc: 'Contact Fuquay-Varina Public Works for utility availability before applying. Tap fees due at permit issuance.', jurisdiction: 'city', time: '5-10 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        ],
      },
      {
        label: 'Phase 4 - inspections & close-out',
        permits: [
          { name: 'Construction inspections', desc: 'Wake County performs all field inspections. Schedule through town permit portal. Request before 3 PM for next business day.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
          { name: 'Certificate of occupancy', desc: 'All fees paid and all inspections passed before CO issued.', jurisdiction: 'city', time: '3-5 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        ],
      },
    ],
  },
  adu: {
    count: 4, timeline: '6-10 weeks', fees: '$2,000-$5,500',
    phases: [
      { label: 'Pre-application', permits: [
        { name: 'Zoning eligibility check', desc: 'Confirm lot qualifies for ADU under Fuquay-Varina UDO.', jurisdiction: 'city', time: '1-3 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
      { label: 'Permits', permits: [
        { name: 'Residential building permit', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: '10-15 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Electrical permit', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Plumbing permit', desc: 'If ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
      { label: 'Completion', permits: [
        { name: 'Certificate of occupancy', desc: 'Required before ADU can be occupied.', jurisdiction: 'city', time: '3-5 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
    ],
  },
  deck: {
    count: 2, timeline: '2-4 weeks', fees: '$300-$900',
    phases: [{ label: 'Permits', permits: [
      { name: 'Residential building permit - deck', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: '5-10 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      { name: 'Electrical permit', desc: 'Required if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
    ]}],
  },
  pool: {
    count: 3, timeline: '3-6 weeks', fees: '$500-$2,000',
    phases: [{ label: 'Permits', permits: [
      { name: 'Swimming pool / spa permit', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: '5-10 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      { name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      { name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
    ]}],
  },
  shed: {
    count: 1, timeline: '1-2 weeks', fees: '$100-$400',
    phases: [{ label: 'Permits', permits: [
      { name: 'Accessory structure permit', desc: 'Required for structures over 12 feet in any dimension or 144 sq ft.', jurisdiction: 'city', time: '3-5 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
    ]}],
  },
  addition: {
    count: 4, timeline: '4-8 weeks', fees: '$1,500-$5,000',
    phases: [
      { label: 'Permits', permits: [
        { name: 'Residential building permit', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: '10-15 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Electrical permit', desc: 'If scope includes electrical.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Plumbing permit', desc: 'If scope includes plumbing.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
      { label: 'Completion', permits: [
        { name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3-5 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
    ],
  },
  townhouse: {
    count: 11, timeline: '4-6 months', fees: '$9,000-$20,000',
    phases: [
      { label: 'Before you apply', permits: [
        { name: 'Lot survey & site plan', desc: 'Sealed survey required.', jurisdiction: 'county', time: '1-2 wks', url: 'https://www.wake.gov', warn: false },
        { name: 'Zoning compliance permit', desc: 'Multi-unit requires full zoning review. May require Board of Adjustment approval.', jurisdiction: 'city', time: '10-20 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
      { label: 'Building permits', permits: [
        { name: 'Residential building permit (per unit)', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: '10-15 working days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Electrical permit (per unit)', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Plumbing permit (per unit)', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Mechanical / HVAC permit (per unit)', desc: 'Apply through town permit portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
      { label: 'Compliance', permits: [
        { name: 'Lien agent appointment', desc: 'Required - always exceeds $40,000.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: true },
        { name: 'Fire code compliance', desc: 'Multi-unit triggers fire separation and egress review.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
      { label: 'Completion', permits: [
        { name: 'Construction inspections', desc: 'Wake County performs all field inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
        { name: 'Certificate of occupancy (per unit)', desc: 'All fees paid before CO issued.', jurisdiction: 'city', time: '3-5 days', url: 'https://www.fuquay-varina.org/299/Permits-Inspections', warn: false },
      ]},
    ],
  },
}

FUQUAY_VARINA_PERMIT_DATA.reno = FUQUAY_VARINA_PERMIT_DATA.addition

export const FUQUAY_VARINA_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires licensed GC for projects $40,000+. Lien agent required before permits issued.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit required through town portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'Trade permit required through town portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Trade permit required through town portal.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required for permit submission.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required. Fuquay-Varina is high volume - complete submissions avoid correction delays.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for engineered products. Stamped drawings required.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit required.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'Required if project exceeds $40,000.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires licensed specialty contractor for in-ground pools.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting.' },
  ],
  shed: [{ level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' }],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit requires NC licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required for fire separation.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required.' },
  ],
}
FUQUAY_VARINA_PROFESSIONALS.addition = FUQUAY_VARINA_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Trade permit required if electrical scope.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Trade permit required if plumbing scope.' },
]

export const FUQUAY_VARINA_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing - after complete, before insulation', 'Rough-in - electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const FUQUAY_VARINA_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Fuquay-Varina jurisdiction confirmed', desc: 'All permits through Fuquay-Varina Inspections. Wake County performs all field inspections.' },
  { ok: true, title: 'Wake County inspection district', desc: 'Wake County performs all field inspections. Schedule through town permit portal.' },
  { ok: true, title: 'High growth area - plan for longer review times', desc: 'Fuquay-Varina is one of the fastest-growing towns in Wake County. Submit complete drawings on the first try to avoid delays from correction cycles.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district - flagged by you' : 'No historic district reported', desc: flags.historic ? 'Contact Fuquay-Varina Planning at (919) 552-1429 for historic district requirements.' : 'You indicated no historic district. Verify with Fuquay-Varina Planning before submitting.', verifyUrl: 'https://www.fuquay-varina.org', verifyLabel: 'Verify with Fuquay-Varina Planning' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic - Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Fuquay-Varina accepts permit application.' : 'Confirm utility availability with Fuquay-Varina Public Works before applying.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot - dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages per Fuquay-Varina UDO.' : 'Confirm setbacks for your zoning district before finalizing plans.' },
]
