// Apex, NC - Permit Intelligence
// Jurisdiction: Town of Apex
// County: Wake County (inspections shared with Raleigh)
// Portals: IDT Plans (plan submissions) + ePermits (payments + inspection tracking)
// Key note: Dual portal - plans in IDT, payments in ePermits

export const APEX_META = {
  city: 'Apex',
  county: 'Wake County',
  state: 'NC',
  portals: {
    plans: 'https://www.myidtplans.com',
    epermits: 'https://www.apexnc.org/183/Building-Inspections-Permits',
    inspections: 'https://www.apexnc.org/183/Building-Inspections-Permits',
    forms: 'https://www.apexnc.org/188/Forms',
  },
  contacts: {
    main: '(919) 249-3418',
    inspections: '(919) 249-3388',
    address: '322 N. Mason St, Apex, NC 27502',
    hours: 'Mon–Fri 8:00 AM – 5:00 PM',
  },
  notes: [
    'Apex uses TWO portals - submit plans via IDT Plans portal, pay fees via ePermits portal',
    'New single-family applications MUST be submitted through IDT Plans - not accepted at counter',
    'Inspections must be scheduled by 2:00 PM the day before - online or at Building Inspection desk',
    'Normal construction hours: Mon–Fri 7AM–7PM, Saturday 9AM–7PM',
    'Projects over $40,000 require Workers Comp affidavit, Certificate of Insurance to Town of Apex, and lien agent form',
    'Wake County handles all field inspections - same as Raleigh',
    'Plan review: 1–10 working days depending on project type and workload',
  ],
}

