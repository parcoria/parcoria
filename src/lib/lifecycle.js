// src/lib/lifecycle.js
// Supabase functions for the project lifecycle tracker
// Covers permit_events, inspection_log, project_deadlines, document_expiry

import { supabase, getUser } from './supabase'

// ─── Inspection sequences ─────────────────────────────────────────────────────
// Sourced from DURHAM_INSPECTIONS and INSPECTIONS (raleigh) in the data files.
// Centralised here so the seeder has one place to read from.

const INSPECTION_SEQUENCES = {
  durham: {
    sfh: [
      { type: 'footing', label: 'Footing / foundation' },
      { type: 'framing', label: 'Framing — after complete, before insulation' },
      { type: 'rough_in', label: 'Rough-in — electrical, plumbing, HVAC (before walls close)' },
      { type: 'insulation', label: 'Insulation' },
      { type: 'final_building', label: 'Final building' },
      { type: 'final_electrical', label: 'Final electrical' },
      { type: 'final_plumbing', label: 'Final plumbing' },
      { type: 'final_mechanical', label: 'Final mechanical' },
      { type: 'co_walkthrough', label: 'Certificate of compliance walkthrough' },
    ],
    adu: [
      { type: 'foundation', label: 'Foundation' },
      { type: 'framing', label: 'Framing' },
      { type: 'rough_in', label: 'Rough-in' },
      { type: 'final_building', label: 'Final building' },
      { type: 'co_walkthrough', label: 'Certificate of compliance' },
    ],
    addition: [
      { type: 'footing', label: 'Footing / foundation (if applicable)' },
      { type: 'framing', label: 'Framing' },
      { type: 'rough_in', label: 'Rough-in' },
      { type: 'final_building', label: 'Final' },
    ],
    deck: [
      { type: 'footing', label: 'Footing' },
      { type: 'framing', label: 'Framing' },
      { type: 'final_building', label: 'Final' },
    ],
    pool: [
      { type: 'pre_pour', label: 'Pre-pour' },
      { type: 'bonding', label: 'Bonding / electrical' },
      { type: 'barrier', label: 'Barrier / fence' },
      { type: 'final_building', label: 'Final pool' },
    ],
    shed: [
      { type: 'final_building', label: 'Final' },
    ],
    reno: [
      { type: 'rough_in', label: 'Rough-in' },
      { type: 'final_building', label: 'Final' },
    ],
    townhouse: [
      { type: 'footing', label: 'Footing (per building)' },
      { type: 'framing', label: 'Framing (per unit)' },
      { type: 'fire_separation', label: 'Fire separation' },
      { type: 'rough_in', label: 'Rough-in (per unit)' },
      { type: 'insulation', label: 'Insulation' },
      { type: 'final_building', label: 'Final (per unit)' },
      { type: 'co_walkthrough', label: 'Certificate of compliance (per unit)' },
    ],
  },
  raleigh: {
    sfh: [
      { type: 'footing', label: 'Footing / foundation' },
      { type: 'framing', label: 'Framing — after complete, before insulation' },
      { type: 'rough_in', label: 'Rough-in — electrical, plumbing, HVAC' },
      { type: 'insulation', label: 'Insulation' },
      { type: 'final_building', label: 'Final building' },
      { type: 'final_electrical', label: 'Final electrical' },
      { type: 'final_plumbing', label: 'Final plumbing' },
      { type: 'final_mechanical', label: 'Final mechanical' },
      { type: 'co_walkthrough', label: 'Certificate of occupancy walkthrough' },
    ],
    adu: [
      { type: 'foundation', label: 'Foundation' },
      { type: 'framing', label: 'Framing' },
      { type: 'rough_in', label: 'Rough-in' },
      { type: 'final_building', label: 'Final building' },
      { type: 'co_walkthrough', label: 'Certificate of occupancy' },
    ],
    addition: [
      { type: 'footing', label: 'Footing / foundation (if applicable)' },
      { type: 'framing', label: 'Framing' },
      { type: 'rough_in', label: 'Rough-in' },
      { type: 'final_building', label: 'Final' },
    ],
    deck:  [
      { type: 'footing', label: 'Footing' },
      { type: 'framing', label: 'Framing' },
      { type: 'final_building', label: 'Final' },
    ],
    pool:  [
      { type: 'pre_pour', label: 'Pre-pour' },
      { type: 'bonding', label: 'Bonding / electrical' },
      { type: 'barrier', label: 'Barrier / fence' },
      { type: 'final_building', label: 'Final pool' },
    ],
    shed:  [{ type: 'final_building', label: 'Final' }],
    reno:  [
      { type: 'rough_in', label: 'Rough-in' },
      { type: 'final_building', label: 'Final' },
    ],
    townhouse: [
      { type: 'footing', label: 'Footing (per building)' },
      { type: 'framing', label: 'Framing (per unit)' },
      { type: 'fire_separation', label: 'Fire separation' },
      { type: 'rough_in', label: 'Rough-in (per unit)' },
      { type: 'insulation', label: 'Insulation' },
      { type: 'final_building', label: 'Final (per unit)' },
      { type: 'co_walkthrough', label: 'Certificate of occupancy (per unit)' },
    ],
  },
}

