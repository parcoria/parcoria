// Chapel Hill, NC — Permit Intelligence
// Jurisdiction: Town of Chapel Hill
// County: Orange County
// Portal: Online Permit Center (OpenGov) — chapelhillnc.portal.opengov.com
// Inspections: Chapel Hill Building & Development Services
// Key unique requirement: Certificate of Adequate Public Schools (CAPS) for new residential

export const CHAPEL_HILL_META = {
  city: 'Chapel Hill',
  county: 'Orange County',
  state: 'NC',
  portals: {
    main: 'https://chapelhillnc.portal.opengov.com',
    planning: 'https://www.townofchapelhill.org/government/departments-services/planning-and-zoning-permit-applications',
    inspections: 'https://www.townofchapelhill.org/businesses/building-development-services/inspections',
    fees: 'https://www.townofchapelhill.org/government/departments-services/business-management/fee-schedules/building-and-development-services-fees',
  },
  contacts: {
    main: '(919) 968-2718',
    email: 'permits@townofchapelhill.org',
    address: '405 Martin Luther King Jr Blvd, Chapel Hill, NC 27514',
    hours: 'Mon–Fri 8:30 AM – 5:00 PM',
  },
  notes: [
    'Chapel Hill uses a single Online Permit Center (OpenGov) for all residential applications',
    'CAPS — Certificate of Adequate Public Schools — required for ALL new residential units before zoning permit',
    'Orange County handles well/septic approvals via OWASA or OC Division of Environmental Health',
    'Plan review target: 5 business days. Permit issuance target: 5 business days after approval',
    'Zoning review occurs BEFORE building review — submit both together or separately',
    'Fees based on construction cost using ICC Building Valuation Data table — updated annually',
    'Re-inspection fee: $60 per failed residential inspection',
    'Digital plan submission accepted — email or bring digitals to avoid paper submissions',
  ],
}

