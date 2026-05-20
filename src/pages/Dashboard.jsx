import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, sendMagicLink, getUser, signOut, getProjects, deleteProject } from '../lib/supabase'
import { isDeveloper, hasAccess } from '../lib/access'

const JUR_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham',
  chapelhill: 'Chapel Hill', apex: 'Apex', hollysprings: 'Holly Springs',
}
const JUR_COLORS = {
  raleigh: 'bg-brand-50 text-brand-700 border-brand-100',
  durham: 'bg-amber-50 text-amber-700 border-amber-100',
  chapelhill: 'bg-blue-50 text-blue-700 border-blue-100',
  apex: 'bg-green-50 text-green-700 border-green-100',
  hollysprings: 'bg-purple-50 text-purple-700 border-purple-100',
}
const PROJ_LABELS = {
  sfh: 'New SFH', adu: 'ADU', addition: 'Addition',
  deck: 'Deck', reno: 'Renovation', pool: 'Pool',
  shed: 'Shed', townhouse: 'Townhouse',
}
const STATUS_STYLES = {
  active: 'bg-green-50 text-green-700 border-green-100',
  planning: 'bg-blue-50 text-blue-700 border-blue-100',
  submitted: 'bg-amber-50 text-amber-700 border-amber-100',
  complete: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState('loading') // loading | unauthenticated | authenticated
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [sendingLink, setSendingLink] = useState(false)
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check for existing session
    checkAuth()

    // Listen for auth state changes (magic link click)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        setAuthState('authenticated')
        loadProjects()
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
      loadProjects()
    } else {
      setAuthState('unauthenticated')
    }
  }

  async function loadProjects() {
    setLoadingProjects(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Load projects error:', err)
    } finally {
      setLoadingProjects(false)
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

  async function handleDeleteProject(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    try {
      await deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('Could not delete project. Please try again.')
    }
  }

  async function handleStatusChange(id, newStatus) {
    // Optimistic update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    try {
      const { supabase } = await import('../lib/supabase')
      await supabase.from('projects').update({ status: newStatus }).eq('id', id)
    } catch (err) {
      console.error('Status update error:', err)
      // Revert on error
      loadProjects()
    }
  }

  async function handleSignOut() {
    await signOut()
    setUser(null)
    setAuthState('unauthenticated')
    setProjects([])
  }

  function getRoadmapUrl(project) {
    const params = new URLSearchParams({
      j: project.jurisdiction || 'raleigh',
      p: project.project_type || 'sfh',
      a: project.address || '',
      h: project.flags?.historic ? '1' : '0',
      s: project.flags?.septic ? '1' : '0',
      f: project.flags?.flood ? '1' : '0',
    })
    return `/roadmap?${params.toString()}`
  }

  // Loading
  if (authState === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading your dashboard...</div>
      </div>
    )
  }

  // Not authenticated — show magic link login
  if (authState === 'unauthenticated') {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-semibold">P</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">One more step</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Enter the email you used when you signed up for Parcoria. We'll send you a secure login link to access your projects — no password needed.
          </p>
        </div>

        {!magicLinkSent ? (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            {!isDeveloper() && !hasAccess() && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                <div className="text-xs text-amber-700 leading-relaxed">
                  The multi-project dashboard requires a <strong>Developer subscription ($299/month)</strong>.{' '}
                  <Link to="/pricing" className="underline">Upgrade on the pricing page ↗</Link>
                </div>
              </div>
            )}
            <label className="text-xs font-medium text-gray-700 block mb-1.5">Your email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMagicLink()}
              placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
              disabled={sendingLink}
            />
            <button
              onClick={handleSendMagicLink}
              disabled={!email.includes('@') || sendingLink}
              className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-40"
            >
              {sendingLink ? 'Sending...' : 'Send me a login link'}
            </button>
            {error && <p className="text-xs text-red-500 text-center mt-3">{error}</p>}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
            <div className="text-2xl mb-3">📬</div>
            <div className="text-sm font-semibold text-green-800 mb-2">Check your email</div>
            <div className="text-xs text-green-700 leading-relaxed">
              We sent a login link to <strong>{email}</strong>. Click it to access your dashboard. The link expires in 1 hour.
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

  // Authenticated — show dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/contractors"
            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors"
          >
            👷 My contractors
          </Link>
          <Link
            to="/wizard"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New project
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

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

      {/* Projects list */}
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
          {projects.map(project => (
            <div key={project.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              {/* Row 1 — title + status + actions always locked to same line */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {project.name || project.address || 'Untitled project'}
                  </h3>
                  <select
                    value={project.status || 'active'}
                    onChange={e => handleStatusChange(project.id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer focus:outline-none ${STATUS_STYLES[project.status] || STATUS_STYLES.active}`}
                  >
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="submitted">Submitted</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={getRoadmapUrl(project)}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    View roadmap
                  </Link>
                  <Link
                    to={`/vault/${project.id}`}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 transition-colors flex items-center gap-1"
                    title="Evidence Vault"
                  >
                    🔒 Vault
                  </Link>
                  <Link
                    to={`/wizard?project=${project.id}`}
                    className="text-xs px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Open wizard
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-xs px-2 py-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Row 2 — metadata: jurisdiction, type, address, stats */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${JUR_COLORS[project.jurisdiction] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {JUR_LABELS[project.jurisdiction] || project.jurisdiction}
                </span>
                {project.project_type && (
                  <span className="text-xs text-gray-400">{PROJ_LABELS[project.project_type] || project.project_type}</span>
                )}
                {project.address && (
                  <span className="text-xs text-gray-400 truncate max-w-xs">{project.address}</span>
                )}
                {project.permit_count && <span className="text-xs text-gray-300">·</span>}
                {project.permit_count && <span className="text-xs text-gray-400">{project.permit_count} permits</span>}
                {project.timeline && <span className="text-xs text-gray-400">{project.timeline}</span>}
                {project.fees && <span className="text-xs text-gray-400">{project.fees}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Priority support banner for developers */}
      <div className="mt-8 bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-brand-900">Priority support</div>
          <div className="text-xs text-brand-700 mt-0.5">24-hour response from the Parcoria team</div>
        </div>
        <a
          href="mailto:developer@parcoria.com"
          className="flex-shrink-0 text-xs px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
        >
          Email support ↗
        </a>
      </div>
    </div>
  )
}
