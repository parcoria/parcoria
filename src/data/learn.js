// src/data/learn.js
// Learning Center content 8 guides covering the most common owner-builder questions
// Each guide is free, SEO-optimized, and ends with a CTA to the permit wizard

export const GUIDES = [
  {
    slug: 'what-is-a-building-permit',
    title: 'What Is a Building Permit and Why Do You Need One?',
    description: 'A plain-English explanation of what building permits are, why they exist, and what happens if you skip one especially in Raleigh, Durham, and Wake County.',
    category: 'Fundamentals',
    readTime: '4 min',
    icon: '📋',
    intro: `If you're planning to build or renovate a home in the Research Triangle, you've probably heard the word "permit" more times than you can count. But what actually is a building permit and why does the government require one before you can build anything?`,
    sections: [
      {
        heading: 'The simple explanation',
        body: `A building permit is official permission from your local government to start construction. When you apply for a permit, a plan reviewer checks your drawings against the North Carolina Building Code to make sure your structure will be safe. Once construction starts, inspectors visit your site at key stages to confirm the work matches the approved plans.\n\nThink of it as a formal agreement between you and your city: you show them what you're building, they make sure it meets safety standards, and they give you the green light to proceed.`,
      },
      {
        heading: 'Why permits exist',
        body: `Permits aren't bureaucratic red tape for the sake of it. They exist because construction mistakes can be catastrophic  a house with improper electrical wiring burns down, a foundation built on unstable soil collapses, a deck with the wrong fasteners fails under load.\n\nThe permit process forces a licensed professional to review your plans and an independent inspector to verify the work before walls are closed up. Once drywall is up, nobody can check whether your framing is correct or your electrical is safe. The inspection stage is the last opportunity to catch problems before they become permanent.`,
      },
      {
        heading: 'What types of work require a permit in NC',
        body: `In North Carolina, you generally need a permit for:\n\n• Any new construction (homes, ADUs, additions, garages)\n• Structural changes  moving walls, adding beams, changing the roofline\n• Electrical work beyond simple fixture replacements\n• Plumbing work beyond simple fixture replacements\n• HVAC system installations and replacements\n• Decks over 30 inches above grade or attached to the house\n• Swimming pools and spas\n• Demolition\n\nYou typically don't need a permit for cosmetic work painting, flooring, cabinet replacements, and minor repairs that don't affect structure, electrical, plumbing, or HVAC.`,
      },
      {
        heading: 'What happens if you build without a permit',
        body: `Building without a permit is a serious mistake with real consequences:\n\n**Stop-work order.** An inspector or neighbor can report unpermitted construction. The city issues a stop-work order and all work halts immediately.\n\n**Retroactive permit.** You'll have to apply for a permit after the fact. Inspectors may require you to open walls, expose wiring, or tear out completed work so they can verify it was done correctly.\n\n**Fines.** Most NC municipalities charge double the permit fee for unpermitted work, plus investigation fees.\n\n**Certificate of Occupancy denial.** You cannot legally occupy a new home without a CO. No permit means no CO.\n\n**Sale complications.** When you sell, unpermitted work appears in title searches and municipal records. Buyers can walk away or demand the work be permitted retroactively often at significant cost.\n\n**Insurance denial.** If an unpermitted structure catches fire or collapses, your insurer may deny the claim.`,
      },
      {
        heading: 'How the permit process works in the Triangle',
        body: `Each city handles permits slightly differently, but the general flow is the same:\n\n1. You (or your contractor) submit permit applications and construction drawings\n2. Plan reviewers check the drawings against NC Building Code this takes days to weeks depending on the jurisdiction\n3. Once approved, the permit is issued and posted on the job site\n4. Construction begins\n5. Inspectors visit at key stages: foundation, framing, rough-in (electrical/plumbing/HVAC), insulation, and final\n6. All inspections pass → Certificate of Occupancy issued → you can legally occupy the home\n\nIn Durham, building permits go through Dplans and trade permits through the LDO portal. In Raleigh, everything flows through the City of Raleigh permit portal. In Apex, plans are submitted via IDT Plans and fees paid via ePermits. Each city has its own quirks which is exactly why Parcoria exists.`,
      },
    ],
    cta: {
      text: 'See exactly which permits your project needs',
      sub: 'Enter your address and project type Parcoria maps every permit, in the right order, for your specific jurisdiction.',
      button: 'Run my permit roadmap →',
      link: '/wizard',
    },
  },
  {
    slug: 'what-is-a-lien-agent-nc',
    title: 'What Is a Lien Agent in NC and When Do You Need One?',
    description: 'North Carolina requires a lien agent for all construction projects $40,000 or more. Here\'s what it is, why it exists, and how to file one before your permit is issued.',
    category: 'Legal & Financial',
    readTime: '5 min',
    icon: '📎',
    intro: `If you're building or renovating a home in North Carolina and your project costs $40,000 or more, you're required by law to designate a lien agent before you can pull a permit. Most first-time builders have never heard of this and it's one of the most common reasons permit applications get delayed.`,
    sections: [
      {
        heading: 'What a lien agent is',
        body: `A lien agent is a neutral third party typically a title insurance company that NC law requires you to designate on any construction project costing $40,000 or more. Their job is to receive and record lien notices from contractors, subcontractors, and suppliers who work on your project.\n\nWhen you hire a GC who hires subcontractors who buy materials from suppliers, there's a chain of people who have a right to be paid. If someone in that chain doesn't get paid, they can file a mechanic's lien against your property which can prevent you from selling or refinancing the home.\n\nThe lien agent system creates a central place where everyone in that chain can file notice of their involvement in the project. This protects both you (you know who's working on your project) and them (they have a formal mechanism to assert their right to payment).`,
      },
      {
        heading: 'When you need one',
        body: `North Carolina General Statute §44A-11.1 requires a lien agent for all private construction projects where the total cost of improvements is $40,000 or more. This applies to:\n\n• New home construction\n• Additions and renovations over $40,000\n• ADUs in most cases\n• Commercial construction\n\nThe lien agent must be designated BEFORE the first visible commencement of the improvement meaning before any work starts on site, including site clearing, grading, or foundation work. Permit issuance is typically contingent on lien agent designation for qualifying projects.`,
      },
      {
        heading: 'How to designate a lien agent',
        body: `The process takes about 10 minutes and costs $25–$50.\n\n1. Go to liensnc.com the official NC lien agent filing portal\n2. Create an account or log in\n3. Enter your project address and property information\n4. Select a lien agent from the list (First American, Old Republic, Stewart Title, and others are available)\n5. Pay the filing fee online\n6. Download your lien agent certificate\n7. Post the certificate at the job site this is required by law\n8. Include the lien agent information on your permit application\n\nThe permit office will verify lien agent designation before issuing your permit on $40,000+ projects.`,
      },
      {
        heading: 'What happens if you skip it',
        body: `Skipping the lien agent designation is a serious mistake:\n\n**Permit denial.** Most NC municipalities will not issue a building permit for a $40,000+ project without lien agent documentation.\n\n**Personal liability.** Without a lien agent, subcontractors and suppliers who don't get paid have limited protection but you have less protection too. Lien disputes without a formal agent can become expensive litigation.\n\n**Project delays.** Realizing you need a lien agent after you've broken ground means stopping work until it's sorted out.\n\nDesignating a lien agent is one of the first things you should do when planning a project over $40,000 before you hire a GC, before you submit permit applications, before you touch the ground.`,
      },
    ],
    cta: {
      text: 'See if your project requires a lien agent',
      sub: 'Parcoria\'s permit wizard flags lien agent requirements automatically based on your project cost and type.',
      button: 'Check my project →',
      link: '/wizard',
    },
  },
  {
    slug: 'owner-builder-nc',
    title: 'How to Act as Your Own General Contractor in NC',
    description: 'North Carolina allows homeowners to act as their own GC under specific conditions. Here\'s what the Owner Exemption Affidavit means, what you can legally do, and the key restrictions you need to know.',
    category: 'Owner-Builder',
    readTime: '6 min',
    icon: '🏗️',
    intro: `In North Carolina, you don't always need to hire a licensed General Contractor to build your own home. The NC Owner Exemption allows homeowners to act as their own GC under specific conditions and it can save you 15–25% on construction costs. But it comes with real legal restrictions that most people don't know about until it's too late.`,
    sections: [
      {
        heading: 'What the Owner Exemption actually says',
        body: `North Carolina General Statute §87-1 requires a licensed GC for any construction project valued at $40,000 or more unless the owner qualifies for the exemption.\n\nThe exemption allows you to act as your own GC if:\n\n1. You own the property (or will own it upon completion)\n2. You intend to personally occupy the home as your primary residence\n3. You will directly supervise the work\n4. You file an Owner Exemption Affidavit with the permit office\n\nThe key word is "personally occupy." The exemption is designed for people building their own home to live in not for investors or developers building for resale.`,
      },
      {
        heading: 'The resale restriction the one most people miss',
        body: `This is the most important thing to understand about the Owner Exemption:\n\n**You cannot sell a home built under the Owner Exemption within 12 months of receiving the Certificate of Occupancy.**\n\nNC law presumes that if you sell within 12 months, you built the home for profit which means you should have had a licensed GC. Selling within that window creates legal exposure and can trigger complaints to the NC Licensing Board for General Contractors.\n\nIf you're planning to build and sell, you need a licensed GC. Full stop. The Owner Exemption is only for homes you genuinely intend to live in.`,
      },
      {
        heading: 'What you can and cannot do as an owner-builder',
        body: `As an owner-builder under the exemption, you can:\n\n• Act as the GC and coordinate all trades\n• Hire licensed subcontractors (electricians, plumbers, HVAC) directly\n• Do some of the physical work yourself (framing, painting, flooring, finish work)\n• Submit permit applications in your own name\n\nYou cannot:\n\n• Do your own electrical work NC requires licensed electricians for all electrical work beyond minor repairs\n• Do your own plumbing rough-in licensed plumbers required\n• Do your own HVAC installation licensed mechanical contractors required\n• Skip the lien agent if your project is $40,000+\n• Claim the exemption if you're building for someone else\n\nThe trades requiring licensed contractors are non-negotiable regardless of owner-builder status.`,
      },
      {
        heading: 'How to file the Owner Exemption Affidavit',
        body: `The affidavit is filed at the permit office when you apply for your building permit. The process varies slightly by jurisdiction:\n\n**Raleigh:** Available at the City of Raleigh permit portal. Submit with your building permit application.\n\n**Durham:** File through Dplans (building permit) and note the exemption in your application. Durham staff will review.\n\n**Wake County municipalities (Apex, Holly Springs, Wake Forest, Morrisville):** Available at each town's permit office. Some require in-person acknowledgment.\n\n**Garner:** Submit through the SmartGov portal with your permit application.\n\nBe prepared to sign a sworn statement that you intend to occupy the home. Permit reviewers take this seriously.`,
      },
      {
        heading: 'The honest reality of being your own GC',
        body: `Acting as your own GC can save significant money but it requires a lot of time, coordination, and tolerance for stress. You become responsible for:\n\n• Hiring and managing all subcontractors\n• Scheduling inspections and coordinating inspector access\n• Ensuring each trade is complete before the next one starts\n• Managing the permit timeline and responding to correction notices\n• Handling lien agent filings and payment documentation\n\nMost first-time owner-builders underestimate how much coordination is involved. Having Parcoria map your permit sequence, explain each inspection, and give you an AI Concierge to ask questions is exactly the support system that makes owner-building realistic.`,
      },
    ],
    cta: {
      text: 'Get your owner-builder permit roadmap',
      sub: 'Parcoria shows you every permit, every inspection, and every professional required for your specific project and jurisdiction.',
      button: 'Start my owner-builder roadmap →',
      link: '/wizard',
    },
  },
  {
    slug: 'framing-inspection-guide',
    title: 'What Happens at a Framing Inspection?',
    description: 'The framing inspection is one of the most important and most failed inspections in residential construction. Here\'s exactly what the inspector checks and how to prepare.',
    category: 'Inspections',
    readTime: '5 min',
    icon: '🔍',
    intro: `The framing inspection happens after all rough framing is complete and before insulation or drywall goes up. It's one of the most critical inspections in the entire construction process and one of the most commonly failed. Here's exactly what the inspector looks for and how to make sure you're ready.`,
    sections: [
      {
        heading: 'When the framing inspection happens',
        body: `The framing inspection is scheduled after:\n\n• All structural framing (walls, floors, roof) is complete\n• All rough-in work is complete electrical wiring, plumbing pipes, HVAC ducts are all run through the framing\n• All penetrations through framing members are made\n• Fireblocking and draftstopping are in place\n\nCritically: insulation and drywall cannot go up until the framing inspection passes. The inspector needs to see everything while it's still exposed. Covering framing before inspection is one of the fastest ways to fail and trigger a re-inspection.`,
      },
      {
        heading: 'What the inspector checks',
        body: `A thorough framing inspector will check:\n\n**Structural members:**\n• Lumber species and grade match the approved plans\n• Stud spacing and size are correct for each wall type\n• Headers above openings are correctly sized and supported\n• Floor joist spans don't exceed allowable limits\n• Roof rafters or trusses are properly connected and braced\n• Ridge boards, hip rafters, and valley rafters are correctly sized\n\n**Connections:**\n• All structural connections use correct hardware (joist hangers, hurricane ties, hold-downs)\n• Shear wall nailing pattern matches the structural drawings\n• LVL beams have proper bearing and connections at each end\n\n**Penetrations:**\n• Notches and holes in structural members don't exceed code limits\n• Pipes and wires through studs are protected with nail plates where required\n\n**Fireblocking:**\n• Fireblocking in place at floor-ceiling intersections, top and bottom of stairs, and concealed horizontal spaces\n\n**Braced wall panels:**\n• Braced wall panel locations, nailing, and connections match the braced wall plan`,
      },
      {
        heading: 'Most common reasons framing inspections fail',
        body: `Based on what inspectors commonly flag in Wake County and Durham:\n\n**Missing or incorrect hurricane ties.** Required on every rafter-to-wall plate connection in NC. Frequently missed on additions and renovations.\n\n**Oversized notches or holes in structural members.** Drilling or notching framing for pipes or wires beyond code limits weakens the member. The rule: notches in studs can't exceed 25% of the stud depth; holes can't exceed 40%.\n\n**Missing fireblocking.** Fireblocking in concealed spaces is easy to forget and hard to see once framing is complete. Inspectors look carefully for this.\n\n**Wrong header size.** Headers over doors and windows carry floor and roof loads. Undersized headers are a structural safety issue.\n\n**Missing nail plates.** Any pipe or wire within 1.25 inches of the face of a framing member needs a nail plate to protect it from future fasteners.\n\n**Shear wall nailing doesn't match plans.** Structural drawings specify exact nailing patterns for shear walls. Inspectors verify nail size, spacing, and edge distance.`,
      },
      {
        heading: 'How to schedule a framing inspection in the Triangle',
        body: `Each jurisdiction handles inspection scheduling differently:\n\n**Raleigh:** Schedule through the City of Raleigh permit portal. Request by 3 PM for next business day.\n\n**Durham:** Schedule through the LDO portal at ldo4.durhamnc.gov.\n\n**Apex:** Schedule by 2 PM the day before via IDT Plans portal or call (919) 249-3388. Wake County performs all inspections.\n\n**Holly Springs:** Request through CityView Portal or call 311. Before 4 PM = next day.\n\n**Wake Forest:** Request through IDT Plans portal before 3 PM for next business day.\n\n**Morrisville:** Schedule through CSS Portal no phone requests accepted.\n\n**Garner:** Schedule through SmartGov Portal. 24-hour notice required. No same-day inspections.\n\nHave your permit number ready when you schedule. Make sure the site is accessible and the permit card is posted visibly.`,
      },
    ],
    cta: {
      text: 'See your full inspection sequence',
      sub: 'Parcoria shows every inspection in order for your specific project type and jurisdiction.',
      button: 'View my inspection timeline →',
      link: '/wizard',
    },
  },
  {
    slug: 'certificate-of-occupancy',
    title: 'What Is a Certificate of Occupancy and How Do You Get One?',
    description: 'You cannot legally live in a new home without a Certificate of Occupancy. Here\'s what it is, what triggers its issuance, and what to do if your CO is delayed.',
    category: 'Fundamentals',
    readTime: '4 min',
    icon: '🏠',
    intro: `A Certificate of Occupancy called a CO is the document your municipality issues when construction is complete and your home is safe to occupy. Without it, you cannot legally move in. It's the final checkpoint in the entire permit process, and it's often the most anxiously awaited piece of paper in a construction project.`,
    sections: [
      {
        heading: 'What a CO confirms',
        body: `The CO is a formal declaration by your local government that:\n\n• All required permits were obtained\n• All required inspections were completed and passed\n• The building complies with the NC Building Code and local ordinances\n• The structure is safe for human occupancy\n\nFor new construction, a CO is required before anyone moves in. For additions and renovations that create new livable space, a CO (or partial CO) is typically required before the new space can be used.`,
      },
      {
        heading: 'What has to happen before a CO is issued',
        body: `Every single inspection in your permit sequence must pass before a CO can be issued. This means:\n\n• Final building inspection\n• Final electrical inspection\n• Final plumbing inspection\n• Final mechanical (HVAC) inspection\n• Final fire inspection (if applicable)\n• Any specialty inspections required for your project\n\nBeyond inspections, most jurisdictions also require:\n\n• All permit fees paid in full (including any reinspection fees)\n• Any outstanding correction notices resolved\n• Addressing confirmed with the county E911 system\n• Driveway access confirmed\n• In Chapel Hill: CAPS certificate obtained before CO is issued`,
      },
      {
        heading: 'Common reasons CO issuance is delayed',
        body: `**Outstanding failed inspection.** The most common cause. One failed final inspection stops the CO until the issue is corrected and reinspected.\n\n**Unpaid fees.** Many jurisdictions won't issue a CO until all fees are paid, including reinspection fees from earlier in the project.\n\n**Missing utility confirmation.** Some jurisdictions require confirmation that permanent power, water, and sewer connections are active before issuing a CO.\n\n**Address not in E911 system.** New addresses need to be registered with the county before a CO can be issued. This sometimes falls through the cracks on new lots.\n\n**Incomplete site work.** Driveways, grading, erosion control, and landscaping requirements vary by jurisdiction. Some require site work completion before CO.`,
      },
      {
        heading: 'Temporary CO vs final CO',
        body: `Some jurisdictions issue a Temporary Certificate of Occupancy (TCO) that allows you to occupy the home while minor outstanding items are completed. A TCO has an expiration date typically 30–90 days and you must complete the remaining items and get a final CO before it expires.\n\nA TCO is not a substitute for a final CO. If your TCO expires without a final CO being issued, you're technically in violation of your occupancy status. Stay on top of the outstanding items list.`,
      },
    ],
    cta: {
      text: 'Track every step to your Certificate of Occupancy',
      sub: 'Parcoria maps your full permit and inspection sequence from application to CO for your specific jurisdiction.',
      button: 'Start my permit roadmap →',
      link: '/wizard',
    },
  },
  {
    slug: 'wake-county-vs-city-permits',
    title: 'Wake County vs City Permits What\'s the Difference?',
    description: 'Most homeowners in the Triangle don\'t realize their project requires permits from two different governments. Here\'s how the city-county split works and why it matters.',
    category: 'Jurisdictions',
    readTime: '4 min',
    icon: '🗺️',
    intro: `One of the most confusing aspects of building in the Research Triangle is that your project often requires permits and approvals from two separate government bodies your city and Wake County. They handle different things, use different portals, and have different timelines. Mixing them up causes delays.`,
    sections: [
      {
        heading: 'What cities handle vs what Wake County handles',
        body: `In most Wake County municipalities, the split works like this:\n\n**Your city handles:**\n• Building permit applications and plan review\n• Zoning compliance\n• Fee collection\n• Certificate of Occupancy issuance\n• Utility connections (water and sewer)\n\n**Wake County handles:**\n• Field inspections for most jurisdictions\n• Environmental Health (septic and well approvals)\n• E911 addressing\n• Register of Deeds (survey and deed filing)\n\nThis means you apply for permits with your city but the inspector who shows up at your job site works for Wake County not the city. They're looking at the same NC Building Code, but they're different people in different departments.`,
      },
      {
        heading: 'The exception Garner',
        body: `Garner is the most important exception in Wake County: **Garner performs its own field inspections through the Garner Inspections Department.** Wake County does not inspect in Garner.\n\nThis matters because Garner's inspection scheduling works differently you must request through the SmartGov portal with 24-hour notice, no same-day inspections are available, and no phone or email requests are accepted.\n\nDurham is also its own case Durham City-County handles both permits AND inspections through a single integrated department.`,
      },
      {
        heading: 'Why this creates confusion',
        body: `The most common source of confusion is inspection scheduling. A homeowner applies for their Raleigh building permit through the City of Raleigh portal, but when they go to schedule a framing inspection, they sometimes call Raleigh and get told to contact Wake County. Then they call Wake County and aren't sure which department to reach.\n\nThe answer: in Raleigh, Apex, Holly Springs, Wake Forest, and Morrisville, inspection requests go through the city's permit portal but Wake County inspectors show up. The city portal is just the scheduling mechanism.\n\nIn Durham and Chapel Hill, inspections are handled by the city directly. In Garner, inspections are handled by the town directly through SmartGov.`,
      },
      {
        heading: 'Septic and well Wake County Environmental Services',
        body: `If your property uses a private well or septic system rather than city utilities, Wake County Environmental Services must approve your system before your city will accept most permit applications.\n\nThis is a separate process from your building permit it involves a site evaluation, soil testing, and system design approval. It can take several weeks and should be started early in your project planning.\n\nContact Wake County Environmental Services at (919) 856-7400 before you begin permit applications if your property has a private well or septic.`,
      },
    ],
    cta: {
      text: 'Get a permit roadmap that accounts for every agency',
      sub: 'Parcoria automatically handles the city-county split for your jurisdiction you see every permit from every agency in one place.',
      button: 'Run my permit roadmap →',
      link: '/wizard',
    },
  },
  {
    slug: 'how-long-do-permits-take',
    title: 'How Long Does It Really Take to Get a Permit in the Triangle?',
    description: 'Permit timelines vary wildly by jurisdiction and project type. Here\'s what to realistically expect in Raleigh, Durham, Chapel Hill, Apex, and other Wake County cities in 2025.',
    category: 'Planning',
    readTime: '5 min',
    icon: '📅',
    intro: `"How long will permits take?" is the question every owner-builder and first-time developer asks and the honest answer is: it depends. It depends on where you're building, what you're building, whether your drawings are complete, and what time of year you submit. Here's a realistic breakdown for each Triangle jurisdiction.`,
    sections: [
      {
        heading: 'The phases that eat your timeline',
        body: `Permit timelines break down into distinct phases, each with its own duration:\n\n**Plan review:** the time from submission to permit issuance. This is where most delays happen. Reviewers check drawings against the NC Building Code and flag corrections. Complex projects or incomplete drawings get comment letters that restart the clock.\n\n**Correction response:** if your plans get comments, you revise and resubmit. Each round adds time. Well-prepared drawings by an experienced architect or designer can eliminate this phase entirely.\n\n**Permit issuance:** once plans are approved, fees are paid, and any prerequisites (lien agent, zoning approval) are satisfied, the permit is issued.\n\n**Construction and inspections:** inspections happen throughout construction. Failed inspections add re-inspection delays.`,
      },
      {
        heading: 'Realistic timelines by jurisdiction',
        body: `**Raleigh:** Plan review for residential new construction typically runs 10–15 business days for complete submissions. Raleigh processes high volumes complex projects or peak seasons can extend this to 4–6 weeks. Express review options exist for an additional fee.\n\n**Durham:** Durham uses separate portals for building (Dplans) and trade permits (LDO). Budget 10–20 business days for plan review. The dual-portal requirement adds administrative time make sure you're applying in the right system for each permit type.\n\n**Chapel Hill:** Chapel Hill is thorough and often takes longer than Wake County municipalities budget 3–5 weeks for plan review on new construction. The CAPS certificate requirement adds time at the beginning.\n\n**Apex:** IDT Plans submissions typically reviewed in 10–15 business days. Apex is one of the faster Wake County municipalities for residential permitting.\n\n**Holly Springs:** CityView Portal. Similar to Apex 10–15 business days typical, longer during peak construction season.\n\n**Wake Forest:** IDT Plans portal. 10–15 business days typical for complete submissions.\n\n**Morrisville:** CSS Portal. 10–15 business days typical.\n\n**Garner:** SmartGov Portal. 10–20 business days. Note that Garner self-performs inspections factor in the 24-hour scheduling requirement.`,
      },
      {
        heading: 'What makes projects take longer',
        body: `**Incomplete or incorrect drawings.** The single biggest cause of delays. Comment letters mean resubmission which restarts the review clock. Hire an experienced architect or designer who knows the local requirements.\n\n**Missing prerequisites.** Forgetting the lien agent, CAPS certificate in Chapel Hill, or Wake County Environmental Services approval for septic these stop permit issuance regardless of how fast plan review goes.\n\n**Peak construction season.** Spring and summer in the Triangle bring high permit volumes. December and January are typically faster.\n\n**Revision cycles.** Every plan review comment that requires a revision adds 5–10 business days minimum.\n\n**Failed inspections.** Each failed inspection requires scheduling a re-inspection, which can add days to weeks depending on inspector availability.`,
      },
      {
        heading: 'How to move faster',
        body: `**Submit complete, correct drawings on the first try.** This is the highest-leverage action. An architect or designer who regularly works with your jurisdiction will know exactly what reviewers look for.\n\n**Start prerequisites early.** Lien agent, CAPS, septic approval get these started before you submit permits.\n\n**Use concurrent submissions.** Building, electrical, plumbing, and mechanical permits can usually be submitted simultaneously. Don't wait for building permit approval before submitting trade permits.\n\n**Pay for expedited review where available.** Raleigh offers express review for an additional fee. Worth it if schedule is tight.\n\n**Respond to correction letters immediately.** Comment letters start a clock. Slow responses mean slow permits.`,
      },
    ],
    cta: {
      text: 'See your specific timeline estimate',
      sub: 'Parcoria estimates permit timelines based on your project type and jurisdiction so you can plan your construction schedule accurately.',
      button: 'Get my timeline estimate →',
      link: '/wizard',
    },
  },
  {
    slug: 'how-to-read-a-permit-application',
    title: 'How to Read a Permit Application',
    description: 'Permit applications ask for information most first-time builders don\'t know off the top of their head. Here\'s what each field means and where to find the answers.',
    category: 'Fundamentals',
    readTime: '5 min',
    icon: '📝',
    intro: `If you've never pulled a building permit before, your first look at a permit application can be overwhelming. Permit applications ask for information you might not know offhand zoning classifications, construction valuation, square footages, and technical codes. Here's a plain-English guide to what each section means and where to find the answers.`,
    sections: [
      {
        heading: 'Property information',
        body: `**PIN (Parcel Identification Number):** Every property in NC has a unique PIN assigned by the county. You can find yours on the county GIS website search by address and the PIN will appear in the property details. In Wake County, go to wake.gov/departments/tax/real-estate-search. In Durham, use maps.durhamnc.gov.\n\n**Zoning classification:** Your zoning district (RS-10, RS-20, MX, etc.) determines what you can build and how close to property lines. You can find your zoning on your city's GIS map or by calling the planning department.\n\n**Legal description:** The formal description of your property from the deed. Found on your property deed at the county Register of Deeds, or in your title insurance policy.`,
      },
      {
        heading: 'Construction information',
        body: `**Occupancy classification:** For residential construction, this is almost always R-3 (one and two family dwellings) or R-2 (multi-family). Your architect will specify this.\n\n**Construction type:** Describes the materials and fire-resistance of the structure. Most residential new construction is Type V-B (wood frame, unprotected). Your architect specifies this.\n\n**Gross floor area:** The total floor area of the structure in square feet, measured to the exterior walls. Include all floors, finished basement space, and attached garage.\n\n**Valuation:** The estimated total cost of construction. This is used to calculate permit fees. Most jurisdictions use the ICC Building Valuation Data or your actual contract value use the higher number. Undervaluing your project is not a good strategy; reviewers are familiar with typical costs and will question suspiciously low numbers.`,
      },
      {
        heading: 'Contractor information',
        body: `If you're using a licensed GC, they'll complete this section with their NC license number. If you're filing under the Owner Exemption, you'll fill in your own information and check the owner-builder box.\n\nAll trade contractors (electrician, plumber, HVAC) should be listed with their individual license numbers in the appropriate sections. Never list an unlicensed contractor it creates liability for you and can invalidate your permit.\n\nContractor license numbers can be verified at:\n• GC: portal.nclbgc.org/public/search\n• Electrical: ncbeec.org\n• Plumbing/HVAC: nclicensing.org`,
      },
      {
        heading: 'Drawings and supporting documents',
        body: `Most jurisdictions require the following with a residential building permit application for new construction:\n\n• Site plan (drawn to scale, showing building footprint, distances to property lines, driveway, impervious surface)\n• Floor plans (each level, with room dimensions and window/door sizes)\n• Elevations (all four sides of the building)\n• Cross-section (showing wall, floor, and roof assembly)\n• Foundation plan\n• Framing plans (floor and roof)\n• Electrical plan\n• Energy compliance documentation (NC Energy Code compliance REScheck or equivalent)\n• Braced wall plan (per IRC Chapter 6)\n\nDrawings should be to scale and clearly dimensioned. Vague or incomplete drawings are the number one cause of plan review comments.`,
      },
    ],
    cta: {
      text: 'Know exactly what your application needs',
      sub: 'Parcoria\'s permit wizard lists every required document for your specific project type and jurisdiction.',
      button: 'Build my permit checklist →',
      link: '/wizard',
    },
  },
]

export const CATEGORIES = [...new Set(GUIDES.map(g => g.category))]

export function getGuideBySlug(slug) {
  return GUIDES.find(g => g.slug === slug) || null
}
