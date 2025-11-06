-- Update locations.type check constraint to include 'csa'
ALTER TABLE public.locations DROP CONSTRAINT IF EXISTS locations_type_check;
ALTER TABLE public.locations ADD CONSTRAINT locations_type_check 
  CHECK (type IN ('garden', 'market', 'farm', 'urbanfarm', 'business', 'fridge', 'foodbank', 'csa'));
