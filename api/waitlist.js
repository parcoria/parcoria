// api/waitlist.js — Vercel Serverless Function
// Saves waitlist signups to Supabase waitlist table
// Table schema: id (uuid), email (text), created_at (timestamptz), source (text)

import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  const { email, role, source } = body || {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  )

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase().trim(),
        source: source || 'waitlist_page',
        // Only include role if the column exists — safe to add later via migration
        ...(role ? { role } : {}),
      })

    // Ignore duplicate emails gracefully
    if (error && error.code !== '23505' && !error.message?.includes('duplicate')) {
      console.error('Waitlist insert error:', error.message)
      return res.status(500).json({ error: 'Could not save your email. Please try again.' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err.message)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
