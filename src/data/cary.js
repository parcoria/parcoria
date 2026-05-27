// Cary, NC - Permit Intelligence
// Jurisdiction: Town of Cary
// County: Wake County
// Portal: Cary Online Permits (coap.townofcary.org) - own system, not IDT or CSS
// Inspections: Wake County (same as Raleigh, Apex, Holly Springs)
// Note: Cary is the largest municipality in Wake County. Very active ADU and renovation market.
// Cary has its own well-developed online permit system.

export const CARY_META = {
  city: 'Cary',
  county: 'Wake County',
  state: 'NC',
  portals: {
    main: 'https://coap.townofcary.org',
    planning: 'https://www.townofcary.org/services-equipment/permits-inspections',
    inspections: 'https://coap.townofcary.org',
  },
  contacts: {
    main: '(919) 469-4340',
    email: 'permits@townofcary.org',
    address: '316 N Academy St, Cary, NC 27513',
    hours: 'Mon-Fri 8:00 AM - 5:00 PM',
  },
  notes: [
    'Cary uses its own online permit portal at coap.townofcary.org - not IDT Plans or CSS',
    'All applications, plan review, fee payments, and inspection scheduling through coap.townofcary.org',
    'Wake County performs all field inspections',
    'Cary requires a Site Plan Review for most new construction projects',
    'Lien agent required for all projects $40,000 or more',
    'Cary is the largest Wake County municipality - high volume means plan accordingly',
    'Cary has strong ADU ordinance - relatively straightforward ADU permitting',
  ],
}

