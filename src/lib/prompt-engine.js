// src/lib/prompt-engine.js
// "What to do this week" — generates one actionable sentence per permit event
// Used by: Dashboard (inline prompt) + weekly digest email
// No new data sources needed — pure logic on top of lifecycle data

// ─── Jurisdiction contact info ────────────────────────────────────────────────

const JUR_CONTACTS = {
  durham: {
    building: { name: 'Durham Inspections',    phone: '(919) 560-4144', portal: 'dplans.durhamnc.gov' },
    trade:    { name: 'Durham LDO Portal',     phone: '(919) 560-4144', portal: 'ldo4.durhamnc.gov/DurhamWeb' },
  },
  raleigh: {
    building: { name: 'Raleigh Planning & Development', phone: '919-996-2500', portal: 'permitportal.raleighnc.gov' },
    trade:    { name: 'Raleigh Planning & Development', phone: '919-996-2500', portal: 'permitportal.raleighnc.gov' },
  },
  chapelhill: {
    building: { name: 'Chapel Hill Inspections', phone: '(919) 968-2728', portal: 'chapelhillnc.portal.opengov.com' },
    trade:    { name: 'Chapel Hill Inspections', phone: '(919) 968-2728', portal: 'chapelhillnc.portal.opengov.com' },
  },
  cary: {
    building: { name: 'Cary Inspections', phone: '(919) 469-4075', portal: 'coap.townofcary.org' },
    trade:    { name: 'Cary Inspections', phone: '(919) 469-4075', portal: 'cary-egov.aspgov.com/Click2GovBP' },
  },
  apex: {
    building: { name: 'Apex Inspections', phone: '(919) 249-3394', portal: 'myidtplans.com' },
    trade:    { name: 'Apex Inspections', phone: '(919) 249-3394', portal: 'myidtplans.com' },
  },
  hollysprings: {
    building: { name: 'Holly Springs Inspections', phone: '(919) 557-3951', portal: 'cityview.hollyspringsnc.us/portal' },
    trade:    { name: 'Holly Springs Inspections', phone: '(919) 557-3951', portal: 'cityview.hollyspringsnc.us/portal' },
  },
  wakeforest: {
    building: { name: 'Wake Forest Inspections', phone: '(919) 435-9400', portal: 'wakeforest.idtplans.com' },
    trade:    { name: 'Wake Forest Inspections', phone: '(919) 435-9400', portal: 'wakeforest.idtplans.com' },
  },
  morrisville: {
    building: { name: 'Morrisville Inspections', phone: '(919) 463-6200', portal: 'morrisvillenc.gov/Services-Forms/E-Permits-Applications' },
    trade:    { name: 'Morrisville Inspections', phone: '(919) 463-6200', portal: 'morrisvillenc.gov/Services-Forms/E-Permits-Applications' },
  },
  garner: {
    building: { name: 'Garner Inspections', phone: '(919) 772-4688', portal: 'twn-garner-nc.smartgovcommunity.com' },
    trade:    { name: 'Garner Inspections', phone: '(919) 772-4688', portal: 'twn-garner-nc.smartgovcommunity.com' },
  },
  fuquayvarina: {
    building: { name: 'Fuquay-Varina Inspections', phone: '(919) 552-1400', portal: 'fuquay-varina.org/238/E-Permits-Online' },
    trade:    { name: 'Fuquay-Varina Inspections', phone: '(919) 552-1400', portal: 'fuquay-varina.org/238/E-Permits-Online' },
  },
}

function getContact(jurisdiction, permitType) {
  const jur = JUR_CONTACTS[jurisdiction] || JUR_CONTACTS.raleigh
  const isTradePermit = ['electrical', 'plumbing', 'mechanical'].includes(permitType)
  return isTradePermit ? jur.trade : jur.building
}

// ─── Days in review calculator ────────────────────────────────────────────────

function daysSince(dateStr) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Core prompt generator ────────────────────────────────────────────────────
// Returns { text, urgency, action }
// urgency: 'critical' | 'warning' | 'info' | 'good'
// action: optional { label, url, phone }

