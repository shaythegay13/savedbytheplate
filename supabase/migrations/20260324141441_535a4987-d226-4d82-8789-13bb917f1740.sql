-- Fix: restrict review_helpful_votes SELECT to authenticated users viewing own votes
DROP POLICY IF EXISTS "Anyone can view helpful votes" ON public.review_helpful_votes;

CREATE POLICY "Users can view own helpful votes"
  ON public.review_helpful_votes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);