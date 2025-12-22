-- Add trial tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS jane_trial_started_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient trial lookups
CREATE INDEX IF NOT EXISTS idx_profiles_jane_trial ON public.profiles(jane_trial_started_at) WHERE jane_trial_started_at IS NOT NULL;