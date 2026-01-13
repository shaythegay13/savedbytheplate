-- Fix: Recreate view with security_invoker=on and add an RLS policy to allow the view to read from locations

-- Drop the current view
DROP VIEW IF EXISTS public.public_locations;

-- Add a new RLS policy that allows SELECT on verified active locations for the view context
-- This policy will allow the security invoker view to work properly
CREATE POLICY "Allow select for verified active locations via view" 
ON public.locations 
FOR SELECT 
USING (verified = true AND status = 'active');

-- Recreate the view with security_invoker=on (security best practice)
CREATE VIEW public.public_locations
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  type,
  description,
  address,
  latitude,
  longitude,
  hours,
  website,
  organization,
  source,
  status,
  verified,
  tags,
  details,
  created_at,
  updated_at
FROM public.locations
WHERE verified = true AND status = 'active';

-- Grant SELECT access on the view to anonymous and authenticated users
GRANT SELECT ON public.public_locations TO anon;
GRANT SELECT ON public.public_locations TO authenticated;

-- Add comment explaining the security purpose
COMMENT ON VIEW public.public_locations IS 'Public-safe view of locations that excludes sensitive fields like phone, email, contact_information, and submitted_by. Uses security_invoker=on for proper RLS enforcement.';