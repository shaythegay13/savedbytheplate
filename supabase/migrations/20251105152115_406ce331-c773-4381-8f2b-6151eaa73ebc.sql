-- Create storage bucket for location photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'location-photos',
  'location-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Create location_reviews table
CREATE TABLE IF NOT EXISTS public.location_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_verified_visit BOOLEAN DEFAULT false
);

-- Create location_photos table
CREATE TABLE IF NOT EXISTS public.location_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL,
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_approved BOOLEAN DEFAULT true
);

-- Create review_helpful_votes table (track who found reviews helpful)
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.location_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_location_reviews_location_id ON public.location_reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_location_reviews_user_id ON public.location_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_location_photos_location_id ON public.location_photos(location_id);
CREATE INDEX IF NOT EXISTS idx_location_photos_user_id ON public.location_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON public.review_helpful_votes(review_id);

-- Enable RLS
ALTER TABLE public.location_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for location_reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.location_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.location_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.location_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.location_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for location_photos
CREATE POLICY "Anyone can view approved photos"
  ON public.location_photos
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated users can upload photos"
  ON public.location_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON public.location_photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for review_helpful_votes
CREATE POLICY "Anyone can view helpful votes"
  ON public.review_helpful_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote helpful"
  ON public.review_helpful_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their helpful votes"
  ON public.review_helpful_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Storage policies for location-photos bucket
CREATE POLICY "Anyone can view location photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'location-photos');

CREATE POLICY "Authenticated users can upload location photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'location-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own location photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'location-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger to update updated_at on reviews
CREATE TRIGGER update_location_reviews_updated_at
  BEFORE UPDATE ON public.location_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update helpful count when votes change
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.location_reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.location_reviews
    SET helpful_count = GREATEST(helpful_count - 1, 0)
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update helpful count
CREATE TRIGGER update_helpful_count_on_vote
  AFTER INSERT OR DELETE ON public.review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_helpful_count();