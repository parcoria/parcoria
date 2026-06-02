// api/digest.js — Vercel Cron Function
// Runs every Monday at 8 AM ET
// Sends weekly project digest emails to all active subscribers via Resend
//
// Setup:
//   1. Install Resend: npm install resend
//   2. Add RESEND_API_KEY to Vercel env vars (get from resend.com — free tier: 3000 emails/month)
//   3. Add DIGEST_CRON_SECRET to Vercel env vars (any random string — protects the endpoint)
//   4. vercel.json cron config (see bottom of this file)
//   5. Verify your sending domain in Resend (or use onboarding@resend.dev for testing)

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { buildDigestData } from '../src/lib/prompt-engine.js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Parcoria <digest@parcoria.com>'
const REPLY_TO  = 'support@parcoria.com'

// ─── Auth guard ───────────────────────────────────────────────────────────────
// Called by Vercel cron — verify the secret so it can't be triggered externally

function isAuthorized(req) {
  const auth = req.headers['authorization']
  const secret = process.env.DIGEST_CRON_SECRET
  if (!secret) return true // dev: no secret set, allow
  return auth === `Bearer ${secret}`
}

// ─── Email template ───────────────────────────────────────────────────────────

const URGENCY_COLORS = {
  critical: '#DC2626',  // red-600
  warning:  '#D97706',  // amber-600
  info:     '#2563EB',  // blue-600
  good:     '#16A34A',  // green-600
}
const URGENCY_ICONS = {
  critical: '⚠️',
  warning:  '📅',
  info:     'ℹ️',
  good:     '✓',
}

