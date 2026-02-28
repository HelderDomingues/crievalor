-- Add terms acceptance fields to user profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
