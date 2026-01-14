-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.jane_voice_rate_limits;

-- Create a restrictive policy that denies all access to regular users
-- The service role bypasses RLS entirely, so it will still be able to manage the table
CREATE POLICY "No public access to rate limits"
ON public.jane_voice_rate_limits
FOR ALL
USING (false)
WITH CHECK (false);