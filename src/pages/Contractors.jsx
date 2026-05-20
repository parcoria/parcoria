import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../lib/supabase'
import {
  addContractor, getMyContractors, updateContractor, deleteContractor,
  TRADE_TYPES, getLicenseVerifyUrl, getLicenseBoardName
} from '../lib/contractors'
import { isDeveloper } from '../lib/access'

const JURISDICTION_OPTIONS = [
  'raleigh', 'durham', 'chapelhill', 'apex', 'hollysprings',
  'wakeforest', 'morrisville', 'garner',
]
const JURISDICTION_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
  apex: 'Apex', hollysprings: 'Holly Springs', wakeforest: 'Wake Forest',
  morrisville: 'Morrisville', garner: 'Garner',
}

const RATING_LABELS = { 1: '⭐ Poor', 2: '⭐⭐ Fair', 3: '⭐⭐⭐ Good', 4: '⭐⭐⭐⭐ Great', 5: '⭐⭐⭐⭐⭐ Excellent' }
const TRADE_ICONS = {
  general: '🏗️', electrical: '⚡', plumbing: '🔧', hvac: '💨',
  structural: '📐', architect: '🏛️', surveyor: '🗺️', pool: '🏊',
  insulation: '🧱', roofing: '🏠', other: '👷',
}

const EMPTY_FORM = {
  name: '', company: '', tradeType: 'general', licenseNumber: '',
  licenseVerified: false, phone: '', email: '', jurisdictions: [],
  rating: '', notes: '', isPublic: false,
}

