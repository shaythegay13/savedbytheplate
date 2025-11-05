-- Add unique constraint for duplicate detection during CSV import
-- This allows upsert operations to work properly
CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_unique_name_coords 
ON public.locations (name, latitude, longitude);