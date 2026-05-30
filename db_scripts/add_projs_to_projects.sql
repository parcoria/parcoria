-- Migration: Add projs (multi-project types) array to projects table
-- Run in Supabase SQL Editor

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS projs JSONB DEFAULT '[]';

COMMENT ON COLUMN projects.projs IS
  'Array of project type IDs for this job site, e.g. ["deck","shed"]. project_type holds the primary type for backward compatibility.';

-- Backfill existing rows: if projs is empty but project_type exists, populate projs
UPDATE projects
SET projs = jsonb_build_array(project_type)
WHERE (projs IS NULL OR projs = '[]'::jsonb)
  AND project_type IS NOT NULL;
