-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create discussion_categories table
CREATE TABLE public.discussion_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.discussion_categories ENABLE ROW LEVEL SECURITY;

-- Create discussions table
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.discussion_categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Create discussion_replies table
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- Create user_badges table for gamification
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create moderation_logs table
CREATE TABLE public.moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Create banned_users table
CREATE TABLE public.banned_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  banned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT,
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ban_expires_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create security definer function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.banned_users
    WHERE user_id = _user_id
    AND (ban_expires_at IS NULL OR ban_expires_at > now())
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
ON public.user_roles FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for discussion_categories
CREATE POLICY "Categories are viewable by everyone"
ON public.discussion_categories FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage categories"
ON public.discussion_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for discussions
CREATE POLICY "Discussions are viewable by everyone"
ON public.discussions FOR SELECT
USING (true);

CREATE POLICY "Authenticated non-banned users can create discussions"
ON public.discussions FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND NOT public.is_user_banned(auth.uid())
);

CREATE POLICY "Users can update their own discussions"
ON public.discussions FOR UPDATE
USING (auth.uid() = user_id AND NOT is_locked);

CREATE POLICY "Moderators and admins can update any discussion"
ON public.discussions FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);

CREATE POLICY "Users can delete their own discussions"
ON public.discussions FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators and admins can delete any discussion"
ON public.discussions FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);

-- RLS Policies for discussion_replies
CREATE POLICY "Replies are viewable by everyone"
ON public.discussion_replies FOR SELECT
USING (true);

CREATE POLICY "Authenticated non-banned users can create replies"
ON public.discussion_replies FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND NOT public.is_user_banned(auth.uid())
);

CREATE POLICY "Users can update their own replies"
ON public.discussion_replies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies"
ON public.discussion_replies FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators and admins can delete any reply"
ON public.discussion_replies FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);

-- RLS Policies for user_badges
CREATE POLICY "Badges are viewable by everyone"
ON public.user_badges FOR SELECT
USING (true);

-- RLS Policies for moderation_logs
CREATE POLICY "Moderators and admins can view moderation logs"
ON public.moderation_logs FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);

CREATE POLICY "Moderators and admins can create moderation logs"
ON public.moderation_logs FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);

-- RLS Policies for banned_users
CREATE POLICY "Admins and moderators can view banned users"
ON public.banned_users FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'moderator')
);

CREATE POLICY "Only admins can manage bans"
ON public.banned_users FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on discussions
CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on discussion_replies
CREATE TRIGGER update_replies_updated_at
BEFORE UPDATE ON public.discussion_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update reply_count on discussions
CREATE OR REPLACE FUNCTION public.update_discussion_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions
    SET reply_count = reply_count + 1,
        updated_at = now()
    WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_discussion_reply_count_trigger
AFTER INSERT OR DELETE ON public.discussion_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_discussion_reply_count();

-- Function to award points for user engagement
CREATE OR REPLACE FUNCTION public.award_engagement_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Award 10 points for creating a discussion
  IF TG_TABLE_NAME = 'discussions' AND TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET points = points + 10
    WHERE id = NEW.user_id;
  -- Award 5 points for creating a reply
  ELSIF TG_TABLE_NAME = 'discussion_replies' AND TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET points = points + 5
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER award_discussion_points
AFTER INSERT ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.award_engagement_points();

CREATE TRIGGER award_reply_points
AFTER INSERT ON public.discussion_replies
FOR EACH ROW
EXECUTE FUNCTION public.award_engagement_points();

-- Insert default categories
INSERT INTO public.discussion_categories (name, description, slug, icon, sort_order)
VALUES
  ('General', 'General discussions about urban gardening and food access', 'general', 'MessageCircle', 0),
  ('Growing Tips', 'Share and learn gardening techniques and best practices', 'growing-tips', 'Sprout', 1),
  ('Community Events', 'Discuss upcoming events, workshops, and meetups', 'events', 'Calendar', 2),
  ('Food Access', 'Discussions about food banks, community fridges, and local food resources', 'food-access', 'MapPin', 3),
  ('Questions & Answers', 'Ask questions and get help from the community', 'qa', 'MessageCircle', 4);