-- Drop and recreate the public_locations view to exclude submitted_by field
DROP VIEW IF EXISTS public.public_locations;

CREATE VIEW public.public_locations
WITH (security_invoker = on)
AS SELECT 
  id,
  name,
  type,
  description,
  address,
  latitude,
  longitude,
  tags,
  details,
  organization,
  source,
  status,
  website,
  borough,
  neighborhood,
  cross_streets,
  zip_code,
  open_hours,
  hours,
  social_media_website1,
  social_media_website2,
  local_items_selling,
  owner,
  verified,
  created_at,
  updated_at
  -- Excluded: email, phone, contact_information (contact data protection)
  -- Excluded: submitted_by (user privacy protection)
FROM public.locations
WHERE verified = true AND status = 'active';