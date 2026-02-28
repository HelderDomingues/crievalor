-- Migration: Add sync tracking columns to profiles
-- This allows crievalor to know which users have been successfully mirrored to SIO_MAR

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sio_mar_synced BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sio_mar_synced_at TIMESTAMPTZ;

-- Note: We do not retroactively sync old users in this migration.
-- We only add the tracking capability for new signups.
