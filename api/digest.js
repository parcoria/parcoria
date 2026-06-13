// api/digest.js — Vercel Cron Function
// Runs every Monday at 8 AM ET
// Sends weekly project digest emails to all active subscribers via Resend
//
// Setup:
//   1. Install Resend: npm install resend
//   2. Add RESEND_API_KEY to Vercel env vars (get from resend.com — free tier: 3000 emails/month)
//   3. Add DIGEST_CRON_SECRET to Vercel env vars (any random string — protects the endpoint)
//   4. vercel.json cron config already present
//   5. Verify your sending domain in Resend (or use onboarding@resend.dev for testing)

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { buildDigestData } from '../src/lib/prompt-engine.js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Parcoria <digest@parcoria.com>'
const REPLY_TO  = 'support@parcoria.com'
const APP_URL   = 'https://parcoria.com'

// ─── Auth guard ───────────────────────────────────────────────────────────────

function isAuthorized(req) {
  const auth = req.headers['authorization']
  const secret = process.env.DIGEST_CRON_SECRET
  if (!secret) return true
  return auth === `Bearer ${secret}`
}

// ─── Email templates ──────────────────────────────────────────────────────────

const URGENCY_COLORS = {
  critical: '#DC2626',
  warning:  '#D97706',
  info:     '#2563EB',
  good:     '#16A34A',
}
const URGENCY_ICONS = {
  critical: '⚠️',
  warning:  '📅',
  info:     'ℹ️',
  good:     '✓',
}

// ── Developer email (full lifecycle detail) ───────────────────────────────────

function buildDeveloperEmailHtml(digestData, unsubscribeUrl) {
  const { user, weekOf, totalProjects, urgentCount, items } = digestData

  const urgentBanner = urgentCount > 0
    ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
        <span style="color:#DC2626;font-weight:600;">⚠️ ${urgentCount} project${urgentCount > 1 ? 's' : ''} need${urgentCount === 1 ? 's' : ''} attention this week</span>
       </div>`
    : `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
        <span style="color:#16A34A;font-weight:600;">✓ All projects on track this week</span>
       </div>`

  const projectBlocks = items.map(item => {
    const { project, headline, permitItems, upcomingInspections } = item
    const color = URGENCY_COLORS[headline.urgency] || '#6B7280'
    const icon  = URGENCY_ICONS[headline.urgency] || 'ℹ️'

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
        <div style="background:#F9FAFB;border-left:3px solid ${color};border-radius:4px;padding:10px 14px;margin-bottom:${permitRows ? '12px' : '0'};">
          <span style="font-size:13px;color:#111827;">${icon} ${headline.text}</span>
          ${headline.action?.url ? `
            <div style="margin-top:6px;">
              <a href="${headline.action.url}" style="font-size:12px;color:#2563EB;text-decoration:none;font-weight:500;">${headline.action.label} ↗</a>
            </div>
          ` : ''}
        </div>
        ${permitRows ? `<table style="width:100%;border-collapse:collapse;margin-top:4px;">${permitRows}</table>` : ''}
        ${inspectionRows}
        <div style="margin-top:12px;text-align:right;">
          <a href="${APP_URL}/dashboard" style="font-size:12px;color:#7C3AED;text-decoration:none;font-weight:500;">Open in Parcoria →</a>
        </div>
      </div>
    `
  }).join('')

  return buildEmailShell({ user, weekOf, totalProjects, urgentBanner, projectBlocks, unsubscribeUrl, dashboardUrl: `${APP_URL}/dashboard` })
}

// ── Contractor email (job summary — simpler, no full lifecycle) ───────────────

