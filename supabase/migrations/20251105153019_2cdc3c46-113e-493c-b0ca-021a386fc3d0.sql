-- Add foreign key constraints to link reviews and photos to profiles
ALTER TABLE public.location_reviews
  ADD CONSTRAINT location_reviews_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE public.location_photos
  ADD CONSTRAINT location_photos_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE public.review_helpful_votes
  ADD CONSTRAINT review_helpful_votes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;