export const CARY_PERMIT_DATA = {
  sfh: {
    count: 11, timeline: '3-5 months', fees: '$8,000-$16,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { name: 'Lot survey & site plan', desc: 'Sealed survey and site plan required. Cary requires a Site Plan Review before building permits are issued for new construction.', jurisdiction: 'county', time: '1-2 wks', url: 'https://www.wake.gov/departments-government/register-deeds', warn: false },
          { name: 'Lien agent appointment', desc: 'Required for all projects $40,000+. File at liensnc.com before work begins.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: true },
        ],
      },
      {
        label: 'Phase 1 - site plan review',
        permits: [
          { name: 'Site Plan Review', desc: 'Required for most new construction in Cary. Submit through coap.townofcary.org. Planning, Engineering, and Inspections all review simultaneously. Cary has a thorough site plan review process - allow extra time.', jurisdiction: 'city', time: '10-20 days', url: 'https://coap.townofcary.org', warn: false },
          { name: 'Zoning compliance permit', desc: 'Confirms compliance with Cary Land Development Ordinance. Issued after site plan review approval.', jurisdiction: 'city', time: '5-10 days', url: 'https://coap.townofcary.org', warn: false },
        ],
      },
      {
        label: 'Phase 2 - building & trade permits',
        permits: [
          { name: 'Residential building permit', desc: 'Apply through coap.townofcary.org after site plan and zoning approval. Full NC Residential Code plan review. Upload all drawings directly through the portal.', jurisdiction: 'city', time: '10-15 working days', url: 'https://coap.townofcary.org', warn: false },
          { name: 'Electrical permit', desc: 'Apply through coap.townofcary.org. NC licensed electrical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
          { name: 'Plumbing permit', desc: 'Apply through coap.townofcary.org. NC licensed plumbing contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
          { name: 'Mechanical / HVAC permit', desc: 'Apply through coap.townofcary.org. NC licensed mechanical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
        ],
      },
      {
        label: 'Phase 3 - utilities',
        permits: [
          { name: 'Water & sewer connection', desc: 'Contact Cary Public Works for utility availability. Tap fees due at permit issuance. Cary serves most of its territory with town water and sewer.', jurisdiction: 'city', time: '5-10 days', url: 'https://www.townofcary.org', warn: false },
        ],
      },
      {
        label: 'Phase 4 - inspections & close-out',
        permits: [
          { name: 'Construction inspections', desc: 'Schedule all inspections through coap.townofcary.org. Wake County performs all field inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://coap.townofcary.org', warn: false },
          { name: 'Certificate of occupancy', desc: 'All fees paid and all inspections passed before CO issued.', jurisdiction: 'city', time: '3-5 days', url: 'https://coap.townofcary.org', warn: false },
        ],
      },
    ],
  },
  adu: {
    count: 4, timeline: '6-10 weeks', fees: '$2,000-$5,500',
    phases: [
      { label: 'Pre-application', permits: [
        { name: 'Zoning eligibility check', desc: 'Cary has a strong ADU ordinance. Confirm lot qualifies and review ADU standards in Cary Land Development Ordinance.', jurisdiction: 'city', time: '1-3 days', url: 'https://www.townofcary.org/services-equipment/permits-inspections', warn: false },
      ]},
      { label: 'Permits (coap.townofcary.org)', permits: [
        { name: 'Residential building permit', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: '10-15 working days', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Electrical permit', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Plumbing permit', desc: 'If ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
      ]},
      { label: 'Completion', permits: [
        { name: 'Certificate of occupancy', desc: 'Required before ADU can be occupied.', jurisdiction: 'city', time: '3-5 days', url: 'https://coap.townofcary.org', warn: false },
      ]},
    ],
  },
  deck: {
    count: 2, timeline: '2-4 weeks', fees: '$300-$900',
    phases: [{ label: 'Permits (coap.townofcary.org)', permits: [
      { name: 'Residential building permit - deck', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: '5-10 working days', url: 'https://coap.townofcary.org', warn: false },
      { name: 'Electrical permit', desc: 'Required if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
    ]}],
  },
  pool: {
    count: 3, timeline: '3-6 weeks', fees: '$500-$2,000',
    phases: [{ label: 'Permits (coap.townofcary.org)', permits: [
      { name: 'Swimming pool / spa permit', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: '5-10 working days', url: 'https://coap.townofcary.org', warn: false },
      { name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
      { name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
    ]}],
  },
  shed: {
    count: 1, timeline: '1-2 weeks', fees: '$100-$400',
    phases: [{ label: 'Permits', permits: [
      { name: 'Accessory structure permit', desc: 'Required for structures over 12 feet in any dimension or 144 sq ft. Apply through coap.townofcary.org.', jurisdiction: 'city', time: '3-5 working days', url: 'https://coap.townofcary.org', warn: false },
    ]}],
  },
  addition: {
    count: 5, timeline: '4-8 weeks', fees: '$1,500-$5,500',
    phases: [
      { label: 'Pre-application', permits: [
        { name: 'Site plan review (if required)', desc: 'Additions that increase impervious surface or change the building footprint may trigger site plan review. Contact Cary Planning to determine if required.', jurisdiction: 'city', time: '5-10 days', url: 'https://coap.townofcary.org', warn: false },
      ]},
      { label: 'Permits (coap.townofcary.org)', permits: [
        { name: 'Residential building permit', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: '10-15 working days', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Electrical permit', desc: 'If scope includes electrical.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Plumbing permit', desc: 'If scope includes plumbing.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
      ]},
      { label: 'Completion', permits: [
        { name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3-5 days', url: 'https://coap.townofcary.org', warn: false },
      ]},
    ],
  },
  townhouse: {
    count: 12, timeline: '4-6 months', fees: '$10,000-$22,000',
    phases: [
      { label: 'Before you apply', permits: [
        { name: 'Lot survey & site plan', desc: 'Sealed survey required.', jurisdiction: 'county', time: '1-2 wks', url: 'https://www.wake.gov', warn: false },
        { name: 'Site Plan Review', desc: 'Required for all multi-unit residential in Cary. Submit through coap.townofcary.org. Allow 3-4 weeks for Cary site plan review.', jurisdiction: 'city', time: '15-25 days', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Zoning compliance permit', desc: 'Issued after site plan review approval.', jurisdiction: 'city', time: '5-10 days', url: 'https://coap.townofcary.org', warn: false },
      ]},
      { label: 'Building permits', permits: [
        { name: 'Residential building permit (per unit)', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: '10-15 working days', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Electrical permit (per unit)', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Plumbing permit (per unit)', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Mechanical / HVAC permit (per unit)', desc: 'Apply through coap.townofcary.org.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
      ]},
      { label: 'Compliance', permits: [
        { name: 'Lien agent appointment', desc: 'Required - always exceeds $40,000.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: true },
        { name: 'Fire code compliance', desc: 'Multi-unit triggers fire separation and egress review.', jurisdiction: 'city', time: 'Concurrent', url: 'https://coap.townofcary.org', warn: false },
      ]},
      { label: 'Completion', permits: [
        { name: 'Construction inspections', desc: 'Schedule through coap.townofcary.org. Wake County performs all field inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://coap.townofcary.org', warn: false },
        { name: 'Certificate of occupancy (per unit)', desc: 'All fees paid before CO issued.', jurisdiction: 'city', time: '3-5 days', url: 'https://coap.townofcary.org', warn: false },
      ]},
    ],
  },
}

CARY_PERMIT_DATA.reno = CARY_PERMIT_DATA.addition

export const CARY_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires licensed GC for projects $40,000+. Lien agent required before permits issued.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit required through coap.townofcary.org.' },
    { level: 'required', name: 'Licensed plumber', why: 'Trade permit required through coap.townofcary.org.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Trade permit required through coap.townofcary.org.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required for Site Plan Review and permit submission.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Cary Site Plan Review requires complete drawings. Cary reviewers are thorough - experienced designers avoid correction cycles.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for engineered products. Stamped drawings required.' },
    { level: 'optional', name: 'Land use attorney', why: 'Cary Land Development Ordinance is complex. For non-standard projects, legal review of zoning compliance is recommended.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit through coap.townofcary.org.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for permit submission.' },
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
    { level: 'required', name: 'Licensed electrician', why: 'Per unit. coap.townofcary.org.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit. coap.townofcary.org.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit. coap.townofcary.org.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required for fire separation and Cary Site Plan Review.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required for Site Plan Review.' },
  ],
}
CARY_PROFESSIONALS.addition = CARY_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Trade permit via coap.townofcary.org.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Trade permit via coap.townofcary.org.' },
  { level: 'optional', name: 'Architect or designer', why: 'Drawings required for permit submission. Site plan review may be triggered.' },
]

export const CARY_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing - after complete, before insulation', 'Rough-in - electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const CARY_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Cary jurisdiction confirmed', desc: 'All permits through coap.townofcary.org. Cary has its own portal - not IDT Plans or CSS Portal.' },
  { ok: true, title: 'Wake County inspection district', desc: 'Wake County performs all field inspections. Schedule through coap.townofcary.org.' },
  { ok: true, title: 'Cary Site Plan Review required for new construction', desc: 'Most new construction in Cary requires a Site Plan Review before building permits are issued. Allow 15-25 business days for this step. Submit complete drawings on the first try.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district - flagged by you' : 'No historic district reported', desc: flags.historic ? 'Contact Cary Planning at (919) 469-4340 for historic district requirements.' : 'You indicated no historic district. Verify with Cary Planning before submitting.', verifyUrl: 'https://www.townofcary.org/services-equipment/permits-inspections', verifyLabel: 'Verify with Cary Planning' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic - Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Cary accepts permit application.' : 'Cary serves most of its territory with town water and sewer. Confirm availability before applying.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot - dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages per Cary Land Development Ordinance.' : 'Confirm setbacks for your zoning district in Cary LDO before finalizing plans.' },
]
