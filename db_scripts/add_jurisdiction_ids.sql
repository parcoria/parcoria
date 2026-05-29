-- Migration: Add jurisdiction_ids column to contractor_profiles
-- Run this in your Supabase SQL editor

ALTER TABLE contractor_profiles
ADD COLUMN IF NOT EXISTS jurisdiction_ids JSONB DEFAULT '{}';

COMMENT ON COLUMN contractor_profiles.jurisdiction_ids IS
  'Jurisdiction-specific contractor portal IDs. Durham stores numeric CID (e.g. {"durham": "12345"}). Others store "registered" when the contractor has a portal account.';
