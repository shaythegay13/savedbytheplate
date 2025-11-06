-- Clean the locations table to prepare for fresh import
-- This removes all existing data so we can reimport with correct column mappings

-- First, delete dependent records in other tables
DELETE FROM location_photos;
DELETE FROM location_reviews;
DELETE FROM events WHERE location_id IS NOT NULL;

-- Now truncate the locations table
TRUNCATE TABLE locations CASCADE;

-- Add a comment to track this cleanup
COMMENT ON TABLE locations IS 'Cleaned on 2025-11-06 to reimport with corrected CSV column mappings';