export function generatePermitPrompt(event, jurisdiction) {
  const contact = getContact(jurisdiction, event.permit_type)
  const reviewDays = daysSince(event.applied_date)
  const estDays = event.est_days || 21

  switch (event.stage) {
    case 'not_started':
      if (event.permit_type === 'lien_agent') {
        return {
          urgency: 'warning',
          text: `Lien agent appointment required before construction begins — costs ~$50 online.`,
          action: { label: 'Appoint at liensnc.com', url: 'https://www.liensnc.com' },
        }
      }
      if (event.permit_type === 'survey') {
        return {
          urgency: 'info',
          text: `Order your lot survey early — surveyors in the Triangle are booking 3–4 weeks out.`,
          action: null,
        }
      }
      return {
        urgency: 'info',
        text: `Ready to apply for your ${event.permit_name.toLowerCase()}? Pre-fill the application in Parcoria.`,
        action: { label: 'Pre-fill application', url: null }, // resolved by caller
      }

    case 'applied':
      if (reviewDays === null) {
        return {
          urgency: 'info',
          text: `${event.permit_name} submitted — mark the date you applied to track review time.`,
          action: null,
        }
      }
      if (reviewDays > estDays + 3) {
        return {
          urgency: 'critical',
          text: `${event.permit_name} has been in review ${reviewDays} days — ${jurisdiction === 'durham' ? 'Durham\'s' : 'typical'} average is ${estDays} days. Call ${contact.name} to check status.`,
          action: { label: `Call ${contact.phone}`, phone: contact.phone },
        }
      }
      if (reviewDays > estDays - 3) {
        return {
          urgency: 'warning',
          text: `${event.permit_name} is approaching the expected ${estDays}-day review window (day ${reviewDays}). Check your portal for updates.`,
          action: { label: `Check ${contact.portal}`, url: `https://${contact.portal}` },
        }
      }
      return {
        urgency: 'info',
        text: `${event.permit_name} in review — day ${reviewDays} of ~${estDays}. No action needed yet.`,
        action: null,
      }

    case 'in_review':
      if (reviewDays !== null && reviewDays > estDays + 3) {
        return {
          urgency: 'critical',
          text: `${event.permit_name} review is running long at ${reviewDays} days (avg ${estDays}). Contact ${contact.name} at ${contact.phone}.`,
          action: { label: `Call ${contact.phone}`, phone: contact.phone },
        }
      }
      return {
        urgency: 'info',
        text: `${event.permit_name} under review — check ${contact.portal} for status updates.`,
        action: { label: `Check portal`, url: `https://${contact.portal}` },
      }

    case 'approved':
      return {
        urgency: 'warning',
        text: `${event.permit_name} approved — record your permit number in Parcoria and post the permit on-site before work begins.`,
        action: null,
      }

    case 'issued': {
      const expiryDays = event.expiry_date ? daysUntil(event.expiry_date) : null
      if (expiryDays !== null && expiryDays <= 30) {
        return {
          urgency: 'critical',
          text: `${event.permit_name} expires in ${expiryDays} days — schedule your first inspection immediately or the permit lapses.`,
          action: { label: `Schedule at ${contact.portal}`, url: `https://${contact.portal}` },
        }
      }
      return {
        urgency: 'warning',
        text: `${event.permit_name} issued — schedule your first inspection through ${contact.name}.`,
        action: { label: `Schedule at ${contact.portal}`, url: `https://${contact.portal}` },
      }
    }

    case 'inspections': {
      const expiryDays = event.expiry_date ? daysUntil(event.expiry_date) : null
      if (expiryDays !== null && expiryDays <= 14) {
        return {
          urgency: 'critical',
          text: `Permit expires in ${expiryDays} days — complete remaining inspections before ${new Date(event.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`,
          action: { label: `Call ${contact.phone}`, phone: contact.phone },
        }
      }
      return {
        urgency: 'info',
        text: `Inspections in progress for ${event.permit_name} — keep the inspection sequence on track.`,
        action: null,
      }
    }

    case 'on_hold':
      return {
        urgency: 'critical',
        text: `${event.permit_name} is on hold — contact ${contact.name} at ${contact.phone} to resolve the issue.`,
        action: { label: `Call ${contact.phone}`, phone: contact.phone },
      }

    case 'rejected':
      return {
        urgency: 'critical',
        text: `${event.permit_name} was rejected — review the rejection reason, correct the application, and resubmit.`,
        action: { label: `Resubmit at ${contact.portal}`, url: `https://${contact.portal}` },
      }

    case 'complete':
      return {
        urgency: 'good',
        text: `${event.permit_name} complete. ✓`,
        action: null,
      }

    default:
      return null
  }
}

// ─── Project-level summary ────────────────────────────────────────────────────
// Returns the single most important prompt for a project
// Used by dashboard "what to do this week" banner

