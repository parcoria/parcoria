// src/lib/contractors.js
// Contractor network — private (per developer) + public directory
// NC license verification links to official licensing board portals

import { supabase, getUser } from './supabase'

export const TRADE_TYPES = {
  general:    'General Contractor',
  electrical: 'Electrician',
  plumbing:   'Plumber',
  hvac:       'HVAC / Mechanical',
  structural: 'Structural Engineer',
  architect:  'Architect',
  surveyor:   'Land Surveyor',
  pool:       'Pool Contractor',
  insulation: 'Insulation Contractor',
  roofing:    'Roofing Contractor',
  other:      'Other',
}

export const LICENSE_BOARDS = {
  general:    { name: 'NCLBGC', url: 'https://portal.nclbgc.org/public/search', phone: '(919) 571-4183' },
  electrical: { name: 'NCBEEC', url: 'https://www.ncbeec.org/license-lookup', phone: '(919) 733-9042' },
  plumbing:   { name: 'NC Plumbing/HVAC Board', url: 'https://www.nclicensing.org/license-lookup', phone: '(919) 875-3612' },
  hvac:       { name: 'NC Plumbing/HVAC Board', url: 'https://www.nclicensing.org/license-lookup', phone: '(919) 875-3612' },
  structural: { name: 'NC Board of Engineers', url: 'https://www.ncbels.org/licensee-search/', phone: '(919) 791-2000' },
  architect:  { name: 'NC Board of Architecture', url: 'https://www.ncbarch.org/license-lookup', phone: '(919) 838-1580' },
  surveyor:   { name: 'NC Board of Engineers', url: 'https://www.ncbels.org/licensee-search/', phone: '(919) 791-2000' },
  pool:       { name: 'NCLBGC (Specialty)', url: 'https://portal.nclbgc.org/public/search', phone: '(919) 571-4183' },
  other:      { name: 'NC Licensing Boards', url: 'https://nclbgc.org/license-search/', phone: '' },
}

// Add a contractor to user's private network
export async function addContractor(contractor) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('contractors')
    .insert({
      user_id: user.id,
      name: contractor.name,
      company: contractor.company || null,
      trade_type: contractor.tradeType,
      license_number: contractor.licenseNumber || null,
      license_verified: contractor.licenseVerified || false,
      phone: contractor.phone || null,
      email: contractor.email || null,
      jurisdictions: contractor.jurisdictions || [],
      rating: contractor.rating || null,
      notes: contractor.notes || null,
      is_public: contractor.isPublic || false,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Get current user's private contractor network
export async function getMyContractors() {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', user.id)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw new Error(error.message)
  return data || []
}

// Update a contractor
export async function updateContractor(id, updates) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('contractors')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Delete a contractor
export async function deleteContractor(id) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('contractors')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  return true
}

// Get public directory — contractors marked is_public = true
export async function getPublicDirectory({ tradeType, jurisdiction, search } = {}) {
  let query = supabase
    .from('contractors')
    .select('id, name, company, trade_type, license_number, license_verified, jurisdictions, rating, is_public')
    .eq('is_public', true)
    .eq('license_verified', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (tradeType && tradeType !== 'all') {
    query = query.eq('trade_type', tradeType)
  }
  if (jurisdiction && jurisdiction !== 'all') {
    query = query.contains('jurisdictions', [jurisdiction])
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%`)
  }

  const { data, error } = await query.limit(50)
  if (error) throw new Error(error.message)
  return data || []
}

export function getLicenseVerifyUrl(tradeType) {
  return LICENSE_BOARDS[tradeType]?.url || LICENSE_BOARDS.other.url
}

export function getLicenseBoardName(tradeType) {
  return LICENSE_BOARDS[tradeType]?.name || 'NC Licensing Board'
}
