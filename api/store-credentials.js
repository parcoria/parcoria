// api/store-credentials.js
// Stores portal credentials encrypted for one-time use by the Submission Agent
// Credentials are automatically purged after use or after 2 hours

import { createClient } from '@supabase/supabase-js'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.CREDENTIAL_ENCRYPTION_KEY || 'parcoria-dev-key-32-chars-pad!!!', 'utf8').slice(0, 32)

export function encrypt(text) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag()
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
}

export function decrypt(text) {
  const [ivHex, tagHex, encrypted] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(tag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }

  const { user_id, credentials, jurisdiction } = body || {}
  if (!user_id || !credentials?.username || !credentials?.password) {
    return res.status(400).json({ error: 'user_id and credentials required' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    const encrypted = encrypt(JSON.stringify(credentials))
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours

    const { data, error } = await supabase.from('portal_credentials').insert({
      user_id,
      jurisdiction,
      credentials: encrypted,
      expires_at: expiresAt,
      used: false,
    }).select('id').single()

    if (error) throw new Error(error.message)

    return res.status(200).json({ credentials_ref: data.id })
  } catch (err) {
    console.error('Credential storage error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
