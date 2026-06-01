-- Parcoria Lifecycle Tracker — Phase 1 Migration
-- Run in Supabase SQL Editor in order
-- Safe to re-run — all statements use IF NOT EXISTS / IF NOT EXISTS guards

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 1: permit_events
-- One row per permit type per project. Core lifecycle tracker.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS permit_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- What permit this is
  permit_type     TEXT NOT NULL,
  -- 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'zoning'
  -- 'lien_agent' | 'co' | 'survey' | 'grading' | 'fire' | 'custom'

  permit_name     TEXT NOT NULL,   -- human label e.g. "Residential building permit"
  jurisdiction    TEXT NOT NULL,
  portal          TEXT,            -- 'dplans' | 'ldo' | 'raleigh_portal' | 'opengov'
  sequence_order  INT DEFAULT 99,  -- display order within project

  -- Lifecycle stage — user updates this manually (one tap)
  stage           TEXT NOT NULL DEFAULT 'not_started',
  -- not_started → applied → in_review → approved → issued
  -- → inspections → on_hold | rejected | complete

  -- Key dates
  applied_date    DATE,
  approved_date   DATE,
  issued_date     DATE,
  expiry_date     DATE,     -- permit expires if no inspections within ~6 months
  co_date         DATE,     -- certificate of occupancy / compliance

  -- Permit number once issued
  permit_number   TEXT,

  -- Timeline accuracy (feeds flywheel — Phase 4)
  est_days        INT,      -- Parcoria's estimate
  actual_days     INT,      -- computed: approved_date - applied_date

  -- Fee tracking
  est_fee         NUMERIC(10,2),
  actual_fee      NUMERIC(10,2),

  -- Outcome tracking
  rejection_reason     TEXT,
  rejection_category   TEXT,
  -- 'missing_documents' | 'incomplete_form' | 'zoning_issue' | 'fee_unpaid' | 'other'

  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS permit_events_project_id_idx ON permit_events(project_id);
CREATE INDEX IF NOT EXISTS permit_events_user_id_idx    ON permit_events(user_id);
CREATE INDEX IF NOT EXISTS permit_events_stage_idx      ON permit_events(stage);

ALTER TABLE permit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own permit events"
  ON permit_events FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 2: inspection_log
