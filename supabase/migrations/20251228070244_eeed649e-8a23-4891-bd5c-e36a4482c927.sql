-- Create table to track Jane voice usage rate limits
CREATE TABLE public.jane_voice_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('ip', 'user')),
  call_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (identifier, identifier_type)
);

-- Enable RLS
ALTER TABLE public.jane_voice_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (edge functions use service role)
CREATE POLICY "Service role can manage rate limits"
ON public.jane_voice_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function to cleanup old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_jane_voice_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.jane_voice_rate_limits
  WHERE window_start < now() - interval '24 hours';
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_jane_voice_rate_limits_updated_at
BEFORE UPDATE ON public.jane_voice_rate_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();