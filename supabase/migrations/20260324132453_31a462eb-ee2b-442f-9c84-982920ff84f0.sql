-- Fix search_path on generate_session_code
CREATE OR REPLACE FUNCTION public.generate_session_code()
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT upper(substr(md5(random()::text), 1, 6));
$$;