-- Create function to increment discussion view count
CREATE OR REPLACE FUNCTION public.increment_discussion_views(discussion_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.discussions
  SET view_count = view_count + 1
  WHERE id = discussion_id;
END;
$$;