function buildEmailHtml(digestData) {
  const { user, weekOf, totalProjects, urgentCount, items } = digestData

  const urgentBanner = urgentCount > 0 ? `
    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
      <span style="color:#DC2626;font-weight:600;">⚠️ ${urgentCount} project${urgentCount > 1 ? 's' : ''} need${urgentCount === 1 ? 's' : ''} attention this week</span>
    </div>
  ` : `
    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
      <span style="color:#16A34A;font-weight:600;">✓ All projects on track this week</span>
    </div>
  `

  const projectBlocks = items.map(item => {
    const { project, headline, permitItems, upcomingInspections } = item
    const color = URGENCY_COLORS[headline.urgency] || '#6B7280'
    const icon  = URGENCY_ICONS[headline.urgency]  || 'ℹ️'

    const permitRows = permitItems.slice(0, 4).map(p => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:12px;color:#374151;font-weight:500;">${p.permitName}</span>
          <span style="font-size:11px;color:#9CA3AF;margin-left:8px;">${p.stage.replace('_', ' ')}</span>
        </td>
        <td style="padding:6px 0;border-bottom:1px solid #F3F4F6;text-align:right;">
          <span style="font-size:11px;color:${URGENCY_COLORS[p.urgency] || '#6B7280'};">${p.text.length > 60 ? p.text.slice(0, 57) + '...' : p.text}</span>
        </td>
      </tr>
    `).join('')

    const inspectionRows = upcomingInspections.length > 0 ? `
      <div style="margin-top:10px;">
        <div style="font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Scheduled inspections</div>
        ${upcomingInspections.map(i => `
          <div style="font-size:12px;color:#374151;padding:3px 0;">
            📋 ${i.label}${i.scheduled_date ? ` — ${new Date(i.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''

    return `
      <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">
          <div>
            <div style="font-size:14px;font-weight:600;color:#111827;">${project.name}</div>
            ${project.address ? `<div style="font-size:12px;color:#9CA3AF;margin-top:2px;">${project.address}</div>` : ''}
          </div>
          <span style="font-size:11px;color:#6B7280;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:999px;padding:2px 10px;white-space:nowrap;">
            ${project.jurisdiction ? project.jurisdiction.charAt(0).toUpperCase() + project.jurisdiction.slice(1) : ''}
          </span>
        </div>

        <!-- Headline prompt -->
        <div style="background:#F9FAFB;border-left:3px solid ${color};border-radius:4px;padding:10px 14px;margin-bottom:${permitRows ? '12px' : '0'};">
          <span style="font-size:13px;color:#111827;">${icon} ${headline.text}</span>
          ${headline.action && headline.action.url ? `
            <div style="margin-top:6px;">
              <a href="${headline.action.url}" style="font-size:12px;color:#2563EB;text-decoration:none;font-weight:500;">${headline.action.label} ↗</a>
            </div>
          ` : ''}
        </div>

        ${permitRows ? `
          <table style="width:100%;border-collapse:collapse;margin-top:4px;">
            ${permitRows}
          </table>
        ` : ''}

        ${inspectionRows}

        <div style="margin-top:12px;text-align:right;">
          <a href="https://parcoria.com/dashboard" style="font-size:12px;color:#7C3AED;text-decoration:none;font-weight:500;">Open in Parcoria →</a>
        </div>
      </div>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Parcoria weekly digest</title>
    </head>
    <body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:32px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

              <!-- Header -->
              <tr>
                <td style="padding:0 0 24px 0;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div>
                      <span style="font-size:20px;font-weight:700;color:#111827;">Parcoria</span>
                      <span style="font-size:12px;color:#9CA3AF;margin-left:8px;">Weekly digest</span>
                    </div>
                    <span style="font-size:12px;color:#9CA3AF;">${weekOf}</span>
                  </div>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding:0 0 16px 0;">
                  <p style="margin:0;font-size:15px;color:#374151;">
                    Hi ${user.name},<br><br>
                    Here's your weekly permit status across <strong>${totalProjects} active project${totalProjects !== 1 ? 's' : ''}</strong>.
                  </p>
                </td>
              </tr>

              <!-- Urgent banner -->
              <tr>
                <td style="padding:0 0 8px 0;">${urgentBanner}</td>
              </tr>

              <!-- Project blocks -->
              <tr>
                <td>${projectBlocks}</td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:32px 0 0 0;border-top:1px solid #E5E7EB;margin-top:24px;">
                  <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;line-height:1.6;">
                    You're receiving this because you have an active Parcoria subscription.<br>
                    <a href="https://parcoria.com/dashboard" style="color:#7C3AED;text-decoration:none;">Manage preferences</a>
                    &nbsp;·&nbsp;
                    <a href="https://parcoria.com/dashboard" style="color:#9CA3AF;text-decoration:none;">Unsubscribe</a>
                    <br><br>
                    Parcoria · Research Triangle, NC
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function buildEmailText(digestData) {
  const { user, weekOf, totalProjects, urgentCount, items } = digestData
  let text = `PARCORIA WEEKLY DIGEST — ${weekOf}\n\nHi ${user.name},\n\n`
  text += `${totalProjects} active project${totalProjects !== 1 ? 's' : ''}`
  text += urgentCount > 0
    ? ` — ${urgentCount} need${urgentCount === 1 ? 's' : ''} attention.\n\n`
    : ` — all on track.\n\n`

  for (const item of items) {
    text += `── ${item.project.name} ──\n`
    text += `${item.headline.text}\n`
    if (item.headline.action?.url) text += `${item.headline.action.label}: ${item.headline.action.url}\n`
    text += '\n'
  }

  text += `Open your dashboard: https://parcoria.com/dashboard\n\n`
  text += `Parcoria · Research Triangle, NC\n`
  return text
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const dryRun = req.query.dry === '1'
  const targetEmail = req.query.email || null // send to a single user for testing

  try {
    // 1. Get all active subscribers from subscription_events
    // A user is an "active subscriber" if their most recent subscription event is
    // checkout_completed or invoice.payment_succeeded, not subscription_cancelled
    const { data: activeEmails, error: subError } = await supabase
      .from('subscription_events')
      .select('customer_email, tier')
      .in('event_type', ['checkout_completed', 'subscription_renewed'])
      .order('occurred_at', { ascending: false })

    if (subError) throw subError

    // Dedupe — keep most recent event per email
    const subscriberMap = {}
    for (const row of (activeEmails || [])) {
      if (!subscriberMap[row.customer_email]) {
        subscriberMap[row.customer_email] = row.tier
      }
    }

    // Remove cancelled users
    const { data: cancelledRows } = await supabase
      .from('subscription_events')
      .select('customer_email')
      .eq('event_type', 'subscription_cancelled')

    for (const row of (cancelledRows || [])) {
      delete subscriberMap[row.customer_email]
    }

    let subscribers = Object.entries(subscriberMap).map(([email, tier]) => ({ email, tier }))

    // Filter to single user if testing
    if (targetEmail) {
      subscribers = subscribers.filter(s => s.email === targetEmail)
      if (subscribers.length === 0) {
        // Allow testing with any email — add it manually
        subscribers = [{ email: targetEmail, tier: 'developer' }]
      }
    }

    const results = { sent: 0, skipped: 0, errors: [] }

    for (const subscriber of subscribers) {
      try {
        // Check digest preferences (skip if disabled)
        const { data: prefs } = await supabase
          .from('digest_preferences')
          .select('digest_enabled')
          .eq('user_id', subscriber.user_id)
          .maybeSingle()

        if (prefs && prefs.digest_enabled === false) {
          results.skipped++
          continue
        }

        // Get their Supabase auth user
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
        const authUser = users?.find(u => u.email === subscriber.email)
        if (!authUser) { results.skipped++; continue }

        // Get their projects
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', authUser.id)
          .neq('status', 'complete')
          .neq('status', 'archived')
          .order('created_at', { ascending: false })

        if (!projects?.length) { results.skipped++; continue }

        // Get lifecycle data for each project
        const lifecycleMap = {}
        for (const project of projects) {
          const [events, inspections, deadlines] = await Promise.all([
            supabase.from('permit_events').select('*').eq('project_id', project.id).order('sequence_order'),
            supabase.from('inspection_log').select('*').eq('project_id', project.id).order('sequence_order'),
            supabase.from('project_deadlines').select('*').eq('project_id', project.id).eq('status', 'pending').order('due_date'),
          ])

          const now = new Date()
          const overdueDeadlines = (deadlines.data || []).filter(d => new Date(d.due_date) < now)
          const upcomingDeadlines = (deadlines.data || []).filter(d => {
            const days = Math.ceil((new Date(d.due_date) - now) / 86400000)
            return days >= 0 && days <= 14
          })

          lifecycleMap[project.id] = {
            events:            events.data || [],
            inspections:       inspections.data || [],
            deadlines:         deadlines.data || [],
            overdueDeadlines,
            upcomingDeadlines,
          }
        }

        // Build digest data
        const digestData = buildDigestData(authUser, projects, lifecycleMap)
        if (!digestData.items.length) { results.skipped++; continue }

        if (dryRun) {
          console.log(`[DRY RUN] Would send digest to ${subscriber.email} — ${digestData.items.length} projects`)
          results.sent++
          continue
        }

        // Send email via Resend
        const { error: emailError } = await resend.emails.send({
          from:     FROM_EMAIL,
          to:       subscriber.email,
          replyTo:  REPLY_TO,
          subject:  `Your Parcoria weekly digest — ${digestData.urgentCount > 0 ? `${digestData.urgentCount} item${digestData.urgentCount > 1 ? 's' : ''} need attention` : 'all projects on track'}`,
          html:     buildEmailHtml(digestData),
          text:     buildEmailText(digestData),
        })

        if (emailError) {
          results.errors.push({ email: subscriber.email, error: emailError.message })
        } else {
          results.sent++
          console.log(`Digest sent to ${subscriber.email}`)
        }

        // Polite rate limiting — Resend free tier: 2 emails/second
        await new Promise(r => setTimeout(r, 600))

      } catch (userErr) {
        console.error(`Error processing ${subscriber.email}:`, userErr.message)
        results.errors.push({ email: subscriber.email, error: userErr.message })
      }
    }

    return res.status(200).json({
      success: true,
      dryRun,
      totalSubscribers: subscribers.length,
      ...results,
    })

  } catch (err) {
    console.error('Digest error:', err)
    return res.status(500).json({ error: err.message })
  }
}

/*
─── vercel.json cron config ──────────────────────────────────────────────────

Add this to your vercel.json (merge with existing routes):

{
  "crons": [
    {
      "path": "/api/digest",
      "schedule": "0 12 * * 1"
    }
  ]
}

"0 12 * * 1" = every Monday at 12:00 UTC = 8:00 AM ET

─── Manual test ─────────────────────────────────────────────────────────────

Dry run (no emails sent):
  GET https://your-domain.vercel.app/api/digest?dry=1
  Authorization: Bearer YOUR_DIGEST_CRON_SECRET

Send to a single email to test the real email:
  GET https://your-domain.vercel.app/api/digest?email=you@email.com
  Authorization: Bearer YOUR_DIGEST_CRON_SECRET

─── Required env vars ────────────────────────────────────────────────────────

RESEND_API_KEY        from resend.com (free: 3000 emails/month)
DIGEST_CRON_SECRET    any random string e.g. openssl rand -hex 32
SUPABASE_URL          already set
SUPABASE_SERVICE_KEY  already set

─────────────────────────────────────────────────────────────────────────────
*/
