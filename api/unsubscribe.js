// api/unsubscribe.js
// One-click unsubscribe from the weekly digest email
// Linked from the digest email footer — no login required
// Sets digest_enabled = false in digest_preferences table

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

export default async function handler(req, res) {
  const { token, uid } = req.query

  if (!token || !uid) {
    return res.status(400).send(errorPage('Invalid unsubscribe link. Please contact support@parcoria.com.'))
  }

  try {
    // Verify token — decode and check uid matches
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const [tokenUid] = decoded.split(':')

    if (tokenUid !== uid) {
      return res.status(400).send(errorPage('Invalid unsubscribe link.'))
    }

    // Look up user email
    const { data: { user }, error: userErr } = await supabase.auth.admin.getUserById(uid)
    if (userErr || !user) {
      return res.status(400).send(errorPage('User not found. Please contact support@parcoria.com.'))
    }

    // Upsert digest_preferences — set digest_enabled = false
    const { error: prefErr } = await supabase
      .from('digest_preferences')
      .upsert(
        { user_id: uid, email: user.email, digest_enabled: false, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )

    if (prefErr) {
      console.error('Unsubscribe error:', prefErr.message)
      return res.status(500).send(errorPage('Something went wrong. Please contact support@parcoria.com.'))
    }

    console.log(`Unsubscribed: ${user.email}`)
    return res.status(200).send(successPage(user.email))

  } catch (err) {
    console.error('Unsubscribe error:', err.message)
    return res.status(500).send(errorPage('Something went wrong. Please try again or contact support@parcoria.com.'))
  }
}

function successPage(email) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — Parcoria</title>
  <style>
    body { margin: 0; padding: 0; background: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 48px; max-width: 400px; text-align: center; }
    .icon { font-size: 40px; margin-bottom: 16px; }
    h1 { font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 8px; }
    p { font-size: 14px; color: #6B7280; margin: 0 0 24px; line-height: 1.6; }
    a { display: inline-block; padding: 10px 24px; background: #7C3AED; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; }
    .note { font-size: 12px; color: #9CA3AF; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>You've been unsubscribed</h1>
    <p>${email} will no longer receive the weekly Parcoria digest. You can re-enable it anytime from your account settings.</p>
    <a href="https://parcoria.com">Back to Parcoria</a>
    <div class="note">Your account and data are not affected.</div>
  </div>
</body>
</html>`
}

function errorPage(message) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Error — Parcoria</title>
  <style>
    body { margin: 0; padding: 0; background: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 48px; max-width: 400px; text-align: center; }
    h1 { font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 8px; }
    p { font-size: 14px; color: #6B7280; margin: 0 0 24px; }
    a { display: inline-block; padding: 10px 24px; background: #7C3AED; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong</h1>
    <p>${message}</p>
    <a href="https://parcoria.com">Back to Parcoria</a>
  </div>
</body>
</html>`
}
