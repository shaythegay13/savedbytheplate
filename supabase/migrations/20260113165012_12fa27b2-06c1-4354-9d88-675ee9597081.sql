-- Fix: Remove direct public access to locations table
-- The public_locations view already excludes sensitive fields, so we route public access through it

-- Drop the policy that exposes all columns to public users
DROP POLICY IF EXISTS "Public can view verified active locations" ON public.locations;

-- Recreate public_locations view with security_invoker to ensure proper access control
DROP VIEW IF EXISTS public.public_locations;

CREATE VIEW public.public_locations
WITH (security_invoker = off) AS
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
COMMENT ON VIEW public.public_locations IS 'Public-safe view of locations that excludes sensitive fields like phone, email, contact_information, and submitted_by. All public access should go through this view.';