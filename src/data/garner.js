// Garner, NC - Permit Intelligence
// Jurisdiction: Town of Garner
// County: Wake County
// Portal: SmartGov Permit & Inspection Portal (twn-garner-nc.smartgovcommunity.com)
// Inspections: Town of Garner (self - NOT Wake County like others)
// Key notes: No same-day inspections. No paper applications accepted. SmartGov portal only.

export const GARNER_META = {
  city: 'Garner',
  county: 'Wake County',
  state: 'NC',
  portals: {
    main: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home',
    inspections: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home',
  },
  contacts: {
    main: '(919) 773-4433',
    email: 'dss@garnernc.gov',
    address: '900 7th Ave, Garner, NC 27529',
    hours: 'Mon–Fri 8:15 AM – 4:45 PM (no new walk-ins after 4:30 PM)',
  },
  notes: [
    'Garner uses SmartGov Permit & Inspection Portal for ALL applications and inspections',
    'No paper applications or plan sets accepted - digital only through SmartGov',
    'Garner Inspections Department performs all inspections - NOT Wake County',
    'No same-day inspections - 24-hour notice required for ALL inspections',
    'Inspections occur between 7:30 AM – 4:00 PM. Office hours 8:15 AM – 4:45 PM',
    'Re-inspection fee applies if inspection fails - must be paid before next inspection',
    'Pre-application conference required for certain applications per Garner UDO Section 4.4.1',
    'Lien agent required for projects $40,000 or more',
    'SmartGov portal accepts credit cards, debit cards, and electronic checks online',
  ],
}

