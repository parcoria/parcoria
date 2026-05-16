// Durham, NC — Permit Intelligence
// Jurisdiction: City and County of Durham (unified)
// Portals: Dplans (building/fire) + Land Development Office (LDO) (trade permits, inspections, fees)
// Inspections: Durham City-County Building & Safety Department
// County: Durham County

export const DURHAM_META = {
  city: 'Durham',
  county: 'Durham County',
  state: 'NC',
  portals: {
    building: 'https://dplans.durhamnc.gov',
    ldo: 'https://ldo4.durhamnc.gov/DurhamWeb',
    inspections: 'https://ldo4.durhamnc.gov/DurhamWeb',
    openData: 'https://live-durhamnc.opendata.arcgis.com/datasets/DurhamNC::all-building-permits/about',
  },
  contacts: {
    main: '(919) 560-4144',
    email: 'building@durhamnc.gov',
    address: '101 City Hall Plaza, Durham, NC 27701',
    hours: 'Mon–Fri 9:00 AM – 3:00 PM (walk-in)',
  },
  notes: [
    'Durham uses TWO portals — building/fire permits via Dplans, trade permits and inspections via LDO',
    'Inspections handled by Durham City-County Building & Safety — same department as permits',
    'Durham County and City of Durham share one unified building department',
    'Projects over $40,000 require a licensed NC General Contractor',
    'Lien agent appointment required at liensnc.com before work begins on projects over $40,000',
  ],
}