export function getProjectWeeklyPrompt(project, lifecycle) {
  if (!lifecycle?.events?.length) return null

  const { events, inspections, overdueDeadlines, upcomingDeadlines } = lifecycle
  const jurisdiction = project.jurisdiction || 'raleigh'

  // Priority 1: overdue deadlines
  if (overdueDeadlines?.length > 0) {
    const dl = overdueDeadlines[0]
    return {
      urgency: 'critical',
      text: `⚠️ ${dl.label} is overdue by ${Math.abs(Math.ceil((new Date(dl.due_date) - new Date()) / 86400000))} days.`,
      action: null,
      projectId: project.id,
      projectName: project.name || project.address,
    }
  }

  // Priority 2: critical permit issues (on_hold, rejected, long review)
  const criticalEvents = events
    .map(e => ({ event: e, prompt: generatePermitPrompt(e, jurisdiction) }))
    .filter(({ prompt }) => prompt?.urgency === 'critical')

  if (criticalEvents.length > 0) {
    const { event, prompt } = criticalEvents[0]
    return { ...prompt, projectId: project.id, projectName: project.name || project.address }
  }

  // Priority 3: upcoming deadlines (within 7 days)
  if (upcomingDeadlines?.length > 0) {
    const dl = upcomingDeadlines[0]
    const days = Math.ceil((new Date(dl.due_date) - new Date()) / 86400000)
    return {
      urgency: 'warning',
      text: `📅 ${dl.label} due in ${days} day${days !== 1 ? 's' : ''}.`,
      action: null,
      projectId: project.id,
      projectName: project.name || project.address,
    }
  }

  // Priority 4: failed inspections
  const failedInspections = inspections?.filter(i => i.status === 'failed' || i.status === 're_inspection_required') || []
  if (failedInspections.length > 0) {
    return {
      urgency: 'warning',
      text: `Re-inspection required for ${failedInspections[0].label} — schedule through your jurisdiction portal.`,
      action: null,
      projectId: project.id,
      projectName: project.name || project.address,
    }
  }

  // Priority 5: next actionable permit (in progress)
  const actionableEvents = events
    .filter(e => !['not_started', 'complete'].includes(e.stage))
    .map(e => ({ event: e, prompt: generatePermitPrompt(e, jurisdiction) }))
    .filter(({ prompt }) => prompt?.urgency === 'warning')

  if (actionableEvents.length > 0) {
    const { prompt } = actionableEvents[0]
    return { ...prompt, projectId: project.id, projectName: project.name || project.address }
  }

  // Priority 6: next not_started permit to kick off
  const nextPermit = events.find(e => e.stage === 'not_started')
  if (nextPermit) {
    const prompt = generatePermitPrompt(nextPermit, jurisdiction)
    if (prompt) return { ...prompt, projectId: project.id, projectName: project.name || project.address }
  }

  // All good
  return {
    urgency: 'good',
    text: `All permits on track. No action needed this week.`,
    action: null,
    projectId: project.id,
    projectName: project.name || project.address,
  }
}

// ─── Email digest builder ─────────────────────────────────────────────────────
// Builds the structured data for the weekly digest email
// Called by /api/digest — same logic, different output format

export function buildDigestData(user, projects, lifecycleMap) {
  const items = []

  for (const project of projects) {
    if (project.status === 'complete' || project.status === 'archived') continue

    const lifecycle = lifecycleMap[project.id]
    if (!lifecycle) continue

    const prompt = getProjectWeeklyPrompt(project, lifecycle)
    if (!prompt) continue

    // Collect all permit prompts for full detail in email
    const permitItems = (lifecycle.events || [])
      .map(event => {
        const p = generatePermitPrompt(event, project.jurisdiction || 'raleigh')
        return p ? { permitName: event.permit_name, stage: event.stage, ...p } : null
      })
      .filter(Boolean)
      .filter(p => p.urgency !== 'good') // only show items needing attention

    // Upcoming inspections
    const upcomingInspections = (lifecycle.inspections || [])
      .filter(i => i.status === 'scheduled')
      .slice(0, 3)

    // Expiring documents
    const expiringDocs = [] // populated by caller from document_expiry table

    items.push({
      project: {
        id: project.id,
        name: project.name || project.address || 'Untitled project',
        address: project.address,
        jurisdiction: project.jurisdiction,
        projectType: project.project_type,
      },
      headline: prompt,
      permitItems,
      upcomingInspections,
      expiringDocs,
      hasUrgentItems: prompt.urgency === 'critical' || permitItems.some(p => p.urgency === 'critical'),
    })
  }

  // Sort: critical first, then warning, then info
  const urgencyOrder = { critical: 0, warning: 1, info: 2, good: 3 }
  items.sort((a, b) =>
    (urgencyOrder[a.headline.urgency] || 3) - (urgencyOrder[b.headline.urgency] || 3)
  )

  return {
    user: { email: user.email, name: user.user_metadata?.name || user.email.split('@')[0] },
    weekOf: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    totalProjects: items.length,
    urgentCount: items.filter(i => i.hasUrgentItems).length,
    items,
  }
}
