import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getUser, sendMagicLink } from '../lib/supabase'
import { getProfile, saveProfile, getExpiringCredentials, LICENSE_TYPES, JURISDICTIONS_LIST } from '../lib/contractor-profile'
import { getJobs, createJob, updateJob, deleteJob, JOB_STATUSES } from '../lib/client-jobs'
import { TEMPLATES, fillTemplate } from '../data/client-templates'
import { hasAccess, isContractor } from '../lib/access'

const JUR_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
  apex: 'Apex', hollysprings: 'Holly Springs', wakeforest: 'Wake Forest',
  morrisville: 'Morrisville', garner: 'Garner',
}
const PROJ_LABELS = {
  sfh: 'New SFH', adu: 'ADU', addition: 'Addition', deck: 'Deck',
  reno: 'Renovation', pool: 'Pool', shed: 'Shed', townhouse: 'Townhouse',
}
const TABS = ['Dashboard', 'My Profile', 'Client Templates']

const EMPTY_JOB = {
  clientName: '', address: '', jurisdiction: 'raleigh',
  projectType: 'sfh', status: 'active', notes: '', nextAction: '',
}

export default function ContractorMode() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Dashboard')

  // Dashboard state
  const [jobs, setJobs] = useState([])
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobForm, setJobForm] = useState(EMPTY_JOB)
  const [savingJob, setSavingJob] = useState(false)

  // Profile state
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    businessName: '', dba: '', licenseType: 'gc', licenseNumber: '',
    licenseExpires: '', insuranceCarrier: '', insurancePolicy: '',
    insuranceExpires: '', bondNumber: '', phone: '', email: '',
    address: '', jurisdictions: [],
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Templates state
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateVars, setTemplateVars] = useState({})
  const [copiedTemplate, setCopiedTemplate] = useState(false)

  const [error, setError] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)
  const [magicEmail, setMagicEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)

  useEffect(() => {
    // Gate by localStorage token first — no Supabase session needed to view the page
    if (!isContractor() && !hasAccess()) {
      navigate('/pricing')
      return
    }
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      // Supabase session is optional — needed for saving jobs/profile
      // Page still loads without it using localStorage token
      const currentUser = await getUser()
      setUser(currentUser)

      const [profileData, jobsData] = await Promise.all([
        getProfile(),
        getJobs(),
      ])

      if (profileData) {
        setProfile(profileData)
        setProfileForm({
          businessName: profileData.business_name || '',
          dba: profileData.dba || '',
          licenseType: profileData.license_type || 'gc',
          licenseNumber: profileData.license_number || '',
          licenseExpires: profileData.license_expires || '',
          insuranceCarrier: profileData.insurance_carrier || '',
          insurancePolicy: profileData.insurance_policy || '',
          insuranceExpires: profileData.insurance_expires || '',
          bondNumber: profileData.bond_number || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          address: profileData.address || '',
          jurisdictions: profileData.jurisdictions || [],
        })
        // Pre-fill template vars from profile
        setTemplateVars({
          contractor_name: profileData.business_name || '',
          business_name: profileData.business_name || '',
          phone: profileData.phone || '',
        })
      }
      setJobs(jobsData)
    } catch (err) {
      setError('Could not load your data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // --- Profile ---
  async function handleSaveProfile() {
    if (!profileForm.businessName || !profileForm.licenseNumber) {
      setError('Business name and license number are required')
      return
    }
    setSavingProfile(true)
    setError('')
    try {
      const saved = await saveProfile(profileForm)
      setProfile(saved)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      if (err.message === 'Not authenticated') {
        setNeedsAuth(true)
        setError('')
      } else {
        setError(`Could not save profile: ${err.message}`)
      }
    } finally {
      setSavingProfile(false)
    }
  }

  function toggleJurisdiction(jur) {
    setProfileForm(f => ({
      ...f,
      jurisdictions: f.jurisdictions.includes(jur)
        ? f.jurisdictions.filter(j => j !== jur)
        : [...f.jurisdictions, jur],
    }))
  }

  // --- Jobs ---
  function startNewJob() {
    setEditingJob(null)
    setJobForm(EMPTY_JOB)
    setShowJobForm(true)
  }

  function startEditJob(job) {
    setEditingJob(job.id)
    setJobForm({
      clientName: job.client_name || '',
      address: job.address || '',
      jurisdiction: job.jurisdiction || 'raleigh',
      projectType: job.project_type || 'sfh',
      status: job.status || 'active',
      notes: job.notes || '',
      nextAction: job.next_action || '',
    })
    setShowJobForm(true)
  }

  async function handleSaveJob() {
    if (!jobForm.clientName || !jobForm.address) {
      setError('Client name and address are required')
      return
    }
    setSavingJob(true)
    setError('')
    try {
      if (editingJob) {
        const updated = await updateJob(editingJob, {
          client_name: jobForm.clientName,
          address: jobForm.address,
          jurisdiction: jobForm.jurisdiction,
          project_type: jobForm.projectType,
          status: jobForm.status,
          notes: jobForm.notes,
          next_action: jobForm.nextAction,
        })
        setJobs(prev => prev.map(j => j.id === editingJob ? updated : j))
      } else {
        const created = await createJob(jobForm)
        setJobs(prev => [created, ...prev])
      }
      setShowJobForm(false)
      setEditingJob(null)
      setJobForm(EMPTY_JOB)
    } catch (err) {
      if (err.message === 'Not authenticated') {
        setNeedsAuth(true)
        setError('')
      } else {
        setError(`Could not save job: ${err.message}`)
      }
    } finally {
      setSavingJob(false)
    }
  }

  async function handleStatusChange(jobId, newStatus) {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j))
    try {
      await updateJob(jobId, { status: newStatus })
    } catch {
      loadAll()
    }
  }

  async function handleDeleteJob(id) {
    if (!confirm('Remove this job?')) return
    try {
      await deleteJob(id)
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch (err) {
      setError(`Could not delete job: ${err.message}`)
    }
  }

  // --- Templates ---
  function selectTemplate(t) {
    setSelectedTemplate(t)
    const vars = {
      ...templateVars,
      today: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    }
    setTemplateVars(vars)
  }

  function copyTemplate() {
    if (!selectedTemplate) return
    const filled = fillTemplate(selectedTemplate, templateVars)
    const text = `Subject: ${filled.filledSubject}\n\n${filled.filledBody}`
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTemplate(true)
      setTimeout(() => setCopiedTemplate(false), 2500)
    })
  }

  async function handleMagicLink() {
    if (!magicEmail) return
    setMagicLoading(true)
    try {
      await sendMagicLink(magicEmail)
      setMagicSent(true)
    } catch (err) {
      setError(`Could not send login link: ${err.message}`)
    } finally {
      setMagicLoading(false)
    }
  }

  const warnings = profile ? getExpiringCredentials(profile) : []
  const activeJobs = jobs.filter(j => j.status !== 'complete')
  const filledTemplate = selectedTemplate ? fillTemplate(selectedTemplate, templateVars) : null

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email} · {activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''}</p>
        </div>
        {tab === 'Dashboard' && (
          <button onClick={startNewJob}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add client job
          </button>
        )}
      </div>

      {/* Credential warnings */}
      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
          <span className="text-base flex-shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-amber-800 mb-1">Credentials expiring soon</div>
            {warnings.map((w, i) => (
              <div key={i} className="text-xs text-amber-700">{w.label} expires {new Date(w.expires).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            ))}
          </div>
        </div>
      )}

      {needsAuth && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 mb-5">
          <div className="text-sm font-semibold text-brand-900 mb-1">Sign in to save your jobs</div>
          <div className="text-xs text-brand-700 mb-3 leading-relaxed">
            Enter your email and we'll send you a magic link. Your jobs and profile are saved to your account.
          </div>
          {magicSent ? (
            <div className="text-sm text-green-700 font-medium">Check your email for the login link.</div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={magicEmail}
                onChange={e => setMagicEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
                placeholder="your@email.com"
                className="flex-1 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button onClick={handleMagicLink} disabled={magicLoading}
                className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50">
                {magicLoading ? 'Sending...' : 'Send link'}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-700 mb-5 flex justify-between">
          {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm px-4 py-1.5 rounded-md font-medium transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Dashboard Tab ── */}
      {tab === 'Dashboard' && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { n: jobs.length, l: 'Total jobs' },
              { n: jobs.filter(j => j.status === 'active' || j.status === 'permitting').length, l: 'In progress' },
              { n: jobs.filter(j => j.status === 'inspection').length, l: 'Inspection stage' },
              { n: jobs.filter(j => j.status === 'complete').length, l: 'Complete' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{s.n}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Job form */}
          {showJobForm && (
            <div className="bg-white border border-brand-200 rounded-2xl p-5 mb-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{editingJob ? 'Edit job' : 'Add client job'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Client name *</label>
                  <input value={jobForm.clientName} onChange={e => setJobForm(f => ({ ...f, clientName: e.target.value }))}
                    placeholder="Jane Smith"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Property address *</label>
                  <input value={jobForm.address} onChange={e => setJobForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="123 Main St, Raleigh NC"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Jurisdiction</label>
                  <select value={jobForm.jurisdiction} onChange={e => setJobForm(f => ({ ...f, jurisdiction: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.entries(JUR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Project type</label>
                  <select value={jobForm.projectType} onChange={e => setJobForm(f => ({ ...f, projectType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.entries(PROJ_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Status</label>
                  <select value={jobForm.status} onChange={e => setJobForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.entries(JOB_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Next action</label>
                  <input value={jobForm.nextAction} onChange={e => setJobForm(f => ({ ...f, nextAction: e.target.value }))}
                    placeholder="e.g. Submit electrical permit by Friday"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 block mb-1.5">Notes</label>
                <textarea value={jobForm.notes} onChange={e => setJobForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Anything relevant about this job..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowJobForm(false); setEditingJob(null) }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300">Cancel</button>
                <button onClick={handleSaveJob} disabled={savingJob}
                  className="flex-1 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50">
                  {savingJob ? 'Saving...' : editingJob ? 'Save changes' : 'Add job'}
                </button>
              </div>
            </div>
          )}

          {/* Jobs list */}
          {jobs.length === 0 && !showJobForm ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <div className="text-4xl mb-4">🏗️</div>
              <div className="text-sm font-semibold text-gray-800 mb-2">No client jobs yet</div>
              <div className="text-xs text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
                Add your active permit jobs to track status, next actions, and send client updates - all in one place.
              </div>
              <button onClick={startNewJob}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">
                Add your first job
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 truncate">{job.client_name}</div>
                      <select value={job.status} onChange={e => handleStatusChange(job.id, e.target.value)}
                        className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer focus:outline-none bg-gray-50 text-gray-600 border-gray-200">
                        {Object.entries(JOB_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => { setTab('Client Templates'); setTemplateVars(v => ({ ...v, client_name: job.client_name, address: job.address, jurisdiction: JUR_LABELS[job.jurisdiction] || job.jurisdiction, project_type: PROJ_LABELS[job.project_type] || job.project_type })) }}
                        className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors" title="Send client update">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {job.jurisdiction === 'durham' && (
                        <Link
                          to={`/apply?a=${encodeURIComponent(job.address || '')}&p=${job.project_type || 'sfh'}&s=0`}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Pre-fill Durham permit application"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </Link>
                      )}
                      <button onClick={() => startEditJob(job)}
                        className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                    <span>{JUR_LABELS[job.jurisdiction] || job.jurisdiction}</span>
                    <span className="text-gray-200">·</span>
                    <span>{PROJ_LABELS[job.project_type] || job.project_type}</span>
                    <span className="text-gray-200">·</span>
                    <span className="truncate max-w-xs">{job.address}</span>
                  </div>
                  {job.next_action && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium">Next:</span>
                      <span className="text-xs text-gray-600">{job.next_action}</span>
                    </div>
                  )}
                  {job.notes && <div className="text-xs text-gray-400 italic mt-1.5">{job.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Profile Tab ── */}
      {tab === 'My Profile' && (
        <div>
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-6 text-xs text-brand-700 leading-relaxed">
            Set up your profile once. Your license number, insurance info, and business details will be available to reference on every permit application - no more retyping the same information.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              { key: 'businessName', label: 'Business name *', placeholder: 'Smith Construction LLC' },
              { key: 'dba', label: 'DBA (if different)', placeholder: 'Optional' },
              { key: 'phone', label: 'Phone', placeholder: '(919) 555-0100' },
              { key: 'email', label: 'Business email', placeholder: 'john@smithconstruction.com' },
              { key: 'address', label: 'Business address', placeholder: '100 Commerce Dr, Raleigh NC' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">{f.label}</label>
                <input value={profileForm[f.key]} onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-5 mb-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">NC License</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">License type</label>
                <select value={profileForm.licenseType} onChange={e => setProfileForm(p => ({ ...p, licenseType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  {Object.entries(LICENSE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">License number *</label>
                <input value={profileForm.licenseNumber} onChange={e => setProfileForm(p => ({ ...p, licenseNumber: e.target.value }))}
                  placeholder="78234"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">License expiry</label>
                <input type="date" value={profileForm.licenseExpires} onChange={e => setProfileForm(p => ({ ...p, licenseExpires: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mb-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Insurance & Bond</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'insuranceCarrier', label: 'Insurance carrier', placeholder: 'State Farm' },
                { key: 'insurancePolicy', label: 'Policy number', placeholder: 'POL-123456' },
                { key: 'bondNumber', label: 'Bond number', placeholder: 'Optional' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">{f.label}</label>
                  <input value={profileForm[f.key]} onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">Insurance expiry</label>
                <input type="date" value={profileForm.insuranceExpires} onChange={e => setProfileForm(p => ({ ...p, insuranceExpires: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Jurisdictions you work in</div>
            <div className="flex flex-wrap gap-2">
              {JURISDICTIONS_LIST.map(j => (
                <button key={j.id} onClick={() => toggleJurisdiction(j.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${profileForm.jurisdictions.includes(j.id) ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={savingProfile}
            className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50">
            {savingProfile ? 'Saving...' : profileSaved ? '✓ Profile saved' : 'Save profile'}
          </button>

          {/* Checklist preview */}
          {profile && (
            <div className="mt-6 bg-gray-50 rounded-xl p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your application info - ready to reference</div>
              {[
                { label: 'Business name', value: profile.business_name },
                { label: 'License type', value: LICENSE_TYPES[profile.license_type] },
                { label: 'License number', value: profile.license_number },
                { label: 'Insurance carrier', value: profile.insurance_carrier },
                { label: 'Insurance policy', value: profile.insurance_policy },
                { label: 'Bond number', value: profile.bond_number },
                { label: 'Phone', value: profile.phone },
                { label: 'Email', value: profile.email },
                { label: 'Address', value: profile.address },
              ].filter(f => f.value).map((f, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-none">
                  <div className="text-xs text-gray-400 w-32 flex-shrink-0">{f.label}</div>
                  <div className="text-xs font-medium text-gray-800">{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Client Templates Tab ── */}
      {tab === 'Client Templates' && (
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Template list */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Choose a template</div>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => selectTemplate(t)}
                  className={`w-full text-left border rounded-xl p-3.5 transition-all ${selectedTemplate?.id === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-base">{t.icon}</span>
                    <span className={`text-sm font-medium ${selectedTemplate?.id === t.id ? 'text-brand-700' : 'text-gray-900'}`}>{t.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 pl-7">{t.when}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Template preview + fill */}
          <div>
            {selectedTemplate ? (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fill in the details</div>

                {/* Quick-fill vars */}
                <div className="space-y-2 mb-4">
                  {[
                    { key: 'client_name', label: 'Client name', placeholder: 'Jane Smith' },
                    { key: 'address', label: 'Property address', placeholder: '123 Main St' },
                    { key: 'jurisdiction', label: 'Jurisdiction', placeholder: 'Raleigh' },
                    { key: 'project_type', label: 'Project type', placeholder: 'new single-family home' },
                  ].map(f => (
                    <div key={f.key} className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 w-28 flex-shrink-0">{f.label}</label>
                      <input value={templateVars[f.key] || ''} onChange={e => setTemplateVars(v => ({ ...v, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500" />
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Subject: {filledTemplate?.filledSubject}</div>
                  <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">{filledTemplate?.filledBody}</div>
                </div>

                <button onClick={copyTemplate}
                  className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors">
                  {copiedTemplate ? '✓ Copied to clipboard' : 'Copy message'}
                </button>
                <div className="text-xs text-gray-400 text-center mt-2">Paste into email, text, or messaging app</div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
                <div className="text-3xl mb-3">📬</div>
                <div className="text-sm font-medium text-gray-600 mb-1">Select a template</div>
                <div className="text-xs text-gray-400 leading-relaxed">Choose a situation on the left to preview and customize the message</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
