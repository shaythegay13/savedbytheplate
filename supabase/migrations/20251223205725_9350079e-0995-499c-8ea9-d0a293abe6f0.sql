-- Add soft-delete column to location_reviews
ALTER TABLE public.location_reviews 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update the SELECT policy to exclude soft-deleted reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.location_reviews;
CREATE POLICY "Anyone can view non-deleted reviews" 
ON public.location_reviews 
FOR SELECT 
USING (deleted_at IS NULL);

-- Drop the hard delete policy - we'll use soft deletes instead
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.location_reviews;

-- Create a soft-delete policy that allows users to mark their own reviews as deleted
DROP POLICY IF EXISTS "Users can soft-delete their own reviews" ON public.location_reviews;
CREATE POLICY "Users can soft-delete their own reviews" 
ON public.location_reviews 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND deleted_at IS NULL
)
WITH CHECK (
  auth.uid() = user_id
);

-- Update the existing update policy to prevent modifying deleted reviews
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.location_reviews;
CREATE POLICY "Users can update their own reviews" 
ON public.location_reviews 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND deleted_at IS NULL
)
WITH CHECK (
  auth.uid() = user_id
);

-- Add index for efficient filtering of non-deleted reviews
CREATE INDEX IF NOT EXISTS idx_location_reviews_deleted_at ON public.location_reviews(deleted_at) WHERE deleted_at IS NULL;