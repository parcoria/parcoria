// agent/test-agent.js
// End-to-end test for the Parcoria Submission Agent
// Tests: queue → pickup → portal login → upload → confirmation
//
// Usage:
//   node agent/test-agent.js                    # dry run (no real portal)
//   node agent/test-agent.js --real             # real portal submission
//   node agent/test-agent.js --watch <id>       # watch an existing job
//   node agent/test-agent.js --selectors        # test portal selectors only

import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const args = process.argv.slice(2)
const REAL_SUBMIT  = args.includes('--real')
const WATCH_ID     = args.includes('--watch') ? args[args.indexOf('--watch') + 1] : null
const TEST_SELECTORS = args.includes('--selectors')

// ─── Test form data ───────────────────────────────────────────────────────────

const TEST_FORM = {
  jobAddress:       '123 Test St, Durham, NC 27701',
  lotUnit:          '',
  subdivision:      'Test Subdivision',
  jobDescription:   'TEST SUBMISSION — DO NOT PROCESS — New single-family residential structure',
  contractorName:   'Test Contractor LLC',
  contractorLicense:'99999',
  durhamCID:        process.env.TEST_DURHAM_CID || 'TEST-CID',
  contractorEmail:  process.env.TEST_EMAIL || 'test@parcoria.com',
  contractorPhone:  '(919) 555-0100',
  contractorAddress:'100 Test Ave',
  contractorCity:   'Durham',
  contractorState:  'NC',
  contractorZip:    '27701',
  ownerName:        'Test Owner',
  ownerEmail:       'owner@test.com',
  ownerPhone:       '(919) 555-0200',
  signerName:       'Test Contractor LLC',
  signDate:         new Date().toLocaleDateString('en-US'),
  building:         '$150,000.00',
  electrical:       '$25,000.00',
  plumbing:         '$15,000.00',
  mechanical:       '$20,000.00',
  fire:             '$0.00',
  hasElectrical:    true,
  hasPlumbing:      true,
  hasMechanical:    true,
  hasFire:          false,
  landDisturbance:  false,
  publicFood:       false,
  sprinkler:        false,
  subSlab:          false,
  wellSeptic:       false,
  drainage:         false,
}

// ─── Test 1: Watch existing job ───────────────────────────────────────────────

async function watchJob(id) {
  console.log(`\n👁  Watching submission job: ${id}`)
  console.log('Polling every 5 seconds...\n')

  let lastStatus = null

  const poll = setInterval(async () => {
    const { data, error } = await supabase
      .from('submission_queue')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Job not found:', error.message)
      clearInterval(poll)
      return
    }

    if (data.status !== lastStatus) {
      lastStatus = data.status
      const ts = new Date().toLocaleTimeString()

      console.log(`[${ts}] Status: ${statusEmoji(data.status)} ${data.status.toUpperCase()}`)

      if (data.confirmation_number) {
        console.log(`         ✅ Confirmation: ${data.confirmation_number}`)
      }
      if (data.error_message) {
        console.log(`         ❌ Error: ${data.error_message}`)
      }
      if (data.attempts > 0) {
        console.log(`         🔄 Attempts: ${data.attempts}`)
      }

      if (['submitted', 'failed', 'error'].includes(data.status)) {
        console.log('\n' + '─'.repeat(50))
        if (data.status === 'submitted') {
          console.log('🎉 SUCCESS! Permit submitted.')
          console.log(`   Confirmation number: ${data.confirmation_number}`)
          console.log(`   Submitted at: ${data.completed_at}`)
        } else {
          console.log('💥 FAILED after', data.attempts, 'attempts')
          console.log('   Last error:', data.last_error || data.error_message)
        }
        console.log('─'.repeat(50))
        clearInterval(poll)
        process.exit(data.status === 'submitted' ? 0 : 1)
      }
    }
  }, 5000)
}

function statusEmoji(status) {
  return { queued: '⏳', processing: '🤖', submitted: '✅', failed: '❌', error: '⚠️' }[status] || '❓'
}

// ─── Test 2: Selector test — verify portal elements exist ─────────────────────

async function testSelectors() {
  console.log('\n🔍 Testing Dplans portal selectors...')
  console.log('(No login — just checking the page structure)\n')

  const browser = await chromium.launch({ headless: false }) // visible so you can watch
  const page = await browser.newPage()

  try {
    // Test Dplans landing page
    console.log('1. Loading Dplans...')
    await page.goto('https://dplans.durhamnc.gov', { waitUntil: 'networkidle', timeout: 30000 })
    console.log('   ✅ Page loaded:', await page.title())

    // Check for login link
    const loginLink = await page.$('a:has-text("Login"), a:has-text("Sign In"), a:has-text("Log In"), [data-testid="login"]')
    console.log('   Login link:', loginLink ? '✅ Found' : '❌ Not found — update selector in submission-agent.js')

    // Take screenshot
    await page.screenshot({ path: '/tmp/dplans-test.png' })
    console.log('   Screenshot saved: /tmp/dplans-test.png')

    // Test LDO portal
    console.log('\n2. Loading LDO portal...')
    await page.goto('https://ldo4.durhamnc.gov/DurhamWeb', { waitUntil: 'networkidle', timeout: 30000 })
    console.log('   ✅ Page loaded:', await page.title())

    const lodoLogin = await page.$('input[name*="user"], input[name*="login"], input[id*="user"]')
    console.log('   Username field:', lodoLogin ? '✅ Found' : '❌ Not found — update selector')

    await page.screenshot({ path: '/tmp/ldo-test.png' })
    console.log('   Screenshot saved: /tmp/ldo-test.png')

    console.log('\n✅ Selector test complete. Check /tmp/ for screenshots.')
    console.log('   If any selectors show ❌, update them in agent/submission-agent.js\n')

  } catch (err) {
    console.error('❌ Selector test failed:', err.message)
    await page.screenshot({ path: '/tmp/selector-error.png' }).catch(() => {})
  } finally {
    await browser.close()
  }
}

