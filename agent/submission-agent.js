// agent/submission-agent.js
// Parcoria Submission Agent — the PermitFlow killer for the Research Triangle
// Polls Supabase for queued permit submissions, submits them to municipal portals
//
// DEPLOYMENT: This runs as a long-running Node.js process, NOT on Vercel.
// Deploy on Railway, Render, or any always-on server.
// Requires: Node.js 18+, Playwright, @supabase/supabase-js
//
// Install: npm install playwright @supabase/supabase-js dotenv
// Run:     node agent/submission-agent.js
// PM2:     pm2 start agent/submission-agent.js --name parcoria-agent

import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const POLL_INTERVAL_MS = 30_000  // poll every 30 seconds
const MAX_ATTEMPTS = 3

// ─── Portal handlers ─────────────────────────────────────────────────────────

const PORTAL_HANDLERS = {
  durham_building:   submitDurhamBuilding,
  durham_electrical: submitDurhamLDO,
  durham_plumbing:   submitDurhamLDO,
  durham_mechanical: submitDurhamLDO,
  // raleigh_building:  submitRaleigh,   // Coming soon
  // chapelhill_building: submitChapelHill,
}

// ─── Durham Building Permit → Dplans ─────────────────────────────────────────

async function submitDurhamBuilding(browser, job) {
  const { form_data, pdf_path, additional_files } = job
  const { portal_username, portal_password } = job.credentials

  log(job, 'Opening Dplans portal...')
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Step 1 — Navigate to Dplans
    await page.goto('https://dplans.durhamnc.gov', { waitUntil: 'networkidle', timeout: 30000 })
    log(job, 'Dplans loaded')

    // Step 2 — Log in
    await page.click('[data-testid="login"], a:has-text("Login"), a:has-text("Sign In")')
    await page.waitForSelector('input[type="email"], input[name="email"], input[id*="email"]', { timeout: 10000 })
    await page.fill('input[type="email"], input[name="email"]', portal_username)
    await page.fill('input[type="password"], input[name="password"]', portal_password)
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')
    await page.waitForNavigation({ timeout: 15000 })
    log(job, 'Logged into Dplans')

    // Step 3 — Start new project / application
    await page.click('a:has-text("New"), button:has-text("New Application"), a:has-text("Apply")')
    await page.waitForSelector('[data-testid="project-type"], select, .project-type-selector', { timeout: 10000 })

    // Step 4 — Select residential building permit
    const permitTypeSelector = await page.$('select[name*="permit"], select[name*="type"]')
    if (permitTypeSelector) {
      await permitTypeSelector.selectOption({ label: /residential|building/i })
    }

    // Step 5 — Fill project address
    const addressField = await page.$('input[name*="address"], input[placeholder*="address"]')
    if (addressField) {
      await addressField.fill(form_data.jobAddress || '')
      // Wait for address validation / autocomplete
      await page.waitForTimeout(1500)
      const firstSuggestion = await page.$('.autocomplete-option, .suggestion, [role="option"]')
      if (firstSuggestion) await firstSuggestion.click()
    }

    log(job, 'Address entered')

    // Step 6 — Upload permit application PDF
    if (pdf_path) {
      const uploadInput = await page.$('input[type="file"]')
      if (uploadInput) {
        await uploadInput.setInputFiles(pdf_path)
        log(job, `Uploaded: ${pdf_path}`)
        await page.waitForTimeout(2000)
      }
    }

    // Step 7 — Upload additional files (plans, checklist, etc.)
    for (const filePath of (additional_files || [])) {
      const uploadInput = await page.$('input[type="file"]')
      if (uploadInput) {
        await uploadInput.setInputFiles(filePath)
        log(job, `Uploaded additional: ${filePath}`)
        await page.waitForTimeout(1500)
      }
    }

    // Step 8 — Submit
    await page.click('button:has-text("Submit"), button[type="submit"], a:has-text("Submit Application")')
    await page.waitForTimeout(3000)

    // Step 9 — Extract confirmation number
    const confirmationText = await page.textContent(
      '[data-testid="confirmation"], .confirmation-number, h2, .success-message'
    ).catch(() => null)

    const confirmationMatch = confirmationText?.match(/[A-Z0-9]{6,}-\d{4,}|#\d{6,}|\d{4,}-\d{4,}/)
    const confirmationNumber = confirmationMatch?.[0] || 'Submitted (confirmation number not extracted)'

    log(job, `Submitted! Confirmation: ${confirmationNumber}`)

    // Take screenshot for records
    const screenshotPath = `/tmp/submission-${job.id}.png`
    await page.screenshot({ path: screenshotPath, fullPage: false })

    await context.close()
    return { success: true, confirmation_number: confirmationNumber, screenshot: screenshotPath }

  } catch (err) {
    await page.screenshot({ path: `/tmp/submission-error-${job.id}.png` }).catch(() => {})
    await context.close()
    throw err
  }
}