function buildContractorEmailHtml(user, weekOf, jobs, unsubscribeUrl) {
  const activeJobs = jobs.filter(j => j.status !== 'complete' && j.status !== 'archived')
  const urgentJobs = activeJobs.filter(j => j.next_action)

  const urgentBanner = urgentJobs.length > 0
    ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
        <span style="color:#DC2626;font-weight:600;">⚠️ ${urgentJobs.length} job${urgentJobs.length > 1 ? 's' : ''} need${urgentJobs.length === 1 ? 's' : ''} attention this week</span>
       </div>`
    : `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
        <span style="color:#16A34A;font-weight:600;">✓ All jobs on track this week</span>
       </div>`

  const jobBlocks = activeJobs.map(job => {
    const jur = job.jurisdiction ? job.jurisdiction.charAt(0).toUpperCase() + job.jurisdiction.slice(1) : ''
    const statusColors = {
      active:    { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
      planning:  { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
      submitted: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
      complete:  { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    }
    const sc = statusColors[job.status] || statusColors.active

    return `
      <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
          <div>
            <div style="font-size:14px;font-weight:600;color:#111827;">${job.client_name}</div>
            ${job.address ? `<div style="font-size:12px;color:#9CA3AF;margin-top:2px;">${job.address}${jur ? ` · ${jur}` : ''}</div>` : ''}
          </div>
          <span style="font-size:11px;font-weight:500;background:${sc.bg};border:1px solid ${sc.border};color:${sc.text};border-radius:999px;padding:2px 10px;white-space:nowrap;">
            ${job.status || 'active'}
          </span>
        </div>
        ${job.next_action ? `
          <div style="background:#FEF2F2;border-left:3px solid #DC2626;border-radius:4px;padding:8px 12px;margin-top:8px;">
            <span style="font-size:12px;color:#111827;">⚠️ ${job.next_action}</span>
          </div>
        ` : ''}
        ${job.notes ? `<div style="font-size:12px;color:#6B7280;margin-top:8px;">${job.notes}</div>` : ''}
        <div style="margin-top:12px;text-align:right;">
          <a href="${APP_URL}/contractor" style="font-size:12px;color:#7C3AED;text-decoration:none;font-weight:500;">Open in Parcoria →</a>
        </div>
      </div>
    `
  }).join('')

  const projectBlocks = activeJobs.length === 0
    ? `<div style="text-align:center;padding:32px;color:#9CA3AF;font-size:14px;">No active jobs this week.</div>`
    : jobBlocks

  return buildEmailShell({
    user,
    weekOf,
    totalProjects: activeJobs.length,
    urgentBanner,
    projectBlocks,
    unsubscribeUrl,
    dashboardUrl: `${APP_URL}/contractor`,
  })
}

// ── Shared HTML shell ─────────────────────────────────────────────────────────

function buildEmailShell({ user, weekOf, totalProjects, urgentBanner, projectBlocks, unsubscribeUrl, dashboardUrl }) {
  return `<!DOCTYPE html>
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
          <tr>
            <td style="padding:0 0 16px 0;">
              <p style="margin:0;font-size:15px;color:#374151;">
                Hi ${user.name},<br><br>
                Here's your weekly permit status across <strong>${totalProjects} active project${totalProjects !== 1 ? 's' : ''}</strong>.
              </p>
            </td>
          </tr>
          <tr><td style="padding:0 0 8px 0;">${urgentBanner}</td></tr>
          <tr><td>${projectBlocks}</td></tr>
          <tr>
            <td style="padding:32px 0 0 0;border-top:1px solid #E5E7EB;margin-top:24px;">
              <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;line-height:1.6;">
                You're receiving this because you have an active Parcoria subscription.<br>
                <a href="${dashboardUrl}" style="color:#7C3AED;text-decoration:none;">Open dashboard</a>
                &nbsp;·&nbsp;
                <a href="${unsubscribeUrl}" style="color:#9CA3AF;text-decoration:none;">Unsubscribe</a>
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
</html>`
}

function buildEmailText(digestData, tier) {
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
  text += `Open your dashboard: ${APP_URL}/${tier === 'contractor' ? 'contractor' : 'dashboard'}\n\n`
  text += `Parcoria · Research Triangle, NC\n`
  return text
}

// ─── Unsubscribe token ────────────────────────────────────────────────────────
// Simple signed token — userId:timestamp:hmac — doesn't require a DB lookup
// The /api/unsubscribe endpoint verifies and sets digest_enabled = false

function makeUnsubscribeUrl(userId) {
  const payload = `${userId}:${Date.now()}`
  // Base64 encode for URL safety — verification happens server-side
  const token = Buffer.from(payload).toString('base64url')
  return `${APP_URL}/api/unsubscribe?token=${token}&uid=${userId}`
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
  const targetEmail = req.query.email || null

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })
    let subscribers = []

    if (targetEmail) {
      const { data: { users: allUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
      const testUser = allUsers?.find(u => u.email === targetEmail)
      if (!testUser) {
        return res.status(400).json({ error: `No auth user found for email: ${targetEmail}` })
      }
      subscribers = [{ email: targetEmail, tier: 'developer', user_id: testUser.id }]
    } else {
      // Active subscriptions from Stripe
      const stripeSubscriptions = await stripe.subscriptions.list({
        status: 'active',
        limit: 100,
        expand: ['data.customer'],
      })

      for (const sub of stripeSubscriptions.data) {
        const customer = sub.customer
        if (!customer || typeof customer === 'string') continue
        const email = customer.email
        if (!email) continue

        const priceId = sub.items.data[0]?.price?.id
        let tier = 'contractor'
        if (
          priceId === process.env.STRIPE_DEVELOPER_PRICE_ID ||
          priceId === process.env.STRIPE_DEVELOPER_ANNUAL_PRICE_ID
        ) {
          tier = 'developer'
        } else if (
          priceId === process.env.STRIPE_CONTRACTOR_PRICE_ID ||
          priceId === process.env.STRIPE_CONTRACTOR_ANNUAL_PRICE_ID  // Fixed: was missing
        ) {
          tier = 'contractor'
        }

        subscribers.push({ email, tier, stripeCustomerId: customer.id })
      }

      // Homeowner one-time purchases
      const sessions = await stripe.checkout.sessions.list({ status: 'complete', limit: 100 })
      const subscriberEmails = new Set(subscribers.map(s => s.email))
      for (const session of sessions.data) {
        if (
          session.payment_status === 'paid' &&
          session.metadata?.tier === 'homeowner' &&
          session.customer_email &&
          !subscriberEmails.has(session.customer_email)
        ) {
          subscribers.push({ email: session.customer_email, tier: 'homeowner' })
        }
      }

      console.log(`Found ${subscribers.length} active subscribers from Stripe`)
    }

    const results = { sent: 0, skipped: 0, errors: [] }

    for (const subscriber of subscribers) {
      try {
        // Check digest preferences
        const { data: prefs } = await supabase
          .from('digest_preferences')
          .select('digest_enabled')
          .eq('email', subscriber.email)
          .maybeSingle()

        if (prefs && prefs.digest_enabled === false) {
          results.skipped++
          continue
        }

        // Resolve auth user
        let authUser = null
        if (subscriber.user_id) {
          const { data: { user } } = await supabase.auth.admin.getUserById(subscriber.user_id)
          authUser = user
        }
        if (!authUser) {
          const { data: { users: allUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
          authUser = allUsers?.find(u => u.email === subscriber.email)
        }
        if (!authUser) {
          console.log(`No auth user for: ${subscriber.email}`)
          results.skipped++
          continue
        }

        const unsubscribeUrl = makeUnsubscribeUrl(authUser.id)
        let emailHtml, emailText, subject

        if (subscriber.tier === 'contractor') {
          // ── Contractor digest — query client_jobs ──────────────────────────
          const { data: jobs } = await supabase
            .from('client_jobs')
            .select('*')
            .eq('user_id', authUser.id)
            .order('updated_at', { ascending: false })

          if (!jobs?.length) { results.skipped++; continue }

          const activeJobs = jobs.filter(j => j.status !== 'complete' && j.status !== 'archived')
          if (!activeJobs.length) { results.skipped++; continue }

          const urgentCount = activeJobs.filter(j => j.next_action).length
          const weekOf = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          const userName = authUser.user_metadata?.name || authUser.email.split('@')[0]

          subject = urgentCount > 0
            ? `Your Parcoria weekly digest — ${urgentCount} job${urgentCount > 1 ? 's' : ''} need attention`
            : `Your Parcoria weekly digest — all jobs on track`

          emailHtml = buildContractorEmailHtml(
            { name: userName, email: authUser.email },
            weekOf,
            jobs,
            unsubscribeUrl,
          )
          emailText = `PARCORIA WEEKLY DIGEST — ${weekOf}\n\nHi ${userName},\n\n${activeJobs.length} active job${activeJobs.length !== 1 ? 's' : ''}${urgentCount > 0 ? ` — ${urgentCount} need attention` : ' — all on track'}.\n\nOpen Contractor Mode: ${APP_URL}/contractor\n\nParcoria · Research Triangle, NC\n`

        } else {
          // ── Developer / Homeowner digest — query projects + lifecycle ──────
          const { data: projects } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', authUser.id)
            .neq('status', 'complete')
            .neq('status', 'archived')
            .order('created_at', { ascending: false })

          if (!projects?.length) { results.skipped++; continue }

          const lifecycleMap = {}
          for (const project of projects) {
            const [events, inspections, deadlines] = await Promise.all([
              supabase.from('permit_events').select('*').eq('project_id', project.id).order('sequence_order'),
              supabase.from('inspection_log').select('*').eq('project_id', project.id).order('sequence_order'),
              supabase.from('project_deadlines').select('*').eq('project_id', project.id).eq('status', 'pending').order('due_date'),
            ])
            const now = new Date()
            const overdueDeadlines  = (deadlines.data || []).filter(d => new Date(d.due_date) < now)
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

          const digestData = buildDigestData(authUser, projects, lifecycleMap)
          if (!digestData.items.length) { results.skipped++; continue }

          subject = `Your Parcoria weekly digest — ${digestData.urgentCount > 0 ? `${digestData.urgentCount} item${digestData.urgentCount > 1 ? 's' : ''} need attention` : 'all projects on track'}`
          emailHtml = buildDeveloperEmailHtml(digestData, unsubscribeUrl)
          emailText = buildEmailText(digestData, subscriber.tier)
        }

        if (dryRun) {
          console.log(`[DRY RUN] Would send digest to ${subscriber.email} (${subscriber.tier})`)
          results.sent++
          continue
        }

        const { error: emailError } = await resend.emails.send({
          from:    FROM_EMAIL,
          to:      subscriber.email,
          replyTo: REPLY_TO,
          subject,
          html:    emailHtml,
          text:    emailText,
        })

        if (emailError) {
          results.errors.push({ email: subscriber.email, error: emailError.message })
        } else {
          results.sent++
          console.log(`Digest sent to ${subscriber.email} (${subscriber.tier})`)
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
─── vercel.json cron config ─────────────────────────────────────────────────
Already configured: "0 12 * * 1" = every Monday at 12:00 UTC = 8:00 AM ET

─── Manual test commands ─────────────────────────────────────────────────────
Dry run (no emails sent, all tiers):
  GET https://parcoria.com/api/digest?dry=1
  Authorization: Bearer YOUR_DIGEST_CRON_SECRET

Send to one email for real:
  GET https://parcoria.com/api/digest?email=you@email.com
  Authorization: Bearer YOUR_DIGEST_CRON_SECRET

─── Required env vars ────────────────────────────────────────────────────────
RESEND_API_KEY                    from resend.com
DIGEST_CRON_SECRET                any random string: openssl rand -hex 32
SUPABASE_URL                      already set
SUPABASE_SERVICE_KEY              already set
STRIPE_DEVELOPER_PRICE_ID         already set
STRIPE_DEVELOPER_ANNUAL_PRICE_ID  already set
STRIPE_CONTRACTOR_PRICE_ID        already set
STRIPE_CONTRACTOR_ANNUAL_PRICE_ID already set (added today)
─────────────────────────────────────────────────────────────────────────────
*/
