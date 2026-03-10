
-- Migration: Add missing columns for NetCred and SIO_MAR sync
-- This file should be executed in the Supabase SQL Editor if automation fails.

-- 1. Add netcred_id to subscriptions for webhook matching
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS netcred_id text;

-- 2. Ensure sync tracking columns exist in profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS sio_mar_synced BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sio_mar_synced_at TIMESTAMPTZ;

-- 3. Update existing pending subscriptions to have a netcred_id if possible (optional)
-- This facilitates mapping of recent attempts if we have manual logs.
