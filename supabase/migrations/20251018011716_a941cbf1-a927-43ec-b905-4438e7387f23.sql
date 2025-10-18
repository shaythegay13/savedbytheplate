-- Create rate limiting table for newsletter subscriptions
CREATE TABLE IF NOT EXISTS public.newsletter_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_rate_limits_identifier 
ON public.newsletter_rate_limits(identifier);

-- Add index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_newsletter_rate_limits_last_attempt 
ON public.newsletter_rate_limits(last_attempt_at);

-- Enable RLS
ALTER TABLE public.newsletter_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access to rate limit data
CREATE POLICY "No public access to rate limits"
ON public.newsletter_rate_limits
FOR ALL
USING (false);

-- Function to clean up old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_newsletter_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.newsletter_rate_limits
  WHERE last_attempt_at < now() - interval '24 hours';
END;
$$;