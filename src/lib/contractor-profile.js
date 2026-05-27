// src/lib/contractor-profile.js
// Contractor Profile — save license, insurance, business info once
// Stored in Supabase contractor_profiles table, tied to auth user

import { supabase, getUser } from './supabase'

export const LICENSE_TYPES = {
  gc:          'General Contractor (GC)',
  electrical:  'Electrical Contractor',
  plumbing:    'Plumbing Contractor',
  hvac:        'HVAC / Mechanical Contractor',
  fire:        'Fire Protection Contractor',
  insulation:  'Insulation Contractor',
  roofing:     'Roofing Contractor',
  pool:        'Swimming Pool Contractor',
  elevator:    'Elevator Contractor',
  other:       'Other Licensed Trade',
}

export const JURISDICTIONS_LIST = [
  { id: 'raleigh',      label: 'Raleigh' },
  { id: 'durham',       label: 'Durham' },
  { id: 'chapelhill',   label: 'Chapel Hill' },
  { id: 'apex',         label: 'Apex' },
  { id: 'hollysprings', label: 'Holly Springs' },
  { id: 'wakeforest',   label: 'Wake Forest' },
  { id: 'morrisville',  label: 'Morrisville' },
  { id: 'garner',       label: 'Garner' },
]

export async function getProfile() {
  const user = await getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('contractor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data || null
}

export async function saveProfile(profile) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const payload = {
    user_id: user.id,
    user_email: user.email,
    business_name: profile.businessName,
    dba: profile.dba || null,
    license_type: profile.licenseType,
    license_number: profile.licenseNumber,
    license_expires: profile.licenseExpires || null,
    insurance_carrier: profile.insuranceCarrier || null,
    insurance_policy: profile.insurancePolicy || null,
    insurance_expires: profile.insuranceExpires || null,
    bond_number: profile.bondNumber || null,
    phone: profile.phone || null,
    email: profile.email || null,
    address: profile.address || null,
    jurisdictions: profile.jurisdictions || [],
    updated_at: new Date().toISOString(),
  }

  const existing = await getProfile()

  if (existing) {
    const { data, error } = await supabase
      .from('contractor_profiles')
      .update(payload)
      .eq('user_id', user.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  } else {
    const { data, error } = await supabase
      .from('contractor_profiles')
      .insert(payload)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

// Generate pre-filled application checklist from profile
export function generateApplicationChecklist(profile, permitType, jurisdiction) {
  if (!profile) return null
  return {
    businessName: profile.business_name,
    dba: profile.dba,
    licenseType: profile.license_type,
    licenseNumber: profile.license_number,
    licenseExpires: profile.license_expires,
    insuranceCarrier: profile.insurance_carrier,
    insurancePolicy: profile.insurance_policy,
    bondNumber: profile.bond_number,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  }
}

// Check for expiring credentials (within 60 days)
export function getExpiringCredentials(profile) {
  if (!profile) return []
  const warnings = []
  const now = new Date()
  const soon = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

  if (profile.license_expires) {
    const exp = new Date(profile.license_expires)
    if (exp < soon) warnings.push({ type: 'license', expires: profile.license_expires, label: 'NC License' })
  }
  if (profile.insurance_expires) {
    const exp = new Date(profile.insurance_expires)
    if (exp < soon) warnings.push({ type: 'insurance', expires: profile.insurance_expires, label: 'Insurance Policy' })
  }
  return warnings
}