export const DURHAM_PERMIT_DATA = {
  sfh: {
    count: 10, timeline: '3–5 months', fees: '$7,000–$16,000',
    phases: [
      {
        label: 'Before you apply',
        permits: [
          {
            icon: 'map',
            name: 'Lot survey & recorded plat',
            desc: 'Sealed plot plan required. File with Durham County Register of Deeds before permit submission.',
            jurisdiction: 'county',
            time: '1–2 wks',
            url: 'https://www.dconc.gov/government/departments-f-through-z/register-of-deeds',
            portal: 'Durham County',
            warn: false,
          },
          {
            icon: 'map-pin',
            name: 'Address assignment',
            desc: 'Confirm official address with Durham GIS before any permit application.',
            jurisdiction: 'city',
            time: '1–3 days',
            url: 'https://www.durhamnc.gov',
            portal: 'City of Durham',
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
            desc: 'Confirms project complies with Durham Unified Development Ordinance (UDO). Required before building permit.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://www.durhamnc.gov/293/City-County-Inspections',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'layers',
            name: 'Site / grading permit',
            desc: 'Required for land disturbance, grading, drainage, and stormwater management.',
            jurisdiction: 'city',
            time: '10–15 days',
            url: 'https://www.durhamnc.gov/293/City-County-Inspections',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 2 — building permit (Dplans)',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit',
            desc: 'Submit via Dplans — Durham\'s digital plan submission portal. Full NC Building Code plan review. Upload stamped architectural and structural drawings.',
            jurisdiction: 'city',
            time: '15–30 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 3 — trade permits (LDO portal)',
        permits: [
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Submit through LDO portal — separate from building permit submission in Dplans.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Submit through LDO portal. Covers water supply, waste lines, gas piping, and sewer connections.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'wind',
            name: 'Mechanical / HVAC permit',
            desc: 'Submit through LDO portal. Covers all heating, ventilation, and air conditioning systems.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 4 — connections',
        permits: [
          {
            icon: 'droplets',
            name: 'Water & sewer connection permit',
            desc: 'Contact Durham One Call at (919) 560-1200 to confirm utility availability. Apply through LDO portal.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'receipt',
            name: 'Lien agent appointment',
            desc: 'Required by NC law for projects over $40,000. File at liensnc.com before any work begins.',
            jurisdiction: 'state',
            time: '1 day',
            url: 'https://www.liensnc.com',
            portal: 'NC State',
            warn: false,
          },
        ],
      },
      {
        label: 'Phase 5 — inspections & close-out',
        permits: [
          {
            icon: 'clipboard-check',
            name: 'Construction inspections',
            desc: 'Schedule all inspections through the LDO portal. Durham City-County Building & Safety handles all inspection stages.',
            jurisdiction: 'city',
            time: 'Throughout',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'certificate',
            name: 'Certificate of compliance',
            desc: 'Durham issues a Certificate of Compliance (not Certificate of Occupancy) after all inspections pass. Required before occupancy.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
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
          {
            icon: 'zoom-check',
            name: 'Zoning eligibility check',
            desc: 'Confirm lot qualifies for ADU under Durham UDO. Check at durhamnc.gov or contact planning at (919) 560-4137.',
            jurisdiction: 'city',
            time: '1–3 days',
            url: 'https://www.durhamnc.gov/292/Planning',
            portal: 'City of Durham Planning',
            warn: false,
          },
        ],
      },
      {
        label: 'Building permit (Dplans)',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit',
            desc: 'Submit via Dplans. Detached ADUs treated as single-family dwelling — full plan review required.',
            jurisdiction: 'city',
            time: '15–30 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Trade permits (LDO portal)',
        permits: [
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Submit through LDO portal for all ADU electrical systems.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Submit through LDO portal if ADU includes kitchen or bathroom.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Completion',
        permits: [
          {
            icon: 'certificate',
            name: 'Certificate of compliance',
            desc: 'Required before ADU can be rented or occupied.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
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
            desc: 'Submit via Dplans. Required for all attached decks and screened porches. Include site plan and structural drawings.',
            jurisdiction: 'city',
            time: '10–15 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Submit through LDO portal. Required only if adding lighting, outlets, or ceiling fans.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
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
            desc: 'Submit via Dplans. Required for all in-ground pools and above-ground pools over 24 inches depth.',
            jurisdiction: 'city',
            time: '10–20 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Submit through LDO portal. Required for pool pump, lighting, and bonding.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'barrier-block',
            name: 'Barrier / fence permit',
            desc: 'NC code requires an approved safety barrier around all pools.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
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
            desc: 'Submit via Dplans. Required for detached structures over 144 sq ft or 12 ft tall.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
        ],
      },
    ],
  },
  addition: {
    count: 4, timeline: '4–8 weeks', fees: '$1,500–$5,000',
    phases: [
      {
        label: 'Building permit (Dplans)',
        permits: [
          {
            icon: 'layout-sidebar-right-expand',
            name: 'Residential building permit',
            desc: 'Submit via Dplans. Required for structural changes and additions affecting load-bearing elements.',
            jurisdiction: 'city',
            time: '15–30 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Trade permits (LDO portal)',
        permits: [
          {
            icon: 'bolt',
            name: 'Electrical permit',
            desc: 'Submit through LDO portal if scope includes electrical modifications.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit',
            desc: 'Submit through LDO portal if scope includes plumbing modifications.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Completion',
        permits: [
          {
            icon: 'certificate',
            name: 'Certificate of compliance',
            desc: 'Required if addition creates new occupiable space.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
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
          {
            icon: 'map',
            name: 'Lot survey & recorded plat',
            desc: 'Sealed plot plan required. File with Durham County Register of Deeds.',
            jurisdiction: 'county',
            time: '1–2 wks',
            url: 'https://www.dconc.gov/government/departments-f-through-z/register-of-deeds',
            portal: 'Durham County',
            warn: false,
          },
          {
            icon: 'building-community',
            name: 'Zoning compliance permit',
            desc: 'Multi-unit residential requires zoning compliance review. May require Board of Adjustment approval.',
            jurisdiction: 'city',
            time: '10–20 days',
            url: 'https://www.durhamnc.gov/292/Planning',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Building permit (Dplans)',
        permits: [
          {
            icon: 'home',
            name: 'Residential building permit (per unit)',
            desc: 'Submit via Dplans. Each unit may require separate permit — confirm with Durham City-County Inspections.',
            jurisdiction: 'city',
            time: '15–30 days',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Trade permits (LDO portal)',
        permits: [
          {
            icon: 'bolt',
            name: 'Electrical permit (per unit)',
            desc: 'Submit through LDO portal for each unit.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'droplet',
            name: 'Plumbing permit (per unit)',
            desc: 'Submit through LDO portal for each unit.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'wind',
            name: 'Mechanical / HVAC permit (per unit)',
            desc: 'Submit through LDO portal for each unit.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
      {
        label: 'Connections & compliance',
        permits: [
          {
            icon: 'droplets',
            name: 'Water & sewer connection',
            desc: 'Contact Durham One Call at (919) 560-1200. Apply through LDO portal.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'receipt',
            name: 'Lien agent appointment',
            desc: 'Required — townhouse projects always exceed $40,000. File at liensnc.com before work begins.',
            jurisdiction: 'state',
            time: '1 day',
            url: 'https://www.liensnc.com',
            portal: 'NC State',
            warn: false,
          },
          {
            icon: 'fire-extinguisher',
            name: 'Fire code compliance review',
            desc: 'Multi-unit residential triggers fire separation and egress review by Durham Fire Department.',
            jurisdiction: 'city',
            time: 'Concurrent',
            url: 'https://dplans.durhamnc.gov',
            portal: 'Dplans Portal',
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
            desc: 'All stages scheduled through LDO portal. Durham City-County Building & Safety handles all inspections.',
            jurisdiction: 'city',
            time: 'Throughout',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
          {
            icon: 'certificate',
            name: 'Certificate of compliance (per unit)',
            desc: 'Issued per unit after all inspections pass. Required before occupancy.',
            jurisdiction: 'city',
            time: '5–10 days',
            url: 'https://ldo4.durhamnc.gov/DurhamWeb',
            portal: 'LDO Portal',
            warn: false,
          },
        ],
      },
    ],
  },
}

DURHAM_PERMIT_DATA.reno = DURHAM_PERMIT_DATA.addition

export const DURHAM_PROFESSIONALS = {
  sfh: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'NC law requires a licensed GC for projects $40,000+. Verify at nclbgc.org before signing any contract.' },
    { level: 'required', name: 'Licensed electrician', why: 'All electrical work requires a NC licensed electrical contractor. Submit trade permit through LDO portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'All plumbing work requires a NC licensed plumbing contractor. Submit trade permit through LDO portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Mechanical systems require a NC licensed mechanical contractor. Submit trade permit through LDO portal.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required before permit submission. Must be a NC Professional Land Surveyor.' },
    { level: 'recommended', name: 'Architect or residential designer', why: 'Full construction drawings required for Dplans submission. Durham reviewers require complete stamped drawings.' },
    { level: 'recommended', name: 'Structural engineer', why: 'Required for unconventional spans, retaining walls, or complex structural elements. Stamped drawings required.' },
    { level: 'optional', name: 'Geotechnical / soil engineer', why: 'Recommended for sites with fill, slope, or expansive soils common in Durham County.' },
  ],
  adu: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Project almost certainly exceeds $40,000. NC law requires licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Required for all ADU electrical systems. Trade permit through LDO portal.' },
    { level: 'recommended', name: 'Licensed plumber', why: 'Required if ADU includes kitchen or bathroom plumbing.' },
    { level: 'recommended', name: 'Architect or designer', why: 'Drawings required for Dplans submission.' },
  ],
  deck: [
    { level: 'recommended', name: 'Licensed contractor', why: 'If project exceeds $40,000, GC license required. Below that, homeowner may self-contract in NC.' },
    { level: 'optional', name: 'Structural designer', why: 'Complex elevated decks benefit from professional drawings to avoid Dplans correction cycles.' },
  ],
  pool: [
    { level: 'required', name: 'Licensed pool contractor', why: 'NC requires a licensed specialty contractor for in-ground pool installation.' },
    { level: 'required', name: 'Licensed electrician', why: 'Pool bonding, pump, and lighting require a licensed electrical contractor. Trade permit via LDO.' },
    { level: 'optional', name: 'Fence / barrier installer', why: 'NC code requires an approved pool barrier.' },
  ],
  shed: [
    { level: 'optional', name: 'Contractor', why: 'Small sheds under $40,000 may be owner-built in NC.' },
  ],
  townhouse: [
    { level: 'required', name: 'Licensed general contractor (GC)', why: 'Multi-unit residential requires NC licensed GC.' },
    { level: 'required', name: 'Licensed electrician', why: 'Per unit electrical systems. Trade permits via LDO portal.' },
    { level: 'required', name: 'Licensed plumber', why: 'Per unit plumbing. Trade permits via LDO portal.' },
    { level: 'required', name: 'Licensed HVAC contractor', why: 'Per unit mechanical systems. Trade permits via LDO portal.' },
    { level: 'required', name: 'Licensed architect', why: 'Fire separation, egress, and accessibility compliance requires architect-stamped drawings for Dplans.' },
    { level: 'required', name: 'Structural engineer', why: 'Stamped structural drawings required for Dplans submission.' },
    { level: 'required', name: 'Licensed land surveyor', why: 'Sealed plot plan required before permit submission.' },
  ],
}

DURHAM_PROFESSIONALS.addition = DURHAM_PROFESSIONALS.reno = [
  { level: 'required', name: 'Licensed general contractor (GC)', why: 'Required if project cost exceeds $40,000. Verify license at nclbgc.org.' },
  { level: 'recommended', name: 'Licensed electrician', why: 'Required if scope includes electrical modifications. Trade permit via LDO portal.' },
  { level: 'recommended', name: 'Licensed plumber', why: 'Required if scope includes plumbing modifications. Trade permit via LDO portal.' },
  { level: 'optional', name: 'Designer or architect', why: 'Complex structural additions benefit from professional drawings for Dplans submission.' },
]

export const DURHAM_INSPECTIONS = {
  sfh: [
    'Footing / foundation',
    'Framing — after complete, before insulation',
    'Rough-in — electrical, plumbing, HVAC (before walls close)',
    'Insulation',
    'Final building',
    'Final electrical',
    'Final plumbing',
    'Final mechanical',
    'Certificate of compliance walkthrough',
  ],
  adu: ['Foundation', 'Framing', 'Rough-in', 'Final building', 'Certificate of compliance'],
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
    'Certificate of compliance (per unit)',
  ],
  addition: ['Footing / foundation (if applicable)', 'Framing', 'Rough-in', 'Final'],
  reno: ['Rough-in', 'Final'],
}

export const DURHAM_BUILDABILITY_CHECKS = (flags) => [
  {
    ok: true,
    title: 'Durham City-County jurisdiction confirmed',
    desc: 'Durham City and County share one unified building department. All permits processed through the same office at 101 City Hall Plaza.',
  },
  {
    ok: true,
    title: 'Dual portal system — Dplans + LDO',
    desc: 'Building and fire permits submit via Dplans. Trade permits (electrical, plumbing, mechanical), fees, and inspections go through the LDO portal. Both accounts needed.',
  },
  {
    ok: !flags.flood,
    title: flags.flood ? 'Floodplain overlay detected' : 'No floodplain overlay',
    desc: flags.flood
      ? 'FEMA elevation certificate required before permits can be issued. Durham has significant floodplain areas — hire a licensed NC surveyor immediately.'
      : 'No FEMA flood zone constraints detected on this parcel.',
  },
  {
    ok: !flags.historic,
    title: flags.historic ? 'Historic district overlay active' : 'No historic district overlay',
    desc: flags.historic
      ? 'Durham Historic Preservation Commission (HPC) approval required before building permit submission. Durham has multiple historic districts — adds 4–8 weeks.'
      : 'Parcel is not in a Durham historic district.',
  },
  {
    ok: !flags.septic,
    title: flags.septic ? 'Private septic — Durham County Environmental Health approval needed' : 'City water & sewer available',
    desc: flags.septic
      ? 'Durham County Environmental Health must approve septic/well design before city accepts permit application. Contact (919) 560-7600.'
      : 'City water and sewer available. Connection permit required through LDO portal.',
  },
  {
    ok: !flags.corner,
    title: flags.corner ? 'Corner lot — dual setbacks apply' : 'Standard lot setbacks apply',
    desc: flags.corner
      ? 'Corner lots in Durham have setback requirements on both street frontages per Durham UDO. Verify with your surveyor before finalizing plans.'
      : 'Standard front, rear, and side setbacks apply for your Durham zoning district.',
  },
]
