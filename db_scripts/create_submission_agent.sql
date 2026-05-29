-- Migration: Submission Agent tables
-- Run in Supabase SQL Editor

-- Permit submission queue
CREATE TABLE IF NOT EXISTS submission_queue (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL,
  user_email              TEXT,
  jurisdiction            TEXT NOT NULL DEFAULT 'durham',
  permit_type             TEXT NOT NULL DEFAULT 'building',
  project_id              UUID,
  form_data               JSONB NOT NULL,
  pdf_filename            TEXT,
  portal_credentials_ref  UUID,
  additional_files        JSONB DEFAULT '[]',
  status                  TEXT NOT NULL DEFAULT 'queued',
  -- queued | processing | submitted | failed | error
  queued_at               TIMESTAMPTZ DEFAULT NOW(),
  started_at              TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  attempts                INT DEFAULT 0,
  retry_after             TIMESTAMPTZ,
  confirmation_number     TEXT,
  error_message           TEXT,
  screenshot_path         TEXT,
  last_error              TEXT
);

CREATE INDEX IF NOT EXISTS sq_status_idx     ON submission_queue(status);
CREATE INDEX IF NOT EXISTS sq_user_idx       ON submission_queue(user_id);
CREATE INDEX IF NOT EXISTS sq_queued_at_idx  ON submission_queue(queued_at DESC);

ALTER TABLE submission_queue ENABLE ROW LEVEL SECURITY;
-- Users can read their own submissions
CREATE POLICY "Users read own submissions" ON submission_queue
  FOR SELECT USING (auth.uid() = user_id);
-- Service role can do everything (for the agent)
CREATE POLICY "Service role full access" ON submission_queue
  USING (auth.role() = 'service_role');

-- Portal credentials (encrypted, short-lived)
CREATE TABLE IF NOT EXISTS portal_credentials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  jurisdiction TEXT NOT NULL,
  credentials  TEXT NOT NULL,  -- AES-256-GCM encrypted JSON
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL,
  used         BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS pc_user_idx    ON portal_credentials(user_id);
CREATE INDEX IF NOT EXISTS pc_expires_idx ON portal_credentials(expires_at);

ALTER TABLE portal_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON portal_credentials
  USING (auth.role() = 'service_role');

-- Auto-cleanup expired credentials (run as a cron job or scheduled function)
-- DELETE FROM portal_credentials WHERE expires_at < NOW() OR used = TRUE;
