-- Migration: Extend existing waitlist table with new columns
-- Your table already has: id, email, created_at, source
-- This ONLY adds missing columns — safe to run on existing data

ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS role      TEXT,       -- 'developer' | 'contractor' | 'homeowner'
  ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notes     TEXT;

-- Index for fast lookups if not already present
CREATE INDEX IF NOT EXISTS waitlist_email_idx    ON waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_created_idx  ON waitlist(created_at DESC);
