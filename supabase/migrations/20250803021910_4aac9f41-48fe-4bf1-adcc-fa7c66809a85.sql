-- Create locations table for food access map data
CREATE TABLE public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('garden', 'market', 'farm', 'urbanfarm', 'business', 'fridge', 'foodbank')),
  description TEXT,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  organization TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  hours JSONB,
  tags TEXT[],
  details TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  source TEXT DEFAULT 'user_submitted',
  verified BOOLEAN DEFAULT false,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_locations_type ON public.locations(type);
CREATE INDEX idx_locations_status ON public.locations(status);
CREATE INDEX idx_locations_coordinates ON public.locations(latitude, longitude);
CREATE INDEX idx_locations_organization ON public.locations(organization);

-- Create spatial index for location queries (if PostGIS is available)
-- CREATE INDEX idx_locations_geom ON public.locations USING GIST(ST_Point(longitude, latitude));

-- RLS Policies

-- Allow everyone to read active locations
CREATE POLICY "Public can view active locations" 
ON public.locations 
FOR SELECT 
USING (status = 'active');

-- Allow authenticated users to submit new locations (pending approval)
CREATE POLICY "Authenticated users can submit locations" 
ON public.locations 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND submitted_by = auth.uid() 
  AND status = 'pending'
);

-- Allow users to update their own submitted locations
CREATE POLICY "Users can update own submissions" 
ON public.locations 
FOR UPDATE 
USING (auth.uid() = submitted_by)
WITH CHECK (auth.uid() = submitted_by);

-- Allow users to view their own submissions (including pending ones)
CREATE POLICY "Users can view own submissions" 
ON public.locations 
FOR SELECT 
USING (auth.uid() = submitted_by);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data from the existing CSV sources
INSERT INTO public.locations (
  name, type, description, address, latitude, longitude, 
  organization, website, status, source, verified
) VALUES 
  (
    'Bushwick City Farm', 
    'urbanfarm', 
    'Urban farm in Bushwick, Brooklyn', 
    'Bushwick, Brooklyn, NY', 
    40.6951, 
    -73.9186, 
    'Community', 
    '', 
    'active', 
    'curated', 
    true
  ),
  (
    'Astoria Food Pantry', 
    'foodbank', 
    'Food pantry serving the Astoria community', 
    'Astoria, Queens, NY', 
    40.7614, 
    -73.9212, 
    'Community Service', 
    '', 
    'active', 
    'curated', 
    true
  ),
  (
    'Astoria Food Pantry Community Fridge', 
    'fridge', 
    'Community fridge outside Astoria Food Pantry', 
    'Astoria, Queens, NY', 
    40.7614, 
    -73.9212, 
    'Community', 
    '', 
    'active', 
    'curated', 
    true
  ),
  (
    'Uptown Good Food Farmers Market', 
    'market', 
    'Seasonal farmers market, Saturdays June 14 - November 22', 
    'Uptown, Manhattan, NY', 
    40.8176, 
    -73.9442, 
    'Local Market', 
    '', 
    'active', 
    'curated', 
    true
  );

-- Create a function to search locations by proximity
CREATE OR REPLACE FUNCTION public.find_nearby_locations(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_km DECIMAL DEFAULT 5.0,
  location_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  description TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  organization TEXT,
  website TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.name,
    l.type,
    l.description,
    l.address,
    l.latitude,
    l.longitude,
    l.organization,
    l.website,
    ROUND(
      (6371 * acos(
        cos(radians(search_lat)) * 
        cos(radians(l.latitude)) * 
        cos(radians(l.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * 
        sin(radians(l.latitude))
      ))::numeric, 2
    ) AS distance_km
  FROM public.locations l
  WHERE 
    l.status = 'active'
    AND (location_type IS NULL OR l.type = location_type)
    AND (
      6371 * acos(
        cos(radians(search_lat)) * 
        cos(radians(l.latitude)) * 
        cos(radians(l.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * 
        sin(radians(l.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;