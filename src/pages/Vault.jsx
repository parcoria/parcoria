import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getUser, getProjects } from '../lib/supabase'
import {
  uploadDocument, getDocuments, downloadDocument, deleteDocument,
  formatFileSize, DOCUMENT_TYPES, MILESTONE_TAGS
} from '../lib/vault'
import { isDeveloper } from '../lib/access'

const TYPE_ICONS = {
  survey: '🗺️', permit_application: '📋', permit_approval: '✅',
  inspection_report: '🔍', contractor_license: '👷', lien_agent: '📎',
  architectural_plans: '📐', structural_plans: '🏗️', co: '🏠',
  fema_elevation: '🌊', insurance: '🛡️', other: '📄',
}

const MILESTONE_COLORS = {
  pre_permit:          'bg-gray-100 text-gray-600 border-gray-200',
  under_review:        'bg-amber-50 text-amber-700 border-amber-100',
  active_construction: 'bg-blue-50 text-blue-700 border-blue-100',
  inspection:          'bg-purple-50 text-purple-700 border-purple-100',
  final:               'bg-green-50 text-green-700 border-green-100',
  archived:            'bg-gray-50 text-gray-500 border-gray-100',
}

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.dwg,.dxf'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export default function Vault() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [user, setUser] = useState(null)
  const [project, setProject] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterMilestone, setFilterMilestone] = useState('all')

  // Upload form state
  const [pendingFile, setPendingFile] = useState(null)
  const [docType, setDocType] = useState('other')
  const [milestoneTag, setMilestoneTag] = useState('pre_permit')
  const [notes, setNotes] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    if (!isDeveloper()) {
      navigate('/pricing')
      return
    }
    loadAll()
  }, [projectId])

  async function loadAll() {
    setLoading(true)
    try {
      const currentUser = await getUser()
      if (!currentUser) { navigate('/dashboard'); return }
      setUser(currentUser)

      const projects = await getProjects()
      const proj = projects.find(p => p.id === projectId)
      if (!proj) { navigate('/dashboard'); return }
      setProject(proj)

      const docs = await getDocuments(projectId)
      setDocuments(docs)
    } catch (err) {
      setError('Could not load vault. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) selectFile(file)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) selectFile(file)
  }

  function selectFile(file) {
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 50MB.')
      return
    }
    setPendingFile(file)
    setShowUploadForm(true)
    setError('')
    // Auto-detect document type from filename
    const name = file.name.toLowerCase()
    if (name.includes('survey') || name.includes('plot')) setDocType('survey')
    else if (name.includes('permit') && name.includes('approv')) setDocType('permit_approval')
    else if (name.includes('permit')) setDocType('permit_application')
    else if (name.includes('inspection')) setDocType('inspection_report')
    else if (name.includes('license')) setDocType('contractor_license')
    else if (name.includes('lien')) setDocType('lien_agent')
    else if (name.includes('arch') || name.includes('floor')) setDocType('architectural_plans')
    else if (name.includes('struct')) setDocType('structural_plans')
    else if (name.includes('co') || name.includes('occupancy')) setDocType('co')
    else if (name.includes('fema') || name.includes('elevation')) setDocType('fema_elevation')
    else if (name.includes('insur')) setDocType('insurance')
    else setDocType('other')
  }

  async function handleUpload() {
    if (!pendingFile || !projectId) return
    setUploading(true)
    setUploadProgress(`Uploading ${pendingFile.name}...`)
    setError('')
    try {
      const doc = await uploadDocument({
        projectId,
        file: pendingFile,
        documentType: docType,
        milestoneTag,
        notes,
      })
      setDocuments(prev => [doc, ...prev])
      setPendingFile(null)
      setShowUploadForm(false)
      setNotes('')
      setDocType('other')
      setMilestoneTag('pre_permit')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  async function handleDownload(doc) {
    try {
      await downloadDocument(doc)
    } catch (err) {
      setError(`Download failed: ${err.message}`)
    }
  }

  async function handleDelete(doc) {
    if (!confirm(`Delete "${doc.file_name}"? This cannot be undone.`)) return
    try {
      await deleteDocument(doc)
      setDocuments(prev => prev.filter(d => d.id !== doc.id))
    } catch (err) {
      setError(`Delete failed: ${err.message}`)
    }
  }

  const filteredDocs = documents.filter(doc => {
    if (filterType !== 'all' && doc.document_type !== filterType) return false
    if (filterMilestone !== 'all' && doc.milestone_tag !== filterMilestone) return false
    return true
  })

  // Group by milestone
  const grouped = {}
  filteredDocs.forEach(doc => {
    const tag = doc.milestone_tag || 'pre_permit'
    if (!grouped[tag]) grouped[tag] = []
    grouped[tag].push(doc)
  })

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="animate-pulse text-gray-400 text-sm">Loading evidence vault...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">← Dashboard</Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            🔒 Evidence Vault
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {project?.name || project?.address || 'Project'} · {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowUploadForm(true); fileInputRef.current?.click() }}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload document
        </button>
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFileChange} className="hidden" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-700 mb-5 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Upload form */}
      {showUploadForm && (
        <div className="bg-white border border-brand-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {pendingFile ? `Upload: ${pendingFile.name}` : 'Select a document to upload'}
          </h3>

          {!pendingFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="text-3xl mb-2">📁</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Drop your file here or click to browse</div>
              <div className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX, DWG — max 50MB</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{TYPE_ICONS[docType] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{pendingFile.name}</div>
                  <div className="text-xs text-gray-400">{formatFileSize(pendingFile.size)}</div>
                </div>
                <button onClick={() => { setPendingFile(null); setShowUploadForm(false); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="text-gray-400 hover:text-gray-600 text-xs">Remove</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Document type</label>
                  <select value={docType} onChange={e => setDocType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.entries(DOCUMENT_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1.5">Project milestone</label>
                  <select value={milestoneTag} onChange={e => setMilestoneTag(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.entries(MILESTONE_TAGS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Signed by John Smith PE, Wake County approval #2024-1234"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setPendingFile(null); setShowUploadForm(false); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-300 transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpload} disabled={uploading}
                  className="flex-1 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50">
                  {uploading ? uploadProgress : 'Upload to vault'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      {documents.length > 0 && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
            <option value="all">All types</option>
            {Object.entries(DOCUMENT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={filterMilestone} onChange={e => setFilterMilestone(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500">
            <option value="all">All milestones</option>
            {Object.entries(MILESTONE_TAGS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {(filterType !== 'all' || filterMilestone !== 'all') && (
            <button onClick={() => { setFilterType('all'); setFilterMilestone('all') }}
              className="text-xs text-gray-400 hover:text-gray-600">Clear filters</button>
          )}
        </div>
      )}

      {/* Empty state */}
      {documents.length === 0 && !showUploadForm && (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2xl p-16 text-center transition-colors ${dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}
        >
          <div className="text-4xl mb-4">🔒</div>
          <div className="text-sm font-semibold text-gray-800 mb-2">No documents yet</div>
          <div className="text-xs text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Upload permits, surveys, inspection reports, contractor licenses, and any other project documents. Everything is stored securely and timestamped.
          </div>
          <button onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload first document
          </button>
          <div className="text-xs text-gray-400 mt-3">or drag and drop anywhere on this page</div>
        </div>
      )}

      {/* Documents grouped by milestone */}
      {Object.entries(MILESTONE_TAGS).map(([tag, tagLabel]) => {
        const docs = grouped[tag]
        if (!docs || docs.length === 0) return null
        return (
          <div key={tag} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${MILESTONE_COLORS[tag]}`}>{tagLabel}</span>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">{docs.length} file{docs.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {docs.map(doc => (
                <div key={doc.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors">
                  <span className="text-xl flex-shrink-0">{TYPE_ICONS[doc.document_type] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-400">{DOCUMENT_TYPES[doc.document_type] || 'Document'}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{formatFileSize(doc.file_size)}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{new Date(doc.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {doc.notes && (
                        <>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-500 italic truncate max-w-xs">{doc.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleDownload(doc)}
                      className="p-2 text-gray-400 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50"
                      title="Download">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(doc)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Disclaimer */}
      {documents.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-400 leading-relaxed">
          🔒 All documents are stored privately in Parcoria's secure vault. Files are encrypted at rest. Only you can access your documents. Timestamps are recorded on upload and cannot be modified.
        </div>
      )}
    </div>
  )
}