// ─── Durham Trade Permits → LDO Portal ───────────────────────────────────────

async function submitDurhamLDO(browser, job) {
  const { form_data, pdf_path } = job
  const { portal_username, portal_password } = job.credentials

  log(job, 'Opening Durham LDO portal...')
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.goto('https://ldo4.durhamnc.gov/DurhamWeb', { waitUntil: 'networkidle', timeout: 30000 })
    log(job, 'LDO portal loaded')

    // Log in with CID
    await page.fill('input[name*="user"], input[name*="login"], input[id*="user"]', portal_username)
    await page.fill('input[type="password"]', portal_password)
    await page.click('button[type="submit"], input[type="submit"]')
    await page.waitForNavigation({ timeout: 15000 })
    log(job, 'Logged into LDO')

    // Navigate to permit application
    const permitType = job.permit_type // electrical, plumbing, mechanical
    await page.click(`a:has-text("Apply"), a:has-text("New Permit")`)
    await page.waitForTimeout(2000)

    // Select permit type
    const typeLink = await page.$(`a:has-text("${permitType}"), button:has-text("${permitType}")`)
    if (typeLink) await typeLink.click()
    await page.waitForTimeout(2000)

    // Fill address
    const addressInput = await page.$('input[name*="address"], input[placeholder*="address"]')
    if (addressInput) {
      await addressInput.fill(form_data.jobAddress || '')
      await page.waitForTimeout(1500)
    }

    // Upload signed application if available
    if (pdf_path) {
      const fileInput = await page.$('input[type="file"]')
      if (fileInput) {
        await fileInput.setInputFiles(pdf_path)
        await page.waitForTimeout(2000)
        log(job, `Uploaded PDF: ${pdf_path}`)
      }
    }

    // Submit
    await page.click('button:has-text("Submit"), input[type="submit"]')
    await page.waitForTimeout(3000)

    const confirmText = await page.textContent('body').catch(() => '')
    const confirmMatch = confirmText.match(/permit\s*#?\s*([A-Z0-9-]{6,})/i)
    const confirmationNumber = confirmMatch?.[1] || 'Submitted'

    log(job, `Submitted to LDO! Confirmation: ${confirmationNumber}`)
    await context.close()
    return { success: true, confirmation_number: confirmationNumber }

  } catch (err) {
    await page.screenshot({ path: `/tmp/ldo-error-${job.id}.png` }).catch(() => {})
    await context.close()
    throw err
  }
}

// ─── Queue processing ─────────────────────────────────────────────────────────

