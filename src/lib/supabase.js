import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Send magic link to email
export async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  })
  if (error) throw error
  return true
}

// Get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get current user
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sign out
export async function signOut() {
  await supabase.auth.signOut()
}

// Save a project to Supabase
export async function saveProject(project) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .upsert({
      id: project.id || undefined,
      user_id: user.id,
      user_email: user.email,
      name: project.name,
      jurisdiction: project.jurisdiction,
      address: project.addr,
      project_type: project.proj,
      cost: project.cost,
      flags: {
        historic: project.historic,
        septic: project.septic,
        flood: project.flood,
        corner: project.corner,
      },
      permit_count: project.permitCount,
      timeline: project.timeline,
      fees: project.fees,
      status: project.status || 'active',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get all projects for current user
export async function getProjects() {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Delete a project
export async function deleteProject(projectId) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) throw error
  return true
}
