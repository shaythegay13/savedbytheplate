-- Fix: Protect community volunteer contact information (email, phone) from public access
-- Remove the policy that exposes all columns to unauthenticated users
DROP POLICY IF EXISTS "Public can view active locations (limited fields)" ON public.locations;

-- Create a public view that excludes sensitive contact information
CREATE OR REPLACE VIEW public.public_locations AS 
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

-- Grant SELECT access on the view to both anonymous and authenticated users
GRANT SELECT ON public.public_locations TO anon;
GRANT SELECT ON public.public_locations TO authenticated;

-- Add documentation
COMMENT ON VIEW public.public_locations IS 'Public view of active food access locations without exposing submitter contact information (email, phone). Use this view for public map display.';

-- Note: The following existing policies remain intact and protect sensitive data:
-- - "Admins can view all locations" - admins can see everything including contact info
-- - "Submitters can view their own locations with contact info" - submitters see their own contact info
-- - "Users can view own submissions" - authenticated users see their own submissions