export default function Contractors() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filterTrade, setFilterTrade] = useState('all')

  useEffect(() => {
    if (!isDeveloper()) { navigate('/pricing'); return }
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const currentUser = await getUser()
      if (!currentUser) { navigate('/dashboard'); return }
      setUser(currentUser)
      const data = await getMyContractors()
      setContractors(data)
    } catch (err) {
      setError('Could not load contractors.')
    } finally {
      setLoading(false)
    }
  }

  function updateForm(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function toggleJurisdiction(jur) {
    setForm(f => ({
      ...f,
      jurisdictions: f.jurisdictions.includes(jur)
        ? f.jurisdictions.filter(j => j !== jur)
        : [...f.jurisdictions, jur],
    }))
  }

  function startEdit(contractor) {
    setEditingId(contractor.id)
    setForm({
      name: contractor.name || '',
      company: contractor.company || '',
      tradeType: contractor.trade_type || 'general',
      licenseNumber: contractor.license_number || '',
      licenseVerified: contractor.license_verified || false,
      phone: contractor.phone || '',
      email: contractor.email || '',
      jurisdictions: contractor.jurisdictions || [],
      rating: contractor.rating || '',
      notes: contractor.notes || '',
      isPublic: contractor.is_public || false,
    })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Contractor name is required'); return }
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        const updated = await updateContractor(editingId, {
          name: form.name, company: form.company, trade_type: form.tradeType,
          license_number: form.licenseNumber, license_verified: form.licenseVerified,
          phone: form.phone, email: form.email, jurisdictions: form.jurisdictions,
          rating: form.rating ? parseInt(form.rating) : null,
          notes: form.notes, is_public: form.isPublic,
        })
        setContractors(prev => prev.map(c => c.id === editingId ? updated : c))
      } else {
        const created = await addContractor(form)
        setContractors(prev => [created, ...prev])
      }
      cancelForm()
    } catch (err) {
      setError(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this contractor from your network?')) return
    try {
      await deleteContractor(id)
      setContractors(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError(`Delete failed: ${err.message}`)
    }
  }

  const filtered = contractors.filter(c => filterTrade === 'all' || c.trade_type === filterTrade)

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="animate-pulse text-gray-400 text-sm">Loading contractor network...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">← Dashboard</Link>
            <span className="text-xs text-gray-300">·</span>
            <Link to="/directory" className="text-xs text-brand-600 hover:text-brand-700">View public directory ↗</Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">My Contractor Network</h1>
          <p className="text-sm text-gray-400 mt-0.5">{contractors.length} contractor{contractors.length !== 1 ? 's' : ''} · Private to your account</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM) }}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add contractor
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-700 mb-5 flex justify-between">
          {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white border border-brand-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">
            {editingId ? 'Edit contractor' : 'Add contractor to your network'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Full name *</label>
              <input value={form.name} onChange={e => updateForm('name', e.target.value)}
                placeholder="John Smith"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Company name</label>
              <input value={form.company} onChange={e => updateForm('company', e.target.value)}
                placeholder="Smith Construction LLC"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Trade type *</label>
              <select value={form.tradeType} onChange={e => updateForm('tradeType', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {Object.entries(TRADE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Rating</label>
              <select value={form.rating} onChange={e => updateForm('rating', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">No rating yet</option>
                {Object.entries(RATING_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">
                NC License number
                {form.tradeType && (
                  <a href={getLicenseVerifyUrl(form.tradeType)} target="_blank" rel="noreferrer"
                    className="text-brand-600 hover:text-brand-700 ml-2 font-normal">
                    Verify at {getLicenseBoardName(form.tradeType)} ↗
                  </a>
                )}
              </label>
              <input value={form.licenseNumber} onChange={e => updateForm('licenseNumber', e.target.value)}
                placeholder="e.g. 78234"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  onClick={() => updateForm('licenseVerified', !form.licenseVerified)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.licenseVerified ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.licenseVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <div>
                  <div className="text-xs font-medium text-gray-700">License verified</div>
                  <div className="text-xs text-gray-400">I confirmed this license is active on the official board website</div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => updateForm('phone', e.target.value)}
                placeholder="(919) 555-0100"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Email</label>
              <input value={form.email} onChange={e => updateForm('email', e.target.value)}
                placeholder="john@smithconstruction.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-700 block mb-2">Jurisdictions they work in</label>
            <div className="flex flex-wrap gap-2">
              {JURISDICTION_OPTIONS.map(jur => (
                <button key={jur} onClick={() => toggleJurisdiction(jur)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.jurisdictions.includes(jur) ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {JURISDICTION_LABELS[jur]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-700 block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)}
              placeholder="e.g. Great on complex foundations, works well with Durham LDO reviewers, always submits clean packages"
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          <div className="mb-5 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3 flex items-start gap-3">
            <button
              onClick={() => updateForm('isPublic', !form.isPublic)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${form.isPublic ? 'bg-brand-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div>
              <div className="text-xs font-semibold text-brand-900">Add to public directory</div>
              <div className="text-xs text-brand-700 leading-relaxed mt-0.5">
                Verified contractors you mark as public appear in Parcoria's public contractor directory — visible to all homeowners. Only contractors with a verified license can be made public.
                {form.isPublic && !form.licenseVerified && (
                  <span className="text-amber-700 font-medium"> Verify the license above first.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={cancelForm}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add to network'}
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      {contractors.length > 0 && (
        <div className="flex items-center gap-3 mb-5">
          <select value={filterTrade} onChange={e => setFilterTrade(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none">
            <option value="all">All trades</option>
            {Object.entries(TRADE_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <span className="text-xs text-gray-400">{filtered.length} showing</span>
        </div>
      )}

      {/* Empty state */}
      {contractors.length === 0 && !showForm && (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-4">👷</div>
          <div className="text-sm font-semibold text-gray-800 mb-2">No contractors yet</div>
          <div className="text-xs text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Add the contractors you've worked with. Rate them, record their license numbers, and optionally share them in Parcoria's public directory.
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
            Add your first contractor
          </button>
        </div>
      )}

      {/* Contractor cards */}
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg">
                {TRADE_ICONS[c.trade_type] || '👷'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                  {c.company && <div className="text-xs text-gray-400">{c.company}</div>}
                  {c.license_verified && (
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full font-medium">✓ Verified</span>
                  )}
                  {c.is_public && (
                    <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full font-medium">Public</span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400">
                  <span>{TRADE_TYPES[c.trade_type]}</span>
                  {c.license_number && <span>License: {c.license_number}</span>}
                  {c.rating && <span>{'⭐'.repeat(c.rating)} ({c.rating}/5)</span>}
                  {c.phone && <span>{c.phone}</span>}
                </div>
                {c.jurisdictions?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {c.jurisdictions.map(j => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-full">
                        {JURISDICTION_LABELS[j] || j}
                      </span>
                    ))}
                  </div>
                )}
                {c.notes && <div className="text-xs text-gray-400 italic mt-1.5 leading-relaxed">{c.notes}</div>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => startEdit(c)}
                  className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors" title="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(c.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Remove">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
