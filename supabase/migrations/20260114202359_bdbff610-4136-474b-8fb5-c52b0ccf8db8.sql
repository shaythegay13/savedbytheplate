-- Drop the existing public_locations view
DROP VIEW IF EXISTS public.public_locations;

-- Recreate the public_locations view WITHOUT email, phone, and contact_information fields
-- This view is for unauthenticated/non-subscribed users to access location data
-- Sensitive contact info (email, phone, contact_information) is excluded
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
  tags,
  details,
  organization,
  source,
  status,
  verified,
  website,
  created_at,
  updated_at,
  borough,
  neighborhood,
  cross_streets,
  zip_code,
  open_hours,
  social_media_website1,
  social_media_website2,
  local_items_selling,
  owner
FROM public.locations
WHERE verified = true AND status = 'active';

-- Add a comment to explain the view's purpose
COMMENT ON VIEW public.public_locations IS 'Public view of locations that excludes sensitive contact information (email, phone, contact_information). Use this view for unauthenticated or non-subscribed users.';

-- Grant SELECT access to authenticated users on this view
GRANT SELECT ON public.public_locations TO authenticated;

-- Also grant to anon for unauthenticated access
GRANT SELECT ON public.public_locations TO anon;