export const APEX_PERMIT_DATA = {
  sfh: {
    count: 11, timeline: '3–5 months', fees: '$7,500–$16,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          {
            icon: 'map',
            name: 'Lot survey & recorded plat',
            desc: 'Sealed plot plan required. File with Wake County Register of Deeds before permit submission.',
            jurisdiction: 'county',
            time: '1–2 wks',
            url: 'https://www.wake.gov/departments-government/register-deeds',
            portal: null, warn: false,
          },
          {
            icon: 'map-pin',
            name: 'Address assignment',
            desc: 'Confirm official address with Apex GIS before any permit application. Contact (919) 249-3300.',
            jurisdiction: 'city',
            time: '1–3 days',
            url: 'https://www.apexnc.org',
            portal: null, warn: false,
          },
        ],
      },
      {
        label: 'Phase 1 - zoning & planning',
        permits: [
          {
            icon: 'building-community',
            name: 'Zoning / planning approval',
            desc: 'Get Planning Department approval before or alongside permit submission. Can obtain on 2nd floor of Mason Street Municipal Building or submit through IDT portal for forwarding.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://www.apexnc.org/215/Applications-Schedules',
            portal: 'IDT Plans or in-person', warn: false,
          },
          {
            icon: 'layers',
            name: 'Grading permit',
            desc: 'Required to begin site work before building permit is issued. Submit Grading Permit Application through IDT Plans portal.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://www.myidtplans.com',
            portal: 'IDT Plans', warn: false,
          },
        ],
      },
      {
        label: 'Phase 2 - building permit (IDT Plans)',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit',
            desc: 'Must be submitted through IDT Plans portal - not accepted at counter for new SFH. Full NC Building Code plan review. Allow 1–10 working days.',
            jurisdiction: 'city',
            time: '1–10 working days',
            url: 'https://www.myidtplans.com',
            portal: 'IDT Plans', warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Must be submitted by a licensed electrical contractor through IDT Plans portal.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://www.myidtplans.com',
            portal: 'IDT Plans', warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Must be submitted by a licensed plumbing contractor through IDT Plans portal.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://www.myidtplans.com',
            portal: 'IDT Plans', warn: false,
          },
          {
            icon: 'wind',
            name: 'Mechanical / HVAC permit',
            desc: 'Must be submitted by a licensed mechanical contractor through IDT Plans portal.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://www.myidtplans.com',
            portal: 'IDT Plans', warn: false,
          },
        ],
      },
      {
        label: 'Phase 3 - pay fees (ePermits)',
        permits: [
          {
            icon: 'credit-card',
            name: 'Permit fee payment',
            desc: 'After IDT Plans approval, pay all fees through the ePermits portal before permit is issued. Permit is NOT active until fees are paid.',
            jurisdiction: 'city',
            time: 'After approval',
            url: 'https://www.apexnc.org/183/Building-Inspections-Permits',
            portal: 'ePermits', warn: true,
          },
          {
            icon: 'receipt',
            name: 'Lien agent appointment',
            desc: 'Required by NC law for projects over $40,000. File at liensnc.com. Also provide lien agent form to Town of Apex at submission.',
            jurisdiction: 'state',
            time: '1 day',
            url: 'https://www.liensnc.com',
            portal: null, warn: false,
          },
        ],
      },
      {
        label: 'Phase 4 - inspections & close-out',
        permits: [
          {
            icon: 'clipboard-check',
            name: 'Construction inspections',
            desc: 'Schedule by 2:00 PM the day before via inspection request form online or call (919) 249-3388. Wake County performs all field inspections.',
            jurisdiction: 'county',
            time: 'Throughout',
            url: 'https://www.apexnc.org/183/Building-Inspections-Permits',
            portal: null, warn: false,
          },
          {
            icon: 'certificate',
            name: 'Certificate of occupancy',
            desc: 'Issued after all final inspections pass. Required before occupancy.',
            jurisdiction: 'city',
            time: '3–5 days',
            url: 'https://www.apexnc.org/183/Building-Inspections-Permits',
            portal: 'ePermits', warn: false,
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
          { icon: 'zoom-check', name: 'Zoning eligibility check', desc: 'Confirm your lot qualifies for an ADU under Apex UDO. Contact Planning at (919) 249-3300.', jurisdiction: 'city', time: '1–3 days', url: 'https://www.apexnc.org/215/Applications-Schedules', portal: null, warn: false },
        ],
      },
      {
        label: 'Building permits (IDT Plans)',
        permits: [
          { icon: 'home', name: 'Residential building permit', desc: 'Submit through IDT Plans portal. Detached ADUs treated as single-family dwelling.', jurisdiction: 'city', time: '1–10 working days', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'Required if ADU includes kitchen or bathroom. Submit through IDT Plans.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
        ],
      },
      {
        label: 'Completion',
        permits: [
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required before ADU can be rented or occupied.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.apexnc.org/183/Building-Inspections-Permits', portal: 'ePermits', warn: false },
        ],
      },
    ],
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$1,000',
    phases: [
      {
        label: 'Permits (IDT Plans)',
        permits: [
          { icon: 'tools', name: 'Residential building permit - deck / porch', desc: 'Submit through IDT Plans portal. Allow 1–10 working days for review.', jurisdiction: 'city', time: '1–10 working days', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Required if adding lighting or outlets. Submit through IDT Plans.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
        ],
      },
    ],
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [
      {
        label: 'Permits (IDT Plans)',
        permits: [
          { icon: 'ripple', name: 'Swimming pool / spa permit', desc: 'Submit through IDT Plans portal.', jurisdiction: 'city', time: '1–10 working days', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'Pool bonding, pump, and lighting. Submit through IDT Plans.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'barrier-block', name: 'Barrier / fence permit', desc: 'NC code requires approved safety barrier around all pools.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
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
          { icon: 'home-2', name: 'Accessory structure permit', desc: 'Required for structures over 144 sq ft or 12 ft tall. Submit through IDT Plans.', jurisdiction: 'city', time: '1–5 working days', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
        ],
      },
    ],
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      {
        label: 'Building permits (IDT Plans)',
        permits: [
          { icon: 'layout-sidebar-right-expand', name: 'Residential building permit', desc: 'Submit through IDT Plans portal. Required for structural changes and additions.', jurisdiction: 'city', time: '1–10 working days', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'bolt', name: 'Electrical permit', desc: 'If scope includes electrical modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'droplet', name: 'Plumbing permit', desc: 'If scope includes plumbing modifications.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
        ],
      },
      {
        label: 'Completion',
        permits: [
          { icon: 'certificate', name: 'Certificate of occupancy', desc: 'Required if addition creates new occupiable space.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.apexnc.org/183/Building-Inspections-Permits', portal: 'ePermits', warn: false },
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
          { icon: 'map', name: 'Lot survey & recorded plat', desc: 'Sealed plot plan required. File with Wake County Register of Deeds.', jurisdiction: 'county', time: '1–2 wks', url: 'https://www.wake.gov', portal: null, warn: false },
          { icon: 'building-community', name: 'Zoning / planning approval', desc: 'Multi-unit may require Board of Adjustment review. Contact Apex Planning at (919) 249-3300.', jurisdiction: 'city', time: '10–20 days', url: 'https://www.apexnc.org/215/Applications-Schedules', portal: 'IDT Plans', warn: false },
        ],
      },
      {
        label: 'Building permits (IDT Plans)',
        permits: [
          { icon: 'home', name: 'Residential building permit (per unit)', desc: 'Submit through IDT Plans. Each unit may require separate permit.', jurisdiction: 'city', time: '1–10 working days', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'bolt', name: 'Electrical permit (per unit)', desc: 'Submit through IDT Plans.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'droplet', name: 'Plumbing permit (per unit)', desc: 'Submit through IDT Plans.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
          { icon: 'wind', name: 'Mechanical / HVAC permit (per unit)', desc: 'Submit through IDT Plans.', jurisdiction: 'city', time: 'Concurrent', url: 'https://www.myidtplans.com', portal: 'IDT Plans', warn: false },
        ],
      },
      {
        label: 'Fees & compliance',
        permits: [
          { icon: 'credit-card', name: 'Permit fee payment', desc: 'Pay all fees through ePermits portal after IDT approval. Permit not active until paid.', jurisdiction: 'city', time: 'After approval', url: 'https://www.apexnc.org/183/Building-Inspections-Permits', portal: 'ePermits', warn: true },
          { icon: 'receipt', name: 'Lien agent appointment', desc: 'Required - townhouse always exceeds $40,000. File at liensnc.com.', jurisdiction: 'state', time: '1 day', url: 'https://www.liensnc.com', portal: null, warn: false },
        ],
      },
      {
        label: 'Completion',
        permits: [
          { icon: 'clipboard-check', name: 'Construction inspections', desc: 'Schedule by 2 PM day before via online form or (919) 249-3388. Wake County performs inspections.', jurisdiction: 'county', time: 'Throughout', url: 'https://www.apexnc.org/183/Building-Inspections-Permits', portal: null, warn: false },
          { icon: 'certificate', name: 'Certificate of occupancy (per unit)', desc: 'Issued after all inspections pass. Required before occupancy.', jurisdiction: 'city', time: '3–5 days', url: 'https://www.apexnc.org/183/Building-Inspections-Permits', portal: 'ePermits', warn: false },
        ],
      },
    ],
  },
}

APEX_PERMIT_DATA.reno = APEX_PERMIT_DATA.addition

export const APEX_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires a licensed GC for projects $40,000+. Apex also requires Workers Comp affidavit and Certificate of Insurance issued to Town of Apex at submission.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical trade permits must be submitted by a licensed electrical contractor in Apex.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing trade permits must be submitted by a licensed plumbing contractor in Apex.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'All mechanical trade permits must be submitted by a licensed mechanical contractor in Apex.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required. File with Wake County Register of Deeds before submission.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required for IDT Plans submission.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for unconventional spans or complex structural elements.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites with fill, slope, or expansive soils.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000. NC law requires licensed GC. Apex requires Workers Comp affidavit and CoI.' },
    { level: 'required', name: 'Licensed electrician', why: 'Trade permit must be submitted by licensed contractor.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for IDT Plans submission.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required. Apex requires CoI issued to Town.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex elevated decks benefit from professional drawings.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires licensed specialty contractor for in-ground pool installation.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting. Trade permit must be submitted by licensed contractor.' },
    { level: 'optional', name: 'Fence / barrier installer', why: 'NC code requires approved pool barrier.' },
  ],
  shed: [{ level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' }],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit requires NC licensed GC. Apex requires Workers Comp affidavit and CoI to Town.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit. Trade permit submitted by licensed contractor.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit. Trade permit submitted by licensed contractor.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit. Trade permit submitted by licensed contractor.' },
    { level: 'required', name: 'Licensed architect', why: 'Stamped drawings required for IDT Plans submission.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required.' },
  ],
}
APEX_PROFESSIONALS.addition = APEX_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project exceeds $40,000. Apex requires Workers Comp affidavit and CoI to Town.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Trade permit must be submitted by licensed contractor.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Trade permit must be submitted by licensed contractor.' },
  { level: 'optional', name: 'Designer or architect', why: 'Drawings required for IDT Plans submission.' },
]