-- One row per inspection step per project. Seeded from jurisdiction data.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inspection_log (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permit_event_id         UUID REFERENCES permit_events(id) ON DELETE SET NULL,

  sequence_order          INT NOT NULL,   -- must pass in order
  inspection_type         TEXT NOT NULL,
  -- 'footing' | 'foundation' | 'framing' | 'rough_electrical' | 'rough_plumbing'
  -- 'rough_hvac' | 'rough_in' | 'insulation' | 'fire_separation'
  -- 'final_building' | 'final_electrical' | 'final_plumbing' | 'final_mechanical'
  -- 'co_walkthrough' | 'custom'

  label                   TEXT NOT NULL,  -- "Framing — before closing walls"
  jurisdiction            TEXT NOT NULL,
  scheduling_url          TEXT,           -- direct link to schedule
  scheduling_phone        TEXT,

  status                  TEXT DEFAULT 'pending',
  -- pending | scheduled | passed | failed | re_inspection_required | waived | skipped

  scheduled_date          DATE,
  completed_date          DATE,
  result_notes            TEXT,
  re_inspection_required  BOOLEAN DEFAULT FALSE,

  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inspection_log_project_id_idx ON inspection_log(project_id);
CREATE INDEX IF NOT EXISTS inspection_log_status_idx     ON inspection_log(status);

ALTER TABLE inspection_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inspection log"
  ON inspection_log FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 3: project_deadlines
-- Auto-generated + user-defined deadlines. Powers the alert engine.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_deadlines (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permit_event_id     UUID REFERENCES permit_events(id) ON DELETE SET NULL,

  deadline_type       TEXT NOT NULL,
  -- 'permit_application' | 'permit_expiry' | 'inspection_due'
  -- 'document_expiry' | 'co_target' | 'follow_up' | 'custom'

  label               TEXT NOT NULL,
  due_date            DATE NOT NULL,
  alert_days_before   INT DEFAULT 7,

  status              TEXT DEFAULT 'pending',
  -- pending | snoozed | complete | overdue

  completed_at        TIMESTAMPTZ,
  snoozed_until       DATE,
  auto_generated      BOOLEAN DEFAULT TRUE,
  source              TEXT,   -- 'permit_issue_date' | 'project_start' | 'manual'
  notes               TEXT,

  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_deadlines_project_id_idx ON project_deadlines(project_id);
CREATE INDEX IF NOT EXISTS project_deadlines_due_date_idx   ON project_deadlines(due_date);
CREATE INDEX IF NOT EXISTS project_deadlines_status_idx     ON project_deadlines(status);

ALTER TABLE project_deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own deadlines"
  ON project_deadlines FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 4: document_expiry
-- Contractor licenses, insurance, bonds, lien agents — all tracked here.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS document_expiry (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id          UUID REFERENCES projects(id) ON DELETE SET NULL,
  -- null = applies to user/contractor globally, not a specific project

  document_type       TEXT NOT NULL,
  -- 'nc_license' | 'general_liability' | 'workers_comp'
  -- 'lien_agent' | 'permit' | 'bond' | 'custom'

  label               TEXT NOT NULL,       -- "NC General Contractor License"
  document_number     TEXT,                -- license #, policy #
  expiry_date         DATE NOT NULL,
  alert_days_before   INT DEFAULT 30,

  status              TEXT DEFAULT 'active',
  -- active | expiring_soon | expired | renewed

  renewed_date        DATE,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_expiry_user_id_idx     ON document_expiry(user_id);
CREATE INDEX IF NOT EXISTS document_expiry_expiry_date_idx ON document_expiry(expiry_date);
CREATE INDEX IF NOT EXISTS document_expiry_status_idx      ON document_expiry(status);

ALTER TABLE document_expiry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own documents"
  ON document_expiry FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 5: project_outcomes
-- Written when permit_events reaches 'complete'. Feeds the flywheel.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_outcomes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  permit_event_id     UUID REFERENCES permit_events(id) ON DELETE SET NULL,

  jurisdiction        TEXT NOT NULL,
  project_type        TEXT NOT NULL,
  permit_type         TEXT NOT NULL,

  applied_date        DATE,
  approved_date       DATE,
  actual_review_days  INT,
  est_review_days     INT,
  accuracy_delta      INT,    -- actual - estimated

  actual_fee          NUMERIC(10,2),
  est_fee             NUMERIC(10,2),
  fee_delta           NUMERIC(10,2),

  outcome             TEXT NOT NULL,
  -- 'approved' | 'rejected' | 'withdrawn' | 'expired'

  rejection_reason    TEXT,
  rejection_category  TEXT,
  year_quarter        TEXT,   -- '2025-Q4'

  submitted_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Public read for aggregate stats (no PII exposed)
ALTER TABLE project_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own outcomes"
  ON project_outcomes FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Service role full access outcomes"
  ON project_outcomes FOR ALL
  USING (auth.role() = 'service_role');


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 6: digest_preferences
-- Weekly email digest settings per user.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS digest_preferences (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  digest_enabled              BOOLEAN DEFAULT TRUE,
  digest_day                  TEXT DEFAULT 'monday',
  digest_email                TEXT,

  alert_permit_expiry         BOOLEAN DEFAULT TRUE,
  alert_inspection_due        BOOLEAN DEFAULT TRUE,
  alert_document_expiry       BOOLEAN DEFAULT TRUE,
  alert_follow_up             BOOLEAN DEFAULT TRUE,
  alert_jurisdiction_changes  BOOLEAN DEFAULT TRUE,

  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE digest_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own digest prefs"
  ON digest_preferences FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- Confirm
-- ─────────────────────────────────────────────────────────────────────────────

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c
   WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'permit_events', 'inspection_log', 'project_deadlines',
    'document_expiry', 'project_outcomes', 'digest_preferences'
  )
ORDER BY table_name;