async function processJob(browser, job) {
  const handlerKey = `${job.jurisdiction}_${job.permit_type}`
  const handler = PORTAL_HANDLERS[handlerKey]

  if (!handler) {
    await updateJobStatus(job.id, 'error', null, `No handler for ${handlerKey}`)
    return
  }

  // Mark as processing
  await updateJobStatus(job.id, 'processing', null, null, { started_at: new Date().toISOString() })

  try {
    // Decrypt credentials from vault reference
    const credentials = await getCredentials(job.portal_credentials_ref, job.user_id)
    if (!credentials) throw new Error('Could not retrieve portal credentials')

    const result = await handler(browser, { ...job, credentials })

    await updateJobStatus(job.id, 'submitted', result.confirmation_number, null, {
      completed_at: new Date().toISOString(),
      screenshot_path: result.screenshot || null,
    })

    // Notify user
    await notifyUser(job, result.confirmation_number)

    console.log(`[Agent] ✅ Job ${job.id} submitted. Confirmation: ${result.confirmation_number}`)

  } catch (err) {
    const attempts = (job.attempts || 0) + 1
    const status = attempts >= MAX_ATTEMPTS ? 'failed' : 'queued'
    const retryAt = attempts < MAX_ATTEMPTS
      ? new Date(Date.now() + attempts * 5 * 60 * 1000).toISOString()
      : null

    await updateJobStatus(job.id, status, null, err.message, {
      attempts,
      retry_after: retryAt,
      last_error: err.message,
    })

    console.error(`[Agent] ❌ Job ${job.id} failed (attempt ${attempts}): ${err.message}`)
  }
}

async function updateJobStatus(id, status, confirmation, error, extra = {}) {
  await supabase.from('submission_queue').update({
    status,
    confirmation_number: confirmation || null,
    error_message: error || null,
    updated_at: new Date().toISOString(),
    ...extra,
  }).eq('id', id)
}

async function getCredentials(credentialsRef, userId) {
  if (!credentialsRef) return null
  // Credentials are stored encrypted in a separate vault table
  // credentialsRef is the row ID — never store raw passwords in submission_queue
  const { data } = await supabase
    .from('portal_credentials')
    .select('*')
    .eq('id', credentialsRef)
    .eq('user_id', userId)
    .single()

  if (!data) return null

  // TODO: Decrypt using server-side key (AES-256)
  // For now returns the stored object directly — add encryption before production
  return data.credentials
}

async function notifyUser(job, confirmationNumber) {
  // Update the project in Supabase with the confirmation number
  if (job.project_id) {
    await supabase.from('projects').update({
      submission_confirmation: confirmationNumber,
      submitted_at: new Date().toISOString(),
    }).eq('id', job.project_id)
  }

  // TODO: Send email notification via Resend/SendGrid
  console.log(`[Agent] Notify ${job.user_email}: Permit submitted, confirmation ${confirmationNumber}`)
}

function log(job, message) {
  console.log(`[Agent][${job.id?.slice(0,8)}][${job.jurisdiction}/${job.permit_type}] ${message}`)
}

// ─── Main poll loop ───────────────────────────────────────────────────────────

async function poll(browser) {
  try {
    const now = new Date().toISOString()
    const { data: jobs } = await supabase
      .from('submission_queue')
      .select('*')
      .eq('status', 'queued')
      .or(`retry_after.is.null,retry_after.lte.${now}`)
      .lt('attempts', MAX_ATTEMPTS)
      .order('queued_at', { ascending: true })
      .limit(3)

    if (!jobs?.length) return

    console.log(`[Agent] Found ${jobs.length} job(s) to process`)

    for (const job of jobs) {
      await processJob(browser, job)
    }
  } catch (err) {
    console.error('[Agent] Poll error:', err.message)
  }
}

async function main() {
  console.log('[Agent] 🤖 Parcoria Submission Agent starting...')
  console.log(`[Agent] Polling every ${POLL_INTERVAL_MS / 1000}s`)
  console.log('[Agent] Portals: Durham Dplans, Durham LDO')

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log('[Agent] Browser ready')

  // Initial poll
  await poll(browser)

  // Poll on interval
  setInterval(() => poll(browser), POLL_INTERVAL_MS)

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Agent] Shutting down gracefully...')
    await browser.close()
    process.exit(0)
  })
}

main().catch(err => {
  console.error('[Agent] Fatal error:', err)
  process.exit(1)
})