export const CHAPEL_HILL_PERMIT_DATA = {
  sfh: {
    count: 12, timeline: '3–5 months', fees: '$7,500–$17,000',
    phases: [
      {
        label: 'Before you apply — critical Chapel Hill steps',
        permits: [
          {
            icon: 'school',
            name: 'Certificate of Adequate Public Schools (CAPS)',
            desc: 'REQUIRED for all new residential units in Orange County before a Zoning Compliance Permit can be issued. Contact Chapel Hill-Carrboro City Schools (CHCCS) to obtain. This is unique to Chapel Hill — do not skip this step.',
            jurisdiction: 'county',
            time: '1–3 weeks',
            url: 'https://www.chccs.k12.nc.us',
            warn: true,
          },
          {
            icon: 'map',
            name: 'Lot survey & site plan',
            desc: 'Site plan required for all new construction. Can be hand-drawn if a reviewer can clearly determine zoning compliance — but sealed survey strongly recommended.',
            jurisdiction: 'city',
            time: '1–2 wks',
            url: 'https://www.chapelhillnc.gov/Business-and-Development/Building-Permits-and-Inspections/Residential-Permits/Site-Plan-Requirements',
            warn: false,
          },
          {
            icon: 'droplets',
            name: 'OWASA utility confirmation',
            desc: 'Orange Water and Sewer Authority (OWASA) bill, service confirmation, or conditional availability letter required before permit submission.',
            jurisdiction: 'county',
            time: '3–5 days',
            url: 'https://www.owasa.org',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 1 — zoning compliance',
        permits: [
          {
            icon: 'building-community',
            name: 'Zoning compliance permit',
            desc: 'Required before building permit. Confirms compliance with Chapel Hill Land Use Management Ordinance (LUMO). Submit via Online Permit Center. Zoning review occurs before building review.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'layers',
            name: 'Land disturbance / grading permit',
            desc: 'Required for any grading, drainage, or land disturbance. Reviews impervious surface, setbacks, and stormwater compliance.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 2 — building permit',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit',
            desc: 'Submit via Online Permit Center. Digital plans accepted — email or upload directly. Full NC Building Code plan review. Allow 5 days for review and 5 days for issuance after approval.',
            jurisdiction: 'city',
            time: '10 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Submit via Online Permit Center concurrently with building permit.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Submit via Online Permit Center. Covers all water supply, waste lines, and sewer connections.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'wind',
            name: 'Mechanical / HVAC permit',
            desc: 'Submit via Online Permit Center for all HVAC system installation.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 3 — connections & compliance',
        permits: [
          {
            icon: 'droplets',
            name: 'Water & sewer connection (OWASA)',
            desc: 'Orange Water and Sewer Authority (OWASA) handles all water and sewer connections in Chapel Hill — not the town. Contact OWASA at (919) 968-4421.',
            jurisdiction: 'county',
            time: '5–10 days',
            url: 'https://www.owasa.org',
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
            desc: 'Schedule via Online Permit Center, phone (919) 968-2718, or email permits@townofchapelhill.org. Must have permit number for all scheduling. Cancel by 9:30 AM day-of to avoid $60 re-inspection fee.',
            jurisdiction: 'city',
            time: 'Throughout',
            url: 'https://www.townofchapelhill.org/businesses/building-development-services/inspections',
            warn: false,
          },
          {
            icon: 'certificate',
            name: 'Certificate of occupancy',
            desc: 'Issued after all final inspections pass. Required before occupancy. All fees must be paid in full before CO is issued.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
    ],
  },
  adu: {
    count: 6, timeline: '6–10 weeks', fees: '$2,500–$7,000',
    phases: [
      {
        label: 'Pre-application',
        permits: [
          {
            icon: 'school',
            name: 'CAPS — Certificate of Adequate Public Schools',
            desc: 'Required for any new residential unit in Orange County including ADUs. Contact CHCCS before any other application.',
            jurisdiction: 'county',
            time: '1–3 weeks',
            url: 'https://www.chccs.k12.nc.us',
            warn: true,
          },
          {
            icon: 'zoom-check',
            name: 'Zoning eligibility check',
            desc: 'Confirm your lot qualifies for an ADU under Chapel Hill LUMO. Check impervious surface limits and setbacks.',
            jurisdiction: 'city',
            time: '1–3 days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Permits',
        permits: [
          {
            icon: 'building-community',
            name: 'Zoning compliance permit',
            desc: 'Required before building permit. Confirms ADU complies with Chapel Hill LUMO.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'home',
            name: 'Residential building permit',
            desc: 'Submit via Online Permit Center. Digital plans accepted.',
            jurisdiction: 'city',
            time: '10 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Required for all ADU electrical systems.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Required if ADU includes kitchen or bathroom.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Completion',
        permits: [
          {
            icon: 'certificate',
            name: 'Certificate of occupancy',
            desc: 'Required before ADU can be rented or occupied.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
    ],
  },
  deck: {
    count: 2, timeline: '2–4 weeks', fees: '$300–$1,000',
    phases: [
      {
        label: 'Permits',
        permits: [
          {
            icon: 'tools',
            name: 'Residential building permit — deck / porch',
            desc: 'Submit via Online Permit Center or email permits@townofchapelhill.org. Digital plans accepted.',
            jurisdiction: 'city',
            time: '5–10 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Required if adding lighting, outlets, or ceiling fans.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
    ],
  },
  pool: {
    count: 3, timeline: '3–6 weeks', fees: '$500–$2,000',
    phases: [
      {
        label: 'Permits',
        permits: [
          {
            icon: 'ripple',
            name: 'Swimming pool / spa permit',
            desc: 'Submit via Online Permit Center. Required for all in-ground pools and above-ground pools over 24 inches.',
            jurisdiction: 'city',
            time: '10 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Required for pool pump, lighting, and bonding.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'barrier-block',
            name: 'Barrier / fence permit',
            desc: 'NC Building Code requires approved safety barrier around all pools.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
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
          {
            icon: 'home-2',
            name: 'Accessory structure permit',
            desc: 'Required for structures over 144 sq ft or 12 ft tall. Submit via Online Permit Center.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
    ],
  },
  addition: {
    count: 5, timeline: '4–8 weeks', fees: '$1,500–$6,000',
    phases: [
      {
        label: 'Zoning compliance',
        permits: [
          {
            icon: 'building-community',
            name: 'Zoning compliance permit',
            desc: 'Required for additions that affect setbacks, height, or impervious surface. Zoning review before building review.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Building permits',
        permits: [
          {
            icon: 'layout-sidebar-right-expand',
            name: 'Residential building permit',
            desc: 'Submit via Online Permit Center. Digital plans accepted. Required for structural changes and additions.',
            jurisdiction: 'city',
            time: '10 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Required if scope includes electrical modifications.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Required if scope includes plumbing modifications.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Completion',
        permits: [
          {
            icon: 'certificate',
            name: 'Certificate of occupancy',
            desc: 'Required if addition creates new occupiable space.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
    ],
  },
  townhouse: {
    count: 13, timeline: '4–6 months', fees: '$10,000–$22,000',
    phases: [
      {
        label: 'Before you apply — critical Chapel Hill steps',
        permits: [
          {
            icon: 'school',
            name: 'Certificate of Adequate Public Schools (CAPS)',
            desc: 'REQUIRED for all new residential units in Orange County. Must be obtained from CHCCS before any Zoning Compliance Permit is issued. This is unique to Chapel Hill/Orange County.',
            jurisdiction: 'county',
            time: '1–3 weeks',
            url: 'https://www.chccs.k12.nc.us',
            warn: true,
          },
          {
            icon: 'map',
            name: 'Lot survey & recorded plat',
            desc: 'Sealed plot plan required for all multi-unit construction.',
            jurisdiction: 'county',
            time: '1–2 wks',
            url: 'https://www.orangecountync.gov/departments/register_of_deeds',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 1 — zoning & site',
        permits: [
          {
            icon: 'building-community',
            name: 'Zoning compliance permit',
            desc: 'Multi-unit residential requires zoning compliance review. May require Special Use Permit for larger developments.',
            jurisdiction: 'city',
            time: '10–20 days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'layers',
            name: 'Land disturbance / grading permit',
            desc: 'Required for site grading, drainage, and stormwater management.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 2 — building permits',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit (per unit)',
            desc: 'Submit via Online Permit Center. Digital plans accepted and encouraged.',
            jurisdiction: 'city',
            time: '10 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit (per unit)',
            desc: 'Submit via Online Permit Center.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit (per unit)',
            desc: 'Submit via Online Permit Center.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
          {
            icon: 'wind',
            name: 'Mechanical / HVAC permit (per unit)',
            desc: 'Submit via Online Permit Center.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 3 — connections & compliance',
        permits: [
          {
            icon: 'droplets',
            name: 'OWASA water & sewer connection',
            desc: 'OWASA handles all utility connections in Chapel Hill. Contact (919) 968-4421 early — connection timelines vary.',
            jurisdiction: 'county',
            time: '5–10 days',
            url: 'https://www.owasa.org',
            warn: false,
          },
          {
            icon: 'receipt',
            name: 'Lien agent appointment',
            desc: 'Required — townhouse projects always exceed $40,000. File at liensnc.com.',
            jurisdiction: 'state',
            time: '1 day',
            url: 'https://www.liensnc.com',
            warn: false,
          },
          {
            icon: 'fire-extinguisher',
            name: 'Fire code compliance review',
            desc: 'Multi-unit residential triggers fire separation and egress review.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
      {
        label: 'Completion',
        permits: [
          {
            icon: 'clipboard-check',
            name: 'Construction inspections',
            desc: 'Schedule via Online Permit Center or call (919) 968-2718. Cancel by 9:30 AM day-of to avoid $60 re-inspection fee.',
            jurisdiction: 'city',
            time: 'Throughout',
            url: 'https://www.townofchapelhill.org/businesses/building-development-services/inspections',
            warn: false,
          },
          {
            icon: 'certificate',
            name: 'Certificate of occupancy (per unit)',
            desc: 'All fees must be paid in full before CO is issued.',
            jurisdiction: 'city',
            time: '5 business days',
            url: 'https://chapelhillnc.portal.opengov.com',
            warn: false,
          },
        ],
      },
    ],
  },
}

CHAPEL_HILL_PERMIT_DATA.reno = CHAPEL_HILL_PERMIT_DATA.addition

export const CHAPEL_HILL_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires a licensed GC for projects $40,000+. Verify at nclbgc.org. The GC of record is responsible for paying all permit fees in Chapel Hill.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical work requires a NC licensed electrical contractor.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing work requires a NC licensed plumbing contractor.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Mechanical systems require a NC licensed mechanical contractor.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Site plan required for permit submission. Hand-drawn plans may be accepted but sealed survey is strongly recommended.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required. Digital plans accepted — email or upload directly to Online Permit Center.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for unconventional spans, retaining walls, or complex structural elements.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites with fill, slope, or expansive soils in Orange County.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000. NC law requires licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Required for all ADU electrical systems.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom plumbing.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for permit submission via Online Permit Center.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required. Below that, homeowner may self-contract in NC.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex elevated decks benefit from professional drawings.' },
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
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit residential requires NC licensed GC. GC is responsible for all permit fees in Chapel Hill.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit electrical systems.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit plumbing.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit mechanical systems.' },
    { level: 'required', name: 'Licensed architect', why: 'Fire separation, egress, and accessibility compliance requires architect-stamped drawings.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required for permit submission.' },
  ],
}

CHAPEL_HILL_PROFESSIONALS.addition = CHAPEL_HILL_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project cost exceeds $40,000. GC is responsible for all permit fees.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Required if scope includes electrical modifications.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Required if scope includes plumbing modifications.' },
  { level: 'optional', name: 'Designer or architect', why: 'Digital plans accepted — email or upload to Online Permit Center.' },
]

export const CHAPEL_HILL_INSPECTIONS = {
  sfh: [
    'Footing / foundation',
    'Framing — after complete, before insulation',
    'Rough-in — electrical, plumbing, HVAC',
    'Insulation',
    'Final building',
    'Final electrical',
    'Final plumbing',
    'Final mechanical',
    'Certificate of occupancy walkthrough',
  ],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of occupancy'],
  deck: ['Footing', 'Framing', 'Final'],
  pool: ['Pre-pour', 'Bonding / electrical', 'Barrier / fence', 'Final pool'],
  shed: ['Final'],
  townhouse: [
    'Footing (per building)',
    'Framing (per unit)',
    'Fire separation',
    'Rough-in (per unit)',
    'Insulation',
    'Final (per unit)',
    'Certificate of occupancy (per unit)',
  ],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const CHAPEL_HILL_BUILDABILITY_CHECKS = (flags) => [
  {
    ok: true,
    title: 'Town of Chapel Hill jurisdiction confirmed',
    desc: 'All permits through Chapel Hill Building & Development Services via the Online Permit Center. Single portal for all applications.',
  },
  {
    ok: true,
    title: 'OWASA utility district',
    desc: 'Orange Water and Sewer Authority (OWASA) handles ALL water and sewer connections in Chapel Hill — not the town. Contact OWASA at (919) 968-4421 early in your process.',
  },
  {
    ok: true,
    title: 'CAPS requirement applies — Orange County',
    desc: 'Chapel Hill-Carrboro City Schools must issue a Certificate of Adequate Public Schools (CAPS) before any Zoning Compliance Permit is issued for new residential units. This is unique to Orange County. Start this first.',
  },
  {
    ok: !flags.flood,
    title: flags.flood ? 'Floodplain overlay — flagged by you' : 'No floodplain overlay reported',
    desc: flags.flood
      ? 'FEMA elevation certificate required before permits. Orange County has floodplain areas near Morgan Creek and New Hope Creek — hire a licensed NC surveyor immediately.'
      : 'You indicated no floodplain. Verify at msc.fema.gov before submitting — Chapel Hill has floodplain areas near Morgan Creek.',
    verifyUrl: 'https://msc.fema.gov/portal/search',
    verifyLabel: 'Verify at FEMA flood map',
  },
  {
    ok: !flags.historic,
    title: flags.historic ? 'Historic district overlay — flagged by you' : 'No historic district overlay reported',
    desc: flags.historic
      ? 'Chapel Hill Historic District Commission approval required before building permit submission. Adds 4–8 weeks.'
      : 'You indicated no historic district. Verify at townofchapelhill.org before submitting.',
    verifyUrl: 'https://www.townofchapelhill.org/government/departments-services/planning-and-zoning-permit-applications',
    verifyLabel: 'Verify historic status',
  },
  {
    ok: !flags.septic,
    title: flags.septic ? 'Private well/septic — Orange County EH approval needed' : 'OWASA water & sewer reported',
    desc: flags.septic
      ? 'Orange County Division of Environmental Health must approve well/septic design. Contact (919) 245-2360. OWASA bill or OC EH approval required for permit submission.'
      : 'You indicated OWASA utilities. Confirm service availability with OWASA at owasa.org before applying.',
  },
  {
    ok: !flags.corner,
    title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot configuration reported',
    desc: flags.corner
      ? 'Corner lots in Chapel Hill have setback requirements on both street frontages per Chapel Hill LUMO. Verify exact setback distances with your surveyor.'
      : 'You indicated a standard lot. Confirm setbacks for your zoning district in Chapel Hill LUMO before finalizing plans.',
  },
]
