import { useState, useEffect } from 'react'
import { updateDeadlineStatus } from '../lib/lifecycle'

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
  pending: 'text-gray-400', scheduled: 'text-blue-600', passed: 'text-green-600',
  failed: 'text-red-600', re_inspection_required: 'text-orange-600',
  waived: 'text-gray-400 line-through', skipped: 'text-gray-300',
}
const INSP_STATUS_ICONS = {
  pending: '○', scheduled: '◷', passed: '✓', failed: '✗',
  re_inspection_required: '⚠', waived: '—', skipped: '—',
}

export function PermitStageButton({ event, onStageChange, projectType, openId, setOpenId }) {
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

export default function LifecyclePanel({ project, lifecycle, onStageChange, onInspectionChange, onFieldUpdate, loading }) {
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