// ─── Test 3: Dry run — queue job, verify agent picks it up ───────────────────

async function dryRun() {
  console.log('\n🧪 DRY RUN — queuing test submission')
  console.log('The agent will pick this up and attempt to submit.')
  console.log('Job description contains "TEST SUBMISSION" so portal may reject it — that\'s expected.\n')

  // Insert a test job directly into the queue
  const { data, error } = await supabase.from('submission_queue').insert({
    user_id:      '00000000-0000-0000-0000-000000000001', // test user
    user_email:   process.env.TEST_EMAIL || 'test@parcoria.com',
    jurisdiction: 'durham',
    permit_type:  'building',
    form_data:    TEST_FORM,
    pdf_filename: 'test-submission.pdf',
    portal_credentials_ref: null, // no real credentials in dry run
    status:       'queued',
    queued_at:    new Date().toISOString(),
    attempts:     0,
  }).select().single()

  if (error) {
    console.error('❌ Failed to queue test job:', error.message)
    process.exit(1)
  }

  console.log(`✅ Job queued: ${data.id}`)
  console.log(`   Jurisdiction: ${data.jurisdiction}`)
  console.log(`   Permit type:  ${data.permit_type}`)
  console.log(`   Address:      ${TEST_FORM.jobAddress}`)
  console.log('\n⏳ Waiting for agent to pick up...')
  console.log('   (Make sure the agent is running: node agent/submission-agent.js)\n')

  await watchJob(data.id)
}

// ─── Test 4: Real submission (use with caution) ───────────────────────────────

async function realSubmission() {
  if (!process.env.DPLANS_USERNAME || !process.env.DPLANS_PASSWORD) {
    console.error('❌ Set DPLANS_USERNAME and DPLANS_PASSWORD in .env for real submission test')
    process.exit(1)
  }

  console.log('\n⚠️  REAL SUBMISSION MODE')
  console.log('This will actually submit to the Durham Dplans portal.')
  console.log('Use a test address and be prepared to withdraw the application.\n')

  // Store credentials
  const credRes = await fetch('http://localhost:3000/api/store-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: '00000000-0000-0000-0000-000000000001',
      credentials: {
        username: process.env.DPLANS_USERNAME,
        password: process.env.DPLANS_PASSWORD,
      },
      jurisdiction: 'durham',
    }),
  })

  if (!credRes.ok) {
    console.error('❌ Could not store credentials. Is the dev server running? (npm run dev)')
    process.exit(1)
  }

  const { credentials_ref } = await credRes.json()

  const { data, error } = await supabase.from('submission_queue').insert({
    user_id:                 '00000000-0000-0000-0000-000000000001',
    user_email:              process.env.DPLANS_USERNAME,
    jurisdiction:            'durham',
    permit_type:             'building',
    form_data:               TEST_FORM,
    pdf_filename:            'test-submission.pdf',
    portal_credentials_ref:  credentials_ref,
    status:                  'queued',
    queued_at:               new Date().toISOString(),
    attempts:                0,
  }).select().single()

  if (error) {
    console.error('❌ Queue error:', error.message)
    process.exit(1)
  }

  console.log(`✅ Real submission queued: ${data.id}`)
  await watchJob(data.id)
}

// ─── Status check: list recent submissions ────────────────────────────────────

async function listRecent() {
  console.log('\n📋 Recent submissions (last 10):\n')
  const { data } = await supabase
    .from('submission_queue')
    .select('id, jurisdiction, permit_type, status, queued_at, confirmation_number, error_message, attempts')
    .order('queued_at', { ascending: false })
    .limit(10)

  if (!data?.length) {
    console.log('No submissions found.')
    return
  }

  for (const job of data) {
    const ts = new Date(job.queued_at).toLocaleString()
    console.log(`${statusEmoji(job.status)} ${job.id.slice(0, 8)} | ${job.jurisdiction}/${job.permit_type} | ${job.status.padEnd(12)} | ${ts}`)
    if (job.confirmation_number) console.log(`   ✅ Confirmation: ${job.confirmation_number}`)
    if (job.error_message)       console.log(`   ❌ Error: ${job.error_message}`)
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🤖 Parcoria Submission Agent — Test Suite')
  console.log('=' .repeat(50))

  if (WATCH_ID) {
    await watchJob(WATCH_ID)
  } else if (TEST_SELECTORS) {
    await testSelectors()
  } else if (REAL_SUBMIT) {
    await realSubmission()
  } else {
    // Default: show recent submissions + offer dry run
    await listRecent()
    console.log('\nCommands:')
    console.log('  node agent/test-agent.js                  # list recent submissions')
    console.log('  node agent/test-agent.js --selectors      # test portal page selectors')
    console.log('  node agent/test-agent.js --watch <id>     # watch a specific job live')
    console.log('  node agent/test-agent.js --dry-run        # queue a test job')
    console.log('  node agent/test-agent.js --real           # real submission (careful!)\n')

    if (args.includes('--dry-run')) await dryRun()
  }
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
