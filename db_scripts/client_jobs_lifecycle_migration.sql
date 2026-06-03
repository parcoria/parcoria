-- Add project_id to client_jobs so contractor jobs can link to the lifecycle tracker
-- Run in Supabase SQL Editor

ALTER TABLE client_jobs
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS projs TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS client_jobs_project_id_idx ON client_jobs(project_id);

SELECT 'client_jobs updated' AS status;
