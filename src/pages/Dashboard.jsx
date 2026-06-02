import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, sendMagicLink, getUser, signOut, getProjects, deleteProject, saveProject } from '../lib/supabase'
import { isDeveloper, hasAccess } from '../lib/access'
import { LogoMark } from '../components/Logo'
import {
  seedPermitEvents, seedInspectionLog,
  getProjectLifecycle, updatePermitStage, updateInspectionStatus,
  getDocumentExpiry, upsertDocument, updateDeadlineStatus,
  updatePermitField,
} from '../lib/lifecycle'
import { getProjectWeeklyPrompt } from '../lib/prompt-engine'

// ─── Constants ────────────────────────────────────────────────────────────────

const JUR_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
  apex: 'Apex', hollysprings: 'Holly Springs', wakeforest: 'Wake Forest',
  morrisville: 'Morrisville', garner: 'Garner', fuquayvarina: 'Fuquay-Varina', cary: 'Cary',
}
const JUR_COLORS = {
  raleigh: 'bg-brand-50 text-brand-700 border-brand-100',
  durham: 'bg-amber-50 text-amber-700 border-amber-100',
  chapelhill: 'bg-blue-50 text-blue-700 border-blue-100',
  apex: 'bg-green-50 text-green-700 border-green-100',
  hollysprings: 'bg-purple-50 text-purple-700 border-purple-100',
  wakeforest: 'bg-teal-50 text-teal-700 border-teal-100',
  morrisville: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  garner: 'bg-orange-50 text-orange-700 border-orange-100',
  fuquayvarina: 'bg-rose-50 text-rose-700 border-rose-100',
  cary: 'bg-indigo-50 text-indigo-700 border-indigo-100',
}
const PROJ_LABELS = {
  sfh: 'New SFH', adu: 'ADU', addition: 'Addition', deck: 'Deck',
  reno: 'Renovation', pool: 'Pool', shed: 'Shed', townhouse: 'Townhouse',
}
const PROJ_COLORS = {
  sfh: 'bg-brand-50 text-brand-700 border-brand-200', adu: 'bg-purple-50 text-purple-700 border-purple-200',
  addition: 'bg-blue-50 text-blue-700 border-blue-200', deck: 'bg-teal-50 text-teal-700 border-teal-200',
  reno: 'bg-orange-50 text-orange-700 border-orange-200', pool: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  shed: 'bg-lime-50 text-lime-700 border-lime-200', townhouse: 'bg-rose-50 text-rose-700 border-rose-200',
}
const STATUS_STYLES = {
  active:    'bg-green-50 text-green-700 border-green-100',
  planning:  'bg-blue-50 text-blue-700 border-blue-100',
  submitted: 'bg-amber-50 text-amber-700 border-amber-100',
  complete:  'bg-green-600 text-white border-green-600',
}

// Permit lifecycle stages — the core "one tap" progression
const PERMIT_STAGES = [
  { id: 'not_started', label: 'Not started', color: 'bg-gray-100 text-gray-500' },
  { id: 'applied',     label: 'Applied',     color: 'bg-blue-50 text-blue-700' },
  { id: 'in_review',   label: 'In review',   color: 'bg-amber-50 text-amber-700' },
  { id: 'approved',    label: 'Approved',    color: 'bg-emerald-50 text-emerald-700' },
  { id: 'issued',      label: 'Issued',      color: 'bg-green-50 text-green-700' },
  { id: 'inspections', label: 'Inspections', color: 'bg-purple-50 text-purple-700' },
  { id: 'on_hold',     label: 'On hold',     color: 'bg-orange-50 text-orange-700' },
  { id: 'rejected',    label: 'Rejected',    color: 'bg-red-50 text-red-700' },
  { id: 'complete',    label: 'Complete ✓',  color: 'bg-green-600 text-white border-green-600' },
]

const INSP_STATUS_STYLES = {
  pending:                'text-gray-400',
  scheduled:              'text-blue-600',
  passed:                 'text-green-600',
  failed:                 'text-red-600',
  re_inspection_required: 'text-orange-600',
  waived:                 'text-gray-400 line-through',
  skipped:                'text-gray-300',
}
const INSP_STATUS_ICONS = {
  pending: '○', scheduled: '◷', passed: '✓', failed: '✗',
  re_inspection_required: '⚠', waived: '—', skipped: '—',
}

