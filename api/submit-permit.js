// api/submit-permit.js
// Queues a permit submission job in Supabase
// The Submission Agent (agent/submission-agent.js) polls and processes these

import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  // GET — check status of a submission
  if (req.method === 'GET') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { data, error } = await supabase.from('submission_queue').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(data)
  }

  // POST — queue a new submission
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }

  const {
    user_id,
    user_email,
    jurisdiction = 'durham',
    permit_type = 'building',
    project_id,
    form_data,         // the filled permit form fields
    pdf_filename,      // filename of the generated PDF
    portal_credentials_ref, // reference to encrypted credentials in vault — NEVER store raw passwords
    additional_files = [],  // plan sheets, checklists, etc.
  } = body || {}

  if (!user_id || !form_data) {
    return res.status(400).json({ error: 'user_id and form_data required' })
  }

  try {
    const { data, error } = await supabase.from('submission_queue').insert({
      user_id,
      user_email,
      jurisdiction,
      permit_type,
      project_id: project_id || null,
      form_data,
      pdf_filename: pdf_filename || null,
      portal_credentials_ref: portal_credentials_ref || null,
      additional_files,
      status: 'queued',
      queued_at: new Date().toISOString(),
      attempts: 0,
    }).select().single()

    if (error) throw new Error(error.message)

    return res.status(200).json({
      success: true,
      submission_id: data.id,
      status: 'queued',
      message: 'Your permit application has been queued. The Submission Agent will process it within a few minutes.',
    })
  } catch (err) {
    console.error('Queue error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
