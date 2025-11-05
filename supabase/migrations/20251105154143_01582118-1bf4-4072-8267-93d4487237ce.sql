-- First, let's enhance the locations table to accommodate all CSV fields
ALTER TABLE public.locations 
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS open_hours TEXT,
  ADD COLUMN IF NOT EXISTS contact_information TEXT,
  ADD COLUMN IF NOT EXISTS local_items_selling TEXT,
  ADD COLUMN IF NOT EXISTS social_media_website1 TEXT,
  ADD COLUMN IF NOT EXISTS social_media_website2 TEXT,
  ADD COLUMN IF NOT EXISTS cross_streets TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT,
  ADD COLUMN IF NOT EXISTS borough TEXT,
  ADD COLUMN IF NOT EXISTS owner TEXT;

-- Migrate data from public_locations into locations table (if not already there)
INSERT INTO public.locations (
  name, type, description, address, latitude, longitude, 
  organization, website, tags, details, status, source, verified
)
SELECT 
  COALESCE(name, 'Unnamed Location'),
  COALESCE(type, 'garden'),
  description,
  address,
  latitude,
  longitude,
  organization,
  website,
  tags,
  details,
  COALESCE(status, 'active'),
  COALESCE(source, 'public_locations_migration'),
  COALESCE(verified, true)
FROM public.public_locations
WHERE name IS NOT NULL 
  AND latitude IS NOT NULL 
  AND longitude IS NOT NULL
  AND NOT EXISTS (
    -- Avoid duplicates by checking if similar location already exists
    SELECT 1 FROM public.locations l 
    WHERE l.name = public.public_locations.name 
      AND l.latitude = public.public_locations.latitude 
      AND l.longitude = public.public_locations.longitude
  );

-- Create an index on source to track where data came from
CREATE INDEX IF NOT EXISTS idx_locations_source ON public.locations(source);

-- Update RLS policies to allow public read access to verified active locations
DROP POLICY IF EXISTS "Public can view verified active locations" ON public.locations;

CREATE POLICY "Public can view verified active locations" ON public.locations
  FOR SELECT
  USING (verified = true AND status = 'active');