export const APEX_INSPECTIONS = {
  sfh: ['Footing / foundation', 'Framing - after complete, before insulation', 'Rough-in - electrical, plumbing, HVAC', 'Insulation', 'Final building', 'Final electrical', 'Final plumbing', 'Final mechanical', 'Certificate of occupancy walkthrough'],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: ['Footing (per building)', 'Framing (per unit)', 'Fire separation', 'Rough-in (per unit)', 'Insulation', 'Final (per unit)', 'Certificate of occupancy (per unit)'],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const APEX_BUILDABILITY_CHECKS = (flags) => [
  { ok: true, title: 'Town of Apex jurisdiction confirmed', desc: 'All permits through Apex Building Inspections & Permitting. Plan submissions via IDT Plans portal, payments via ePermits portal.' },
  { ok: true, title: 'Wake County inspection district', desc: 'Wake County performs all field inspections - same as Raleigh. Schedule inspections by 2:00 PM the day before at (919) 249-3388.' },
  { ok: true, title: 'Dual portal system - IDT Plans + ePermits', desc: 'Submit all plans through IDT Plans portal. Pay all fees through the ePermits portal. Both accounts required. Permit is not active until fees are paid in ePermits.' },
  { ok: !flags.historic, title: flags.historic ? 'Historic district - flagged by you' : 'No historic district reported', desc: flags.historic ? 'Apex Historic District review required before building permit. Verify with Apex Planning at (919) 249-3300.' : 'You indicated no historic district. Verify with Apex Planning before submitting.', verifyUrl: 'https://www.apexnc.org/215/Applications-Schedules', verifyLabel: 'Verify with Apex Planning' },
  { ok: !flags.septic, title: flags.septic ? 'Private well/septic - Wake County EH approval needed' : 'City utilities reported', desc: flags.septic ? 'Wake County Environmental Services must approve before Apex accepts permit application.' : 'You indicated city utilities. Confirm water/sewer availability with Apex Utilities before applying.' },
  { ok: !flags.corner, title: flags.corner ? 'Corner lot - dual setbacks apply' : 'Standard lot reported', desc: flags.corner ? 'Corner lots in Apex have setback requirements on both street frontages per Apex UDO.' : 'Confirm setbacks for your zoning district in Apex UDO before finalizing plans.' },
]
