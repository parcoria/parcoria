// src/lib/vault.js
// Evidence Vault — Supabase Storage + documents table
// Handles upload, download, list, and delete for project documents

import { supabase, getUser } from './supabase'

const BUCKET = 'documents'

export const DOCUMENT_TYPES = {
  survey:              'Survey / Plot Plan',
  permit_application:  'Permit Application',
  permit_approval:     'Permit Approval',
  inspection_report:   'Inspection Report',
  contractor_license:  'Contractor License',
  lien_agent:          'Lien Agent Filing',
  architectural_plans: 'Architectural Plans',
  structural_plans:    'Structural Plans',
  co:                  'Certificate of Occupancy',
  fema_elevation:      'FEMA Elevation Certificate',
  insurance:           'Insurance Certificate',
  other:               'Other',
}

export const MILESTONE_TAGS = {
  pre_permit:           'Pre-Permit',
  under_review:         'Under Review',
  active_construction:  'Active Construction',
  inspection:           'Inspection Stage',
  final:                'Final / Close-Out',
  archived:             'Archived',
}

// Upload a file to Supabase Storage and record in documents table
export async function uploadDocument({ projectId, file, documentType = 'other', milestoneTag = 'pre_permit', notes = '' }) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  // Create a unique path: userId/projectId/timestamp-filename
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${user.id}/${projectId}/${timestamp}-${safeName}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

  // Record in documents table
  const { data, error: dbError } = await supabase
    .from('documents')
    .insert({
      project_id: projectId,
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      document_type: documentType,
      milestone_tag: milestoneTag,
      notes,
    })
    .select()
    .single()

  if (dbError) {
    // Clean up storage if DB insert fails
    await supabase.storage.from(BUCKET).remove([filePath])
    throw new Error(`Database error: ${dbError.message}`)
  }

  return data
}

// Get all documents for a project
export async function getDocuments(projectId) {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// Get a signed download URL (valid for 60 minutes)
export async function getDownloadUrl(filePath) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 3600)

  if (error) throw new Error(`Download URL error: ${error.message}`)
  return data.signedUrl
}

// Download a document directly
export async function downloadDocument(doc) {
  const url = await getDownloadUrl(doc.file_path)
  const a = document.createElement('a')
  a.href = url
  a.download = doc.file_name
  a.click()
}

// Delete a document
export async function deleteDocument(doc) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([doc.file_path])

  if (storageError) throw new Error(`Storage delete error: ${storageError.message}`)

  // Delete from database
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', doc.id)
    .eq('user_id', user.id)

  if (dbError) throw new Error(`Database delete error: ${dbError.message}`)
  return true
}

// Format file size
export function formatFileSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