// Fallback: use raleigh sequences for jurisdictions without their own
function getInspectionSequence(jurisdiction, projectType) {
  const jurSeq = INSPECTION_SEQUENCES[jurisdiction] || INSPECTION_SEQUENCES.raleigh
  return jurSeq[projectType] || jurSeq.sfh
}

// Scheduling URLs per jurisdiction
const INSPECTION_SCHEDULING = {
  durham:      { url: 'https://ldo4.durhamnc.gov/DurhamWeb', phone: '(919) 560-4144' },
  raleigh:     { url: 'https://permitportal.raleighnc.gov', phone: '919-996-2500' },
  chapelhill:  { url: 'https://chapelhillnc.portal.opengov.com', phone: '(919) 968-2728' },
  cary:        { url: 'https://cary-egov.aspgov.com/Click2GovBP/index.html', phone: '(919) 469-4075' },
  apex:        { url: 'https://www.myidtplans.com', phone: '(919) 249-3394' },
  hollysprings:{ url: 'https://cityview.hollyspringsnc.us/portal', phone: '(919) 557-3951' },
  wakeforest:  { url: 'https://wakeforest.idtplans.com/secure/', phone: '(919) 435-9400' },
  morrisville: { url: 'https://www.morrisvillenc.gov/Services-Forms/E-Permits-Applications', phone: '(919) 463-6200' },
  garner:      { url: 'https://twn-garner-nc.smartgovcommunity.com/Public/Home', phone: '(919) 772-4688' },
  fuquayvarina:{ url: 'https://www.fuquay-varina.org/238/E-Permits-Online', phone: '(919) 552-1400' },
}

// ─── Permit event scaffolding ─────────────────────────────────────────────────
// When a project is created, we scaffold the expected permit events from
// the roadmap data so the contractor sees their full checklist immediately.

