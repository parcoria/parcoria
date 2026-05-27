// src/lib/client-jobs.js
// Client job tracking for Contractor Mode
// Each job = a client's construction project the contractor is managing

import { supabase, getUser } from './supabase'

export const JOB_STATUSES = {
  active:     'Active',
  permitting: 'Permitting',
  inspection: 'Inspection Stage',
  complete:   'Complete',
  on_hold:    'On Hold',
}

export const PERMIT_STATUSES = {
  not_started:   'Not started',
  applied:       'Applied',
  under_review:  'Under review',
  approved:      'Approved',
  inspection:    'Inspection scheduled',
  passed:        'Passed',
  failed:        'Failed — correction needed',
  co_issued:     'CO issued',
}

export const STATUS_COLORS = {
  not_started:  'bg-gray-100 text-gray-500 border-gray-200',
  applied:      'bg-blue-50 text-blue-700 border-blue-100',
  under_review: 'bg-amber-50 text-amber-700 border-amber-100',
  approved:     'bg-green-50 text-green-700 border-green-100',
  inspection:   'bg-purple-50 text-purple-700 border-purple-100',
  passed:       'bg-green-50 text-green-700 border-green-100',
  failed:       'bg-red-50 text-red-700 border-red-100',
  co_issued:    'bg-brand-50 text-brand-700 border-brand-100',
}

export async function getJobs() {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('client_jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createJob(job) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('client_jobs')
    .insert({
      user_id: user.id,
      client_name: job.clientName,
      address: job.address,
      jurisdiction: job.jurisdiction,
      project_type: job.projectType,
      status: job.status || 'active',
      permit_statuses: job.permitStatuses || {},
      notes: job.notes || null,
      next_action: job.nextAction || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateJob(id, updates) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('client_jobs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteJob(id) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('client_jobs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  return true
}