const PORTAL_LABELS = {
  dplans:         'Dplans',
  ldo:            'LDO Portal',
  raleigh_portal: 'Raleigh Portal',
  opengov:        'OpenGov',
}
const PORTAL_URLS = {
  dplans:         'https://dplans.durhamnc.gov',
  ldo:            'https://ldo4.durhamnc.gov/DurhamWeb',
  raleigh_portal: 'https://permitportal.raleighnc.gov',
  opengov:        'https://chapelhillnc.portal.opengov.com',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PermitStageButton({ event, onStageChange, projectType, openId, setOpenId }) {
  const isOpen = openId === event.id
  const current = PERMIT_STAGES.find(s => s.id === event.stage) || PERMIT_STAGES[0]

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function handleOutside(e) {
      if (!e.target.closest(`[data-permit-dropdown="${event.id}"]`)) {
        setOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen, event.id, setOpenId])

  return (
    <div className="relative" data-permit-dropdown={event.id}>
      <button
        onClick={() => setOpenId(isOpen ? null : event.id)}
        className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${current.color}`}
      >
        {current.label}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 min-w-[140px] py-1">
          {PERMIT_STAGES.map(s => (
            <button
              key={s.id}
              onClick={() => { onStageChange(event.id, s.id, projectType); setOpenId(null) }}
              className={`w-full text-left text-xs px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 ${s.id === event.stage ? 'font-semibold text-brand-600' : 'text-gray-700'}`}
            >
              {s.id === event.stage && <span className="w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0" />}
              {s.id !== event.stage && <span className="w-1.5 h-1.5 flex-shrink-0" />}
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LifecyclePanel({ project, lifecycle, onStageChange, onInspectionChange, onFieldUpdate, loading }) {
  const [view, setView] = useState('permits') // permits | inspections | deadlines
  const [openDropdownId, setOpenDropdownId] = useState(null) // only one open at a time
  const [editingField, setEditingField] = useState(null) // { eventId, field }
  const [editValues, setEditValues] = useState({}) // { [eventId_field]: value }

  if (loading) {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 animate-pulse">
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-50 rounded-lg" />)}
        </div>
      </div>
    )
  }

  if (!lifecycle) return null

  const { events, inspections, deadlines, summary, overdueDeadlines, upcomingDeadlines } = lifecycle

  const progressPct = summary.total > 0
    ? Math.round((summary.complete / summary.total) * 100)
    : 0

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">
          {summary.complete}/{summary.total} permits complete
        </span>
      </div>

      {/* Overdue / upcoming alerts */}
      {overdueDeadlines.length > 0 && (
        <div className="mb-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700 flex items-center gap-2">
          <span className="flex-shrink-0">⚠️</span>
          <span><strong>{overdueDeadlines.length} overdue deadline{overdueDeadlines.length > 1 ? 's' : ''}:</strong>{' '}
            {overdueDeadlines[0].label}
          </span>
        </div>
      )}
      {upcomingDeadlines.length > 0 && overdueDeadlines.length === 0 && (
        <div className="mb-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700 flex items-center gap-2">
          <span className="flex-shrink-0">📅</span>
          <span>Due in {Math.ceil((new Date(upcomingDeadlines[0].due_date) - new Date()) / 86400000)} days:{' '}
            {upcomingDeadlines[0].label}
          </span>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-3">
        {[
          ['permits',     `Permits (${summary.total})`],
          ['inspections', `Inspections (${inspections.length})`],
          ['deadlines',   `Deadlines (${deadlines.filter(d=>d.status==='pending').length})`],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              view === id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* PERMITS view */}
      {view === 'permits' && (
        <div className="space-y-1.5">
          {events.length === 0 ? (
            <div className="text-xs text-gray-400 py-2">No permits tracked yet.</div>
          ) : events.map(event => {
            const permitNumKey = `${event.id}_permit_number`
            const notesKey     = `${event.id}_notes`
            const isEditingNum = editingField?.eventId === event.id && editingField?.field === 'permit_number'
            const isEditingNotes = editingField?.eventId === event.id && editingField?.field === 'notes'

            return (
              <div key={event.id} className="bg-gray-50 rounded-lg px-3 py-2.5 space-y-1.5">
                {/* Row 1 — name + stage */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">{event.permit_name}</div>
                  </div>
                  <PermitStageButton
                    event={event}
                    onStageChange={onStageChange}
                    projectType={project.project_type}
                    openId={openDropdownId}
                    setOpenId={setOpenDropdownId}
                  />
                </div>

                {/* Row 2 — metadata */}
                <div className="flex items-center gap-2 flex-wrap">
                  {event.portal && (
                    <a href={PORTAL_URLS[event.portal]} target="_blank" rel="noreferrer"
                      className="text-xs text-brand-500 hover:text-brand-700">
                      {PORTAL_LABELS[event.portal]} ↗
                    </a>
                  )}
                  {event.applied_date && (
                    <span className="text-xs text-gray-400">
                      Applied {new Date(event.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {event.approved_date && (
                    <span className="text-xs text-green-600">
                      ✓ Approved {new Date(event.approved_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Row 3 — permit number (inline editable) */}
                <div className="flex items-center gap-2">
                  {isEditingNum ? (
                    <input
                      autoFocus
                      type="text"
                      value={editValues[permitNumKey] ?? (event.permit_number || '')}
                      onChange={e => setEditValues(v => ({ ...v, [permitNumKey]: e.target.value }))}
                      onBlur={async () => {
                        const val = editValues[permitNumKey] ?? ''
                        await onFieldUpdate(event.id, 'permit_number', val)
                        setEditingField(null)
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') e.target.blur()
                        if (e.key === 'Escape') setEditingField(null)
                      }}
                      placeholder="Permit # (e.g. BP-2025-00123)"
                      className="text-xs border border-brand-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingField({ eventId: event.id, field: 'permit_number' })}
                      className="text-xs text-gray-400 hover:text-brand-600 transition-colors flex items-center gap-1"
                    >
                      {event.permit_number
                        ? <span className="text-gray-600 font-mono">#{event.permit_number}</span>
                        : <span className="italic">+ Add permit number</span>
                      }
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15H9v-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Row 4 — notes (inline editable) */}
                <div>
                  {isEditingNotes ? (
                    <textarea
                      autoFocus
                      rows={2}
                      value={editValues[notesKey] ?? (event.notes || '')}
                      onChange={e => setEditValues(v => ({ ...v, [notesKey]: e.target.value }))}
                      onBlur={async () => {
                        const val = editValues[notesKey] ?? ''
                        await onFieldUpdate(event.id, 'notes', val)
                        setEditingField(null)
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Escape') setEditingField(null)
                      }}
                      placeholder="Notes — e.g. awaiting structural drawings, inspector requested X..."
                      className="text-xs border border-brand-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white resize-none"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingField({ eventId: event.id, field: 'notes' })}
                      className="text-xs text-gray-400 hover:text-brand-600 transition-colors flex items-start gap-1 w-full text-left"
                    >
                      {event.notes
                        ? <span className="text-gray-500 leading-relaxed">{event.notes}</span>
                        : <span className="italic">+ Add notes</span>
                      }
                      <svg className="w-3 h-3 opacity-50 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15H9v-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          <div className="pt-1">
            <button
              onClick={() => {/* add custom permit — phase 2 */}}
              className="text-xs text-gray-400 hover:text-brand-600 transition-colors"
            >
              + Add permit
            </button>
          </div>
        </div>
      )}

      {/* INSPECTIONS view */}
      {view === 'inspections' && (
        <div className="space-y-1">
          {inspections.length === 0 ? (
            <div className="text-xs text-gray-400 py-2">
              Inspection sequence appears here after your building permit is issued.
              Mark the building permit as "Issued" to unlock the inspection tracker.
            </div>
          ) : inspections.map((insp, idx) => {
            const passed = insp.status === 'passed' || insp.status === 'waived'
            const prevPassed = idx === 0 || ['passed','waived'].includes(inspections[idx-1]?.status)
            const canAct = prevPassed || insp.status !== 'pending'

            return (
              <div key={insp.id}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  !canAct ? 'opacity-40' : passed ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                <span className={`text-sm flex-shrink-0 w-4 text-center font-mono ${INSP_STATUS_STYLES[insp.status]}`}>
                  {INSP_STATUS_ICONS[insp.status]}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs ${passed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {insp.label}
                  </span>
                  {insp.scheduled_date && insp.status === 'scheduled' && (
                    <span className="text-xs text-blue-600 ml-1.5">
                      · {new Date(insp.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {insp.result_notes && (
                    <div className="text-xs text-red-500 mt-0.5">{insp.result_notes}</div>
                  )}
                </div>
                {canAct && (
                  <select
                    value={insp.status}
                    onChange={e => onInspectionChange(insp.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="passed">Passed ✓</option>
                    <option value="failed">Failed ✗</option>
                    <option value="re_inspection_required">Re-inspect ⚠</option>
                    <option value="waived">Waived</option>
                  </select>
                )}
                {insp.scheduling_url && !passed && canAct && (
                  <a href={insp.scheduling_url} target="_blank" rel="noreferrer"
                    className="text-xs text-brand-500 hover:text-brand-700 flex-shrink-0">
                    Schedule ↗
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* DEADLINES view */}
      {view === 'deadlines' && (
        <div className="space-y-1.5">
          {deadlines.length === 0 ? (
            <div className="text-xs text-gray-400 py-2">
              Deadlines appear here as permits are submitted and issued.
            </div>
          ) : deadlines.map(dl => {
            const due = new Date(dl.due_date)
            const daysLeft = Math.ceil((due - new Date()) / 86400000)
            const overdue = daysLeft < 0 && dl.status === 'pending'
            const soon = daysLeft >= 0 && daysLeft <= 7 && dl.status === 'pending'

            return (
              <div key={dl.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  dl.status === 'complete' ? 'bg-gray-50 opacity-50'
                    : overdue ? 'bg-red-50'
                    : soon ? 'bg-amber-50'
                    : 'bg-gray-50'
                }`}>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${dl.status === 'complete' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {dl.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${overdue ? 'text-red-600' : soon ? 'text-amber-600' : 'text-gray-400'}`}>
                    {dl.status === 'complete' ? 'Done' :
                      overdue ? `${Math.abs(daysLeft)} days overdue` :
                      daysLeft === 0 ? 'Due today' :
                      `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
                    }
                  </div>
                </div>
                {dl.status !== 'complete' && (
                  <button
                    onClick={() => updateDeadlineStatus(dl.id, 'complete')}
                    className="text-xs text-gray-400 hover:text-green-600 transition-colors flex-shrink-0"
                    title="Mark complete"
                  >
                    ✓
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState('loading')
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [sendingLink, setSendingLink] = useState(false)
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [error, setError] = useState('')
  const [expandedProject, setExpandedProject] = useState(null)
  const [lifecycleData, setLifecycleData] = useState({})   // projectId → lifecycle
  const [lifecycleLoading, setLifecycleLoading] = useState({}) // projectId → bool
  const [activeTab, setActiveTab] = useState('projects')
  const [devProfile, setDevProfile] = useState({ name: '', company: '', phone: '', email: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [documents, setDocuments] = useState([])
  const SOLO_TYPES = ['sfh', 'adu', 'townhouse']

  useEffect(() => {
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        setAuthState('authenticated')
        loadProjects(session.user.id)
        if (event === 'SIGNED_IN') navigate('/dashboard', { replace: true })
      } else {
        setAuthState('unauthenticated')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function checkAuth() {
    const currentUser = await getUser()
    if (currentUser) {
      setUser(currentUser)
      setAuthState('authenticated')
      loadProjects(currentUser.id)
    } else {
      setAuthState('unauthenticated')
    }
  }

  async function loadProjects(userId) {
    setLoadingProjects(true)
    try {
      const data = await getProjects()
      setProjects(data)
      const { data: prof } = await supabase.from('developer_profiles').select('*').eq('user_id', userId).single()
      if (prof) setDevProfile({ name: prof.name||'', company: prof.company||'', phone: prof.phone||'', email: prof.email||'' })
      const docs = await getDocumentExpiry(userId)
      setDocuments(docs)
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Load lifecycle for a project when it's expanded
  async function loadLifecycle(project) {
    const id = project.id
    if (lifecycleData[id] || lifecycleLoading[id]) return

    setLifecycleLoading(prev => ({ ...prev, [id]: true }))
    try {
      let lifecycle = await getProjectLifecycle(id)

      // If no permit events yet, seed them automatically
      if (lifecycle.events.length === 0) {
        await seedPermitEvents(id, project.jurisdiction, project.project_type || 'sfh')
        lifecycle = await getProjectLifecycle(id)
      }

      setLifecycleData(prev => ({ ...prev, [id]: lifecycle }))
    } catch (err) {
      console.error('Load lifecycle error:', err)
    } finally {
      setLifecycleLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  function handleExpandProject(project) {
    const id = project.id
    if (expandedProject === id) {
      setExpandedProject(null)
      return
    }
    setExpandedProject(id)
    loadLifecycle(project)
  }

  async function handleStageChange(eventId, newStage, projectType) {
    // Find which project this event belongs to
    const projectId = Object.keys(lifecycleData).find(pid =>
      lifecycleData[pid]?.events?.some(e => e.id === eventId)
    )
    if (!projectId) return

    try {
      await updatePermitStage(eventId, newStage, { project_type: projectType })

      // If moving to 'issued', seed inspection log
      if (newStage === 'issued' || newStage === 'inspections') {
        const project = projects.find(p => p.id === projectId)
        const existingInspections = lifecycleData[projectId]?.inspections || []
        if (existingInspections.length === 0 && project) {
          const event = lifecycleData[projectId]?.events?.find(e => e.id === eventId)
          await seedInspectionLog(projectId, project.jurisdiction, project.project_type || 'sfh', eventId)
        }
      }

      // Refresh lifecycle for this project
      const updated = await getProjectLifecycle(projectId)
      setLifecycleData(prev => ({ ...prev, [projectId]: updated }))
    } catch (err) {
      console.error('Stage change error:', err)
    }
  }

  async function handleFieldUpdate(eventId, field, value) {
    // Find which project this event belongs to
    const projectId = Object.keys(lifecycleData).find(pid =>
      lifecycleData[pid]?.events?.some(e => e.id === eventId)
    )
    if (!projectId) return
    try {
      await updatePermitField(eventId, field, value)
      // Optimistically update local state without full reload
      setLifecycleData(prev => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          events: prev[projectId].events.map(e =>
            e.id === eventId ? { ...e, [field]: value } : e
          ),
        },
      }))
    } catch (err) {
      console.error('Field update error:', err)
    }
  }

  async function handleInspectionChange(inspectionId, newStatus) {
    const projectId = Object.keys(lifecycleData).find(pid =>
      lifecycleData[pid]?.inspections?.some(i => i.id === inspectionId)
    )
    if (!projectId) return

    try {
      await updateInspectionStatus(inspectionId, newStatus)
      const updated = await getProjectLifecycle(projectId)
      setLifecycleData(prev => ({ ...prev, [projectId]: updated }))
    } catch (err) {
      console.error('Inspection change error:', err)
    }
  }

  async function handleStatusChange(id, newStatus) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    try {
      await supabase.from('projects').update({ status: newStatus }).eq('id', id)
    } catch (err) {
      console.error('Status update error:', err)
      loadProjects(user?.id)
    }
  }

  async function handleToggleProjType(project, typeId) {
    const current = project.projs || (project.project_type ? [project.project_type] : [])
    let next
    if (current.includes(typeId)) {
      next = current.filter(p => p !== typeId)
      if (next.length === 0) return
    } else if (SOLO_TYPES.includes(typeId)) {
      next = [typeId]
    } else {
      next = [...current.filter(p => !SOLO_TYPES.includes(p)), typeId]
    }
    const newName = next.length > 1
      ? next.map(p => PROJ_LABELS[p] || p).join(' + ') + ' — ' + (project.address || project.jurisdiction)
      : project.name
    const updated = { ...project, projs: next, project_type: next[0], name: newName }
    setProjects(prev => prev.map(p => p.id === project.id ? updated : p))
    try {
      await supabase.from('projects').update({ projs: next, project_type: next[0], name: newName }).eq('id', project.id)
    } catch (err) {
      console.error('Toggle project type error:', err)
    }
  }

  async function handleDeleteProject(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    try {
      await deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      setLifecycleData(prev => { const n = { ...prev }; delete n[id]; return n })
    } catch (err) {
      alert('Could not delete project. Please try again.')
    }
  }

  async function handleSaveDevProfile() {
    if (!user) return
    setSavingProfile(true)
    try {
      await supabase.from('developer_profiles').upsert({
        user_id: user.id, name: devProfile.name, company: devProfile.company,
        phone: devProfile.phone, email: devProfile.email, updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      setError('Could not save profile')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleSendMagicLink() {
    if (!email.includes('@')) return
    setSendingLink(true)
    setError('')
    try {
      await sendMagicLink(email)
      setMagicLinkSent(true)
    } catch (err) {
      setError('Could not send magic link. Please try again.')
    } finally {
      setSendingLink(false)
    }
  }

  function getRoadmapUrl(project) {
    const params = new URLSearchParams({
      j: project.jurisdiction || 'raleigh', p: project.project_type || 'sfh',
      a: project.address || '', h: project.flags?.historic ? '1' : '0',
      s: project.flags?.septic ? '1' : '0', f: project.flags?.flood ? '1' : '0',
    })
    return `/roadmap?${params.toString()}`
  }

  // ── Expiring documents alert ─────────────────────────────────────────────
  const expiringDocs = documents.filter(d => {
    if (d.status === 'expired' || d.status === 'renewed') return false
    const days = Math.ceil((new Date(d.expiry_date) - new Date()) / 86400000)
    return days <= 30
  })

  // ── Loading ──────────────────────────────────────────────────────────────
  if (authState === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading your dashboard...</div>
      </div>
    )
  }

  // ── Unauthenticated ──────────────────────────────────────────────────────
  if (authState === 'unauthenticated') {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
            <LogoMark size={48} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">One more step</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Enter the email you used when you signed up for Parcoria. We'll send you a secure login link — no password needed.
          </p>
        </div>
        {!magicLinkSent ? (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            {!isDeveloper() && !hasAccess() && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                <div className="text-xs text-amber-700 leading-relaxed">
                  The multi-project dashboard requires a subscription.{' '}
                  <Link to="/pricing" className="underline">See plans ↗</Link>
                </div>
              </div>
            )}
            <label className="text-xs font-medium text-gray-700 block mb-1.5">Your email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMagicLink()}
              placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
              disabled={sendingLink} />
            <button onClick={handleSendMagicLink} disabled={!email.includes('@') || sendingLink}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-40">
              {sendingLink ? 'Sending...' : 'Send me a login link'}
            </button>
            {error && <p className="text-xs text-red-500 text-center mt-3">{error}</p>}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
            <div className="text-2xl mb-3">📬</div>
            <div className="text-sm font-semibold text-green-800 mb-2">Check your email</div>
            <div className="text-xs text-green-700 leading-relaxed">
              We sent a login link to <strong>{email}</strong>. Click it to access your dashboard. Expires in 1 hour.
            </div>
            <button onClick={() => setMagicLinkSent(false)} className="mt-4 text-xs text-gray-400 hover:text-gray-600">
              Use a different email
            </button>
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to home</Link>
        </div>
      </div>
    )
  }

  // ── Authenticated ────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/contractors"
            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors">
            👷 My contractors
          </Link>
          <Link to="/wizard"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New project
          </Link>
          <button onClick={async () => { await signOut(); setUser(null); setAuthState('unauthenticated'); setProjects([]) }}
            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* Expiring documents alert */}
      {expiringDocs.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="text-xs text-amber-700">
              <strong>{expiringDocs.length} document{expiringDocs.length > 1 ? 's' : ''} expiring soon:</strong>{' '}
              {expiringDocs[0].label} expires {new Date(expiringDocs[0].expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button onClick={() => setActiveTab('documents')}
            className="text-xs text-amber-700 font-medium underline flex-shrink-0">
            View all
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {[
          ['projects',  'My Projects'],
          ['documents', 'Documents'],
          ['settings',  'Settings'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`text-sm px-4 py-1.5 rounded-md font-medium transition-all ${activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
            {id === 'documents' && expiringDocs.length > 0 && (
              <span className="ml-1.5 text-xs bg-amber-500 text-white rounded-full px-1.5 py-0.5">{expiringDocs.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── PROJECTS TAB ── */}
      {activeTab === 'projects' && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { n: projects.length, l: 'Total projects' },
              { n: projects.filter(p => p.status === 'active').length, l: 'Active' },
              { n: projects.filter(p => p.status === 'submitted').length, l: 'Submitted' },
              { n: projects.filter(p => p.status === 'complete').length, l: 'Complete' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{s.n}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          {/* What to do this week — smart prompts from lifecycle data */}
          {!loadingProjects && projects.some(p => lifecycleData[p.id]) && (() => {
            const promptItems = projects
              .filter(p => p.status === 'active' && lifecycleData[p.id])
              .map(p => getProjectWeeklyPrompt(p, lifecycleData[p.id]))
              .filter(Boolean)
              .filter(p => p.urgency !== 'good')
              .slice(0, 3)

            if (!promptItems.length) return null

            const URGENCY_STYLES = {
              critical: 'bg-red-50 border-red-100 text-red-800',
              warning:  'bg-amber-50 border-amber-100 text-amber-800',
              info:     'bg-blue-50 border-blue-100 text-blue-800',
            }
            const URGENCY_ICONS = { critical: '⚠️', warning: '📅', info: 'ℹ️' }

            return (
              <div className="mb-6">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">This week</div>
                <div className="space-y-2">
                  {promptItems.map((prompt, i) => (
                    <div key={i} className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${URGENCY_STYLES[prompt.urgency] || 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                      <span className="flex-shrink-0 mt-0.5">{URGENCY_ICONS[prompt.urgency]}</span>
                      <div className="flex-1 min-w-0">
                        {prompt.projectName && (
                          <div className="text-xs font-semibold mb-0.5 opacity-70">{prompt.projectName}</div>
                        )}
                        <div className="text-xs leading-relaxed">{prompt.text}</div>
                        {prompt.action?.url && (
                          <a href={prompt.action.url} target="_blank" rel="noreferrer"
                            className="text-xs font-medium underline mt-1 inline-block opacity-80 hover:opacity-100">
                            {prompt.action.label} ↗
                          </a>
                        )}
                        {prompt.action?.phone && !prompt.action?.url && (
                          <a href={`tel:${prompt.action.phone}`}
                            className="text-xs font-medium underline mt-1 inline-block opacity-80 hover:opacity-100">
                            {prompt.action.label}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {loadingProjects ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading your projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
              <div className="text-3xl mb-3">🏗️</div>
              <div className="text-sm font-medium text-gray-800 mb-1">No projects yet</div>
              <div className="text-xs text-gray-400 mb-5">Start the permit wizard to create your first project</div>
              <Link to="/wizard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
                Start a project ↗
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(project => {
                const isExpanded = expandedProject === project.id
                const lifecycle = lifecycleData[project.id]
                const lLoading = lifecycleLoading[project.id]

                // Quick health indicator from lifecycle
                const hasIssues = lifecycle?.overdueDeadlines?.length > 0
                const allComplete = lifecycle?.summary?.total > 0 &&
                  lifecycle?.summary?.complete === lifecycle?.summary?.total

                return (
                  <div key={project.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                    {/* Row 1 — title + controls */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Health dot */}
                        {hasIssues && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Overdue deadlines" />}
                        {allComplete && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="All permits complete" />}
                        {!hasIssues && !allComplete && lifecycle && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="In progress" />}

                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {project.name || project.address || 'Untitled project'}
                        </h3>
                        <select
                          value={project.status || 'active'}
                          onChange={e => handleStatusChange(project.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer focus:outline-none ${STATUS_STYLES[project.status] || STATUS_STYLES.active}`}>
                          <option value="active">Active</option>
                          <option value="planning">Planning</option>
                          <option value="submitted">Submitted</option>
                          <option value="complete">Complete</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to={getRoadmapUrl(project)}
                          className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 transition-colors">
                          View roadmap
                        </Link>
                        <Link to={`/vault/${project.id}`}
                          className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 transition-colors flex items-center gap-1"
                          title="Evidence Vault">
                          🔒 Vault
                        </Link>
                        {['durham', 'raleigh'].includes(project.jurisdiction) && (
                          <Link
                            to={`/apply?a=${encodeURIComponent(project.address || '')}&p=${project.project_type || 'sfh'}&s=${project.flags?.septic ? '1' : '0'}&j=${project.jurisdiction}`}
                            className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            title="Pre-fill permit application">
                            📋 Pre-fill app
                          </Link>
                        )}
                        {/* Lifecycle expand/collapse */}
                        <button
                          onClick={() => handleExpandProject(project)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                            isExpanded
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                          title="Track permit lifecycle"
                        >
                          {isExpanded ? '↑ Close' : '📊 Lifecycle'}
                        </button>
                        <Link to={`/wizard?project=${project.id}`}
                          className="text-xs px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                          Open wizard
                        </Link>
                        <button onClick={() => handleDeleteProject(project.id)}
                          className="text-xs px-2 py-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete project">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Row 2 — metadata */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${JUR_COLORS[project.jurisdiction] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {JUR_LABELS[project.jurisdiction] || project.jurisdiction}
                      </span>
                      {(project.projs?.length > 0 ? project.projs : project.project_type ? [project.project_type] : []).map(pt => (
                        <span key={pt} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PROJ_COLORS[pt] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {PROJ_LABELS[pt] || pt}
                        </span>
                      ))}
                      {project.address && <span className="text-xs text-gray-400 truncate max-w-xs">{project.address}</span>}
                      {project.permit_count && <><span className="text-xs text-gray-300">·</span><span className="text-xs text-gray-400">{project.permit_count} permits</span></>}
                      {project.timeline && <span className="text-xs text-gray-400">{project.timeline}</span>}
                      {project.fees && <span className="text-xs text-gray-400">{project.fees}</span>}
                      <button
                        onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                        className="text-xs text-brand-500 hover:text-brand-700 font-medium ml-1"
                      >
                        {isExpanded ? '' : '+ Add project type'}
                      </button>
                    </div>

                    {/* Lifecycle panel */}
                    {isExpanded && (
                      <LifecyclePanel
                        project={project}
                        lifecycle={lifecycle}
                        onStageChange={handleStageChange}
                        onInspectionChange={handleInspectionChange}
                        onFieldUpdate={handleFieldUpdate}
                        loading={lLoading}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Support banner */}
          <div className="mt-8 bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-brand-900">Priority support</div>
              <div className="text-xs text-brand-700 mt-0.5">24-hour response from the Parcoria team</div>
            </div>
            <a href="mailto:developer@parcoria.com"
              className="flex-shrink-0 text-xs px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
              Email support ↗
            </a>
          </div>
        </>
      )}

      {/* ── DOCUMENTS TAB ── */}
      {activeTab === 'documents' && (
        <div className="max-w-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Document & License Expiry</h2>
            <button
              onClick={async () => {
                const label = prompt('Document name (e.g. "NC General Contractor License")')
                if (!label) return
                const expiry = prompt('Expiry date (YYYY-MM-DD)')
                if (!expiry) return
                const doc = await upsertDocument({ label, expiry_date: expiry, document_type: 'custom', status: 'active' })
                setDocuments(prev => [...prev, doc])
              }}
              className="text-xs px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              + Add document
            </button>
          </div>
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-5 text-xs text-brand-700">
            Track NC licenses, insurance certificates, lien agent appointments, and bonds. Parcoria alerts you 30 days before expiry.
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm text-gray-500 mb-1">No documents tracked yet</div>
              <div className="text-xs text-gray-400">Add your NC license, insurance certificates, and bonds</div>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => {
                const days = Math.ceil((new Date(doc.expiry_date) - new Date()) / 86400000)
                const overdue = days < 0
                const soon = days >= 0 && days <= 30
                return (
                  <div key={doc.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                    overdue ? 'bg-red-50 border-red-100' : soon ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{doc.label}</div>
                      {doc.document_number && <div className="text-xs text-gray-400">{doc.document_number}</div>}
                      <div className={`text-xs mt-0.5 ${overdue ? 'text-red-600 font-medium' : soon ? 'text-amber-600' : 'text-gray-400'}`}>
                        {overdue
                          ? `Expired ${Math.abs(days)} days ago`
                          : days === 0 ? 'Expires today'
                          : `Expires in ${days} days · ${new Date(doc.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                        }
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      overdue ? 'bg-red-100 text-red-700' : soon ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {overdue ? 'Expired' : soon ? 'Expiring soon' : 'Active'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && (
        <div className="max-w-lg">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Developer Profile</h2>
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-5 text-xs text-brand-700">
            Your profile info is used to pre-fill project briefs and permit applications.
          </div>
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Your name', placeholder: 'John Smith' },
              { key: 'company', label: 'Company name', placeholder: 'Smith Development LLC' },
              { key: 'email', label: 'Contact email', placeholder: 'john@smithdev.com' },
              { key: 'phone', label: 'Phone', placeholder: '(919) 555-0100' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">{f.label}</label>
                <input value={devProfile[f.key]}
                  onChange={e => setDevProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
            <button onClick={handleSaveDevProfile} disabled={savingProfile}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 mt-2">
              {savingProfile ? 'Saving...' : profileSaved ? '✓ Profile saved' : 'Save profile'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