const PERMIT_SCAFFOLDS = {
  durham: {
    sfh: [
      { permit_type: 'survey',     permit_name: 'Lot survey & recorded plat',       portal: null,    sequence_order: 1, est_days: 14 },
      { permit_type: 'lien_agent', permit_name: 'Lien agent appointment',            portal: null,    sequence_order: 2, est_days: 1  },
      { permit_type: 'zoning',     permit_name: 'Zoning compliance permit',          portal: 'ldo',   sequence_order: 3, est_days: 7  },
      { permit_type: 'building',   permit_name: 'Residential building permit',       portal: 'dplans',sequence_order: 4, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'ldo',   sequence_order: 5, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'ldo',   sequence_order: 5, est_days: 7  },
      { permit_type: 'mechanical', permit_name: 'Mechanical / HVAC permit',          portal: 'ldo',   sequence_order: 5, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of compliance',         portal: 'ldo',   sequence_order: 6, est_days: 7  },
    ],
    adu: [
      { permit_type: 'zoning',     permit_name: 'Zoning compliance permit',          portal: 'ldo',   sequence_order: 1, est_days: 7  },
      { permit_type: 'building',   permit_name: 'Building permit (ADU)',             portal: 'dplans',sequence_order: 2, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'ldo',   sequence_order: 3, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'ldo',   sequence_order: 3, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of compliance',         portal: 'ldo',   sequence_order: 4, est_days: 7  },
    ],
    addition: [
      { permit_type: 'building',   permit_name: 'Residential building permit',       portal: 'dplans',sequence_order: 1, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'ldo',   sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'ldo',   sequence_order: 2, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of compliance',         portal: 'ldo',   sequence_order: 3, est_days: 7  },
    ],
    deck:  [
      { permit_type: 'building',   permit_name: 'Building permit (deck)',            portal: 'dplans',sequence_order: 1, est_days: 14 },
    ],
    pool:  [
      { permit_type: 'building',   permit_name: 'Pool / spa permit',                portal: 'dplans',sequence_order: 1, est_days: 14 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'ldo',   sequence_order: 2, est_days: 7  },
    ],
    shed:  [
      { permit_type: 'building',   permit_name: 'Building permit (accessory struct)',portal: 'dplans',sequence_order: 1, est_days: 7  },
    ],
    reno:  [
      { permit_type: 'building',   permit_name: 'Residential building permit',       portal: 'dplans',sequence_order: 1, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'ldo',   sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'ldo',   sequence_order: 2, est_days: 7  },
    ],
    townhouse: [
      { permit_type: 'building',   permit_name: 'Building permit (townhouse)',       portal: 'dplans',sequence_order: 1, est_days: 30 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'ldo',   sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'ldo',   sequence_order: 2, est_days: 7  },
      { permit_type: 'mechanical', permit_name: 'Mechanical / HVAC permit',          portal: 'ldo',   sequence_order: 2, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of compliance',         portal: 'ldo',   sequence_order: 3, est_days: 7  },
    ],
  },
  raleigh: {
    sfh: [
      { permit_type: 'lien_agent', permit_name: 'Lien agent appointment',            portal: null,            sequence_order: 1, est_days: 1  },
      { permit_type: 'building',   permit_name: 'Residential building permit',       portal: 'raleigh_portal',sequence_order: 2, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'raleigh_portal',sequence_order: 3, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'raleigh_portal',sequence_order: 3, est_days: 7  },
      { permit_type: 'mechanical', permit_name: 'Mechanical / HVAC permit',          portal: 'raleigh_portal',sequence_order: 3, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of occupancy',          portal: 'raleigh_portal',sequence_order: 4, est_days: 7  },
    ],
    adu: [
      { permit_type: 'building',   permit_name: 'Building permit (ADU)',             portal: 'raleigh_portal',sequence_order: 1, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of occupancy',          portal: 'raleigh_portal',sequence_order: 3, est_days: 7  },
    ],
    addition: [
      { permit_type: 'building',   permit_name: 'Residential building permit',       portal: 'raleigh_portal',sequence_order: 1, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of occupancy',          portal: 'raleigh_portal',sequence_order: 3, est_days: 7  },
    ],
    deck:  [{ permit_type: 'building', permit_name: 'Building permit (deck)', portal: 'raleigh_portal', sequence_order: 1, est_days: 14 }],
    pool:  [
      { permit_type: 'building',   permit_name: 'Pool / spa permit',                portal: 'raleigh_portal',sequence_order: 1, est_days: 14 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
    ],
    shed:  [{ permit_type: 'building', permit_name: 'Building permit (accessory struct)', portal: 'raleigh_portal', sequence_order: 1, est_days: 7 }],
    reno:  [
      { permit_type: 'building',   permit_name: 'Residential building permit',       portal: 'raleigh_portal',sequence_order: 1, est_days: 21 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
    ],
    townhouse: [
      { permit_type: 'building',   permit_name: 'Building permit (townhouse)',       portal: 'raleigh_portal',sequence_order: 1, est_days: 30 },
      { permit_type: 'electrical', permit_name: 'Electrical permit',                 portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'plumbing',   permit_name: 'Plumbing permit',                   portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'mechanical', permit_name: 'Mechanical / HVAC permit',          portal: 'raleigh_portal',sequence_order: 2, est_days: 7  },
      { permit_type: 'co',         permit_name: 'Certificate of occupancy',          portal: 'raleigh_portal',sequence_order: 3, est_days: 7  },
    ],
  },
}

function getPermitScaffold(jurisdiction, projectType) {
  const jurScaffold = PERMIT_SCAFFOLDS[jurisdiction] || PERMIT_SCAFFOLDS.raleigh
  return jurScaffold[projectType] || jurScaffold.sfh
}

// ─── PERMIT EVENTS ────────────────────────────────────────────────────────────

// Seed permit events for a newly created project
export async function seedPermitEvents(projectId, jurisdiction, projectType) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const scaffold = getPermitScaffold(jurisdiction, projectType)

  const rows = scaffold.map(s => ({
    project_id:     projectId,
    user_id:        user.id,
    permit_type:    s.permit_type,
    permit_name:    s.permit_name,
    jurisdiction,
    portal:         s.portal,
    sequence_order: s.sequence_order,
    stage:          'not_started',
    est_days:       s.est_days,
  }))

  const { data, error } = await supabase
    .from('permit_events')
    .insert(rows)
    .select()

  if (error) throw error
  return data
}

// Get all permit events for a project
export async function getPermitEvents(projectId) {
  const { data, error } = await supabase
    .from('permit_events')
    .select('*')
    .eq('project_id', projectId)
    .order('sequence_order', { ascending: true })

  if (error) throw error
  return data || []
}

// Update a single permit event's stage (the core "one tap" action)
export async function updatePermitStage(eventId, stage, extraFields = {}) {
  const now = new Date().toISOString()

  // Auto-set dates based on stage transition
  const dateFields = {}
  if (stage === 'applied')    dateFields.applied_date  = extraFields.applied_date  || new Date().toISOString().split('T')[0]
  if (stage === 'approved')   dateFields.approved_date = extraFields.approved_date || new Date().toISOString().split('T')[0]
  if (stage === 'issued')     dateFields.issued_date   = extraFields.issued_date   || new Date().toISOString().split('T')[0]
  if (stage === 'complete')   dateFields.co_date       = extraFields.co_date       || new Date().toISOString().split('T')[0]

  // Strip fields that don't belong on permit_events before sending to Supabase
  const { project_type: _projectType, ...permitFields } = extraFields

  const { data, error } = await supabase
    .from('permit_events')
    .update({
      stage,
      ...dateFields,
      ...permitFields,
      updated_at: now,
    })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw error

  // If approved, auto-set permit expiry deadline (6 months from issue)
  if (stage === 'approved' || stage === 'issued') {
    const issueDate = dateFields.issued_date || dateFields.approved_date
    if (issueDate) {
      const expiry = new Date(issueDate)
      expiry.setMonth(expiry.getMonth() + 6)
      // Check if a permit_expiry deadline already exists for this event before inserting
      const { data: existingDl } = await supabase
        .from('project_deadlines')
        .select('id')
        .eq('permit_event_id', eventId)
        .eq('deadline_type', 'permit_expiry')
        .maybeSingle()

      if (!existingDl) {
        await supabase.from('project_deadlines').insert({
          project_id:       data.project_id,
          user_id:          data.user_id,
          permit_event_id:  eventId,
          deadline_type:    'permit_expiry',
          label:            `${data.permit_name} expires — schedule inspections before this date`,
          due_date:         expiry.toISOString().split('T')[0],
          alert_days_before: 30,
          auto_generated:   true,
          source:           'permit_issue_date',
        })
      }
    }
  }

  // If complete, write to project_outcomes flywheel
  if (stage === 'complete' && data.applied_date && data.approved_date) {
    const applied = new Date(data.applied_date)
    const approved = new Date(data.approved_date)
    const actualDays = Math.round((approved - applied) / (1000 * 60 * 60 * 24))
    const quarter = `${approved.getFullYear()}-Q${Math.ceil((approved.getMonth() + 1) / 3)}`

    await supabase.from('project_outcomes').insert({
      project_id:        data.project_id,
      permit_event_id:   eventId,
      jurisdiction:      data.jurisdiction,
      project_type:      _projectType || 'sfh',
      permit_type:       data.permit_type,
      applied_date:      data.applied_date,
      approved_date:     data.approved_date,
      actual_review_days: actualDays,
      est_review_days:   data.est_days,
      accuracy_delta:    data.est_days ? actualDays - data.est_days : null,
      actual_fee:        data.actual_fee,
      est_fee:           data.est_fee,
      fee_delta:         (data.actual_fee && data.est_fee) ? data.actual_fee - data.est_fee : null,
      outcome:           'approved',
      year_quarter:      quarter,
    })
  }

  return data
}

// ─── INSPECTION LOG ───────────────────────────────────────────────────────────

// Seed inspection log for a project (called after building permit is issued)
export async function seedInspectionLog(projectId, jurisdiction, projectType, permitEventId = null) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const sequence = getInspectionSequence(jurisdiction, projectType)
  const scheduling = INSPECTION_SCHEDULING[jurisdiction] || {}

  const rows = sequence.map((insp, i) => ({
    project_id:      projectId,
    user_id:         user.id,
    permit_event_id: permitEventId,
    sequence_order:  i + 1,
    inspection_type: insp.type,
    label:           insp.label,
    jurisdiction,
    scheduling_url:  scheduling.url || null,
    scheduling_phone:scheduling.phone || null,
    status:          'pending',
  }))

  const { data, error } = await supabase
    .from('inspection_log')
    .insert(rows)
    .select()

  if (error) throw error
  return data
}

// Get all inspections for a project
export async function getInspectionLog(projectId) {
  const { data, error } = await supabase
    .from('inspection_log')
    .select('*')
    .eq('project_id', projectId)
    .order('sequence_order', { ascending: true })

  if (error) throw error
  return data || []
}

// Update a single inspection status
export async function updateInspectionStatus(inspectionId, status, notes = '') {
  const { data, error } = await supabase
    .from('inspection_log')
    .update({
      status,
      completed_date: ['passed', 'failed', 'waived'].includes(status)
        ? new Date().toISOString().split('T')[0]
        : null,
      result_notes:   notes,
      re_inspection_required: status === 'failed',
      updated_at:     new Date().toISOString(),
    })
    .eq('id', inspectionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── PROJECT DEADLINES ────────────────────────────────────────────────────────

export async function getProjectDeadlines(projectId) {
  const { data, error } = await supabase
    .from('project_deadlines')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function updateDeadlineStatus(deadlineId, status) {
  const { data, error } = await supabase
    .from('project_deadlines')
    .update({
      status,
      completed_at: status === 'complete' ? new Date().toISOString() : null,
    })
    .eq('id', deadlineId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── DOCUMENT EXPIRY ──────────────────────────────────────────────────────────

export async function getDocumentExpiry(userId) {
  const { data, error } = await supabase
    .from('document_expiry')
    .select('*')
    .eq('user_id', userId)
    .order('expiry_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertDocument(doc) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('document_expiry')
    .upsert({ ...doc, user_id: user.id, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── AGGREGATE HELPERS ────────────────────────────────────────────────────────

// Get everything needed to render a project's lifecycle panel in one call
export async function getProjectLifecycle(projectId) {
  const [events, inspections, deadlines] = await Promise.all([
    getPermitEvents(projectId),
    getInspectionLog(projectId),
    getProjectDeadlines(projectId),
  ])

  // Compute overall project health
  const total = events.length
  const notStarted = events.filter(e => e.stage === 'not_started').length
  const inProgress = events.filter(e => ['applied','in_review','approved','issued','inspections'].includes(e.stage)).length
  const complete   = events.filter(e => e.stage === 'complete').length
  const onHold     = events.filter(e => ['on_hold','rejected'].includes(e.stage)).length

  const overdueDeadlines = deadlines.filter(d => {
    if (d.status !== 'pending') return false
    return new Date(d.due_date) < new Date()
  })

  const upcomingDeadlines = deadlines.filter(d => {
    if (d.status !== 'pending') return false
    const due = new Date(d.due_date)
    const now = new Date()
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 14
  })

  return {
    events,
    inspections,
    deadlines,
    summary: { total, notStarted, inProgress, complete, onHold },
    overdueDeadlines,
    upcomingDeadlines,
  }
}
