-- Fix: Change public_locations view to SECURITY INVOKER
-- This ensures the view runs with the permissions of the calling user, not the view creator
DROP VIEW IF EXISTS public.public_locations;

CREATE VIEW public.public_locations 
WITH (security_invoker=true)
AS 
SELECT 
  id,
  name,
  type,
  description,
  address,
  latitude,
  longitude,
  organization,
  website,
  hours,
  tags,
  details,
  status,
  source,
  verified,
  created_at,
  updated_at
FROM public.locations
WHERE status = 'active';

-- Grants remain the same
GRANT SELECT ON public.public_locations TO anon;
GRANT SELECT ON public.public_locations TO authenticated;

COMMENT ON VIEW public.public_locations IS 'Public view of active food access locations without exposing submitter contact information (email, phone). Created with security_invoker=true to run with caller permissions.';