export const GARNER_PERMIT_DATA = {
  sfh: {
    count: 10, timeline: '3–5 months', fees: '$7,000–$15,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          { icon: 'map', name: 'Lot survey & site plan', desc: 'Sealed site plan required showing building footprint and distances to all property lines. File with Wake County Register of Deeds.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wake.gov/departments-government/register-deeds', warn: false },
          { icon: 'users', name: 'Pre-application conference (if required)', desc: 'Required per Garner UDO Section 4.4.1 for certain applications. Submit request and sketch plan via SmartGov Portal to schedule.', jurisdiction: 'city', time: '1–2 wks', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        ],
      },
      {
        label: 'Phase 1 - zoning',
        permits: [
          { icon: 'building-community', name: 'Zoning compliance permit', desc: 'Submit through SmartGov Portal. Planning, Engineering, and Inspections departments all review through same portal.', jurisdiction: 'city', time: '5–10 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
          { icon: 'layers', name: 'Land disturbance / grading permit', desc: 'Required for site work. Submit through SmartGov Portal.', jurisdiction: 'city', time: '5–10 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        ],
      },
      {
        label: 'Phase 2 - building permits (SmartGov)',
        permits: [
          { icon: 'home', name: 'Residential building permit', desc: 'Submit through SmartGov Portal. No paper applications accepted. All plan review, comments, and status updates through SmartGov.', jurisdiction: 'city', time: '5–15 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Submit through SmartGov Portal. NC licensed electrical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'Submit through SmartGov Portal. NC licensed plumbing contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
          { icon: 'wind', name: 'Mechanical / HVAC permit', desc: 'Submit through SmartGov Portal. NC licensed mechanical contractor required.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        ],
      },
      {
        label: 'Phase 3 - compliance',
        permits: [
          { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required for projects $40,000+. File at liensnc.com before work begins.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
          { icon: 'droplets', name: 'Water & sewer connection', desc: 'Contact Garner Public Works for utility availability confirmation.', jurisdiction: 'city', time: '5–10 days', url: 'https://www.garnernc.gov', warn: false },
        ],
      },
      {
        label: 'Phase 4 - inspections & close-out',
        permits: [
          { icon: 'clipboard-check', name: 'Construction inspections', desc: 'Schedule through SmartGov Portal - no phone or email requests. 24-hour notice required for ALL inspections. No same-day inspections. Re-inspection fee applies if inspection fails.', jurisdiction: 'city', time: 'Throughout', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Request CO through SmartGov Portal. All outstanding fees must be paid before CO issued.', jurisdiction: 'city', time: '3–5 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        ],
      },
    ],
  },
  adu: {
    count: 4, timeline: '6–10 weeks', fees: '$2,000–$5,500',
    phases: [
      { label: 'Pre-application', permits: [
        { icon: 'zoom-check', name: 'Zoning eligibility check', desc: 'Confirm lot qualifies for ADU under Garner UDO. Contact Planning at dss@garnernc.gov.', jurisdiction: 'city', time: '1–3 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
      { label: 'Permits (SmartGov)', permits: [
        { icon: 'home', name: 'Residential building permit', desc: 'Submit through SmartGov Portal. No paper applications.', jurisdiction: 'city', time: '5–15 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'bolt', name: 'Electrical permit', desc: 'Submit through SmartGov Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If ADU includes kitchen or bathroom.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required before ADU can be rented or occupied.', jurisdiction: 'city', time: '3–5 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
    ],
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$900',
    phases: [{ label: 'Permits (SmartGov)', permits: [
      { icon: 'tools', name: 'Residential building permit - deck / porch', desc: 'Submit through SmartGov Portal. Required for structures exceeding 12 feet in any dimension or 144 sq ft.', jurisdiction: 'city', time: '5–10 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      { icon: 'bolt', name: 'Electrical permit', desc: 'Required if adding lighting or outlets.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
    ]}],
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [{ label: 'Permits (SmartGov)', permits: [
      { icon: 'ripple', name: 'Swimming pool / spa permit', desc: 'Submit through SmartGov Portal.', jurisdiction: 'city', time: '5–10 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      { icon: 'bolt', name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      { icon: 'barrier-block', name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
    ]}],
  },
  shed: {
    count: 1, timeline: '1–2 weeks', fees: '$100–$400',
    phases: [{ label: 'Permits', permits: [
      { icon: 'home-2', name: 'Accessory structure permit', desc: 'Required for structures exceeding 12 feet in any dimension or 144 sq ft. Submit through SmartGov Portal.', jurisdiction: 'city', time: '3–5 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
    ]}],
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      { label: 'Permits (SmartGov)', permits: [
        { icon: 'layout-sidebar-right-expand', name: 'Residential building permit', desc: 'Submit through SmartGov Portal.', jurisdiction: 'city', time: '5–15 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'bolt', name: 'Electrical permit', desc: 'If scope includes electrical modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'droplet', name: 'Plumbing permit', desc: 'If scope includes plumbing modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3–5 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
    ],
  },
  townhouse: {
    count: 11, timeline: '4–6 months', fees: '$9,000–$20,000',
    phases: [
      { label: 'Before you apply', permits: [
        { icon: 'map', name: 'Lot survey & site plan', desc: 'Sealed survey required. File with Wake County Register of Deeds.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wake.gov', warn: false },
        { icon: 'users', name: 'Pre-application conference', desc: 'Required per Garner UDO Section 4.4.1. Submit request via SmartGov Portal.', jurisdiction: 'city', time: '1–2 wks', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'building-community', name: 'Zoning compliance permit', desc: 'Multi-unit residential requires full zoning review. Submit through SmartGov Portal.', jurisdiction: 'city', time: '10–20 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
      { label: 'Building permits (SmartGov)', permits: [
        { icon: 'home', name: 'Residential building permit (per unit)', desc: 'Submit through SmartGov Portal. No paper applications.', jurisdiction: 'city', time: '5–15 working days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'bolt', name: 'Electrical permit (per unit)', desc: 'Submit through SmartGov Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'droplet', name: 'Plumbing permit (per unit)', desc: 'Submit through SmartGov Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'wind', name: 'Mechanical / HVAC permit (per unit)', desc: 'Submit through SmartGov Portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
      { label: 'Compliance', permits: [
        { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required - always exceeds $40,000.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', warn: false },
        { icon: 'fire-extinguisher', name: 'Fire code compliance', desc: 'Multi-unit triggers fire separation and egress review. Garner Fire Inspectors work within Inspections Department.', jurisdiction: 'city', time: 'Concurrent', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
      { label: 'Completion', permits: [
        { icon: 'clipboard-check', name: 'Construction inspections', desc: '24-hour notice required. No same-day inspections. No phone/email - SmartGov only. Re-inspection fee if inspection fails.', jurisdiction: 'city', time: 'Throughout', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
        { icon: 'certificate', name: 'Certificate of occupancy (per unit)', desc: 'Request through SmartGov Portal. All fees paid before CO issued.', jurisdiction: 'city', time: '3–5 days', url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', warn: false },
      ]},
    ],
  },
}
GARNER_PERMIT_DATA.reno = GARNER_PERMIT_DATA.addition

export const GARNER_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires licensed GC for projects $40,000+. Verify at nclbgc.org.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical requires NC licensed contractor. Apply through SmartGov Portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing requires NC licensed contractor. Apply through SmartGov Portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'All mechanical requires NC licensed contractor. Apply through SmartGov Portal.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required for permit submission.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required for SmartGov Portal submission.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Stamped structural drawings required for engineered products.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites with fill or slope in Garner area.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit through SmartGov Portal.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for SmartGov Portal submission.' },
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
    { level: 'required', name: 'Licensed electrician', why: 'Per unit. SmartGov Portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit. SmartGov Portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit. SmartGov Portal.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required for fire separation compliance.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed site plan required.' },
  ],
}
GARNER_PROFESSIONALS.addition = GARNER_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Trade permit via SmartGov Portal.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Trade permit via SmartGov Portal.' },
  { level: 'optional', name: 'Designer or architect', why: 'Drawings required for SmartGov Portal submission.' },
]

export const GARNER_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing - after complete, before insulation', 'Rough-in - electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const GARNER_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Garner jurisdiction confirmed', desc: 'All permits through Garner Inspections Department via SmartGov Portal. No paper applications accepted.' },
  { ok: true, title: 'Garner self-performs all inspections', desc: 'Important: Garner Inspections Department performs its own field inspections - NOT Wake County. 24-hour notice required, no same-day inspections, no phone/email scheduling.' },
  { ok: true, title: 'SmartGov Portal required for all submissions', desc: 'All applications, fee payments, plan review, and inspection requests go through SmartGov at twn-garner-nc.smartgovcommunity.com. Re-inspection fees apply if inspection fails.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district - flagged by you' : 'No historic district reported', desc: flags.historic ? 'Contact Garner Planning at dss@garnernc.gov for historic district requirements.' : 'You indicated no historic district. Verify with Garner Planning before submitting.', verifyUrl: 'https://www.garnernc.gov/departments/planning', verifyLabel: 'Verify with Garner Planning' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic - Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Garner accepts permit application. Contact (919) 856-7400.' : 'Confirm utility availability with Garner Public Works before applying.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot - dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots have setback requirements on both street frontages per Garner UDO.' : 'Confirm setbacks for your zoning district in Garner UDO before finalizing plans.' },
]
