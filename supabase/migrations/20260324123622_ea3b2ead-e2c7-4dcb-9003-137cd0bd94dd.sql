-- Classroom sessions table for teachers
CREATE TABLE public.classroom_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  session_code text NOT NULL UNIQUE,
  session_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  participant_count integer NOT NULL DEFAULT 0
);

-- Classroom participants table
CREATE TABLE public.classroom_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Classroom messages (broadcast from Jane)
CREATE TABLE public.classroom_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  sender_type text NOT NULL DEFAULT 'student',
  sender_id uuid,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.classroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_messages ENABLE ROW LEVEL SECURITY;

-- Classroom sessions policies
CREATE POLICY "Teachers can create sessions" ON public.classroom_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own sessions" ON public.classroom_sessions
  FOR UPDATE TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Authenticated can view sessions" ON public.classroom_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = teacher_id OR status = 'active');

-- Classroom participants policies
CREATE POLICY "Users can join sessions" ON public.classroom_participants
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "View session participants" ON public.classroom_participants
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.classroom_sessions cs WHERE cs.id = session_id AND cs.teacher_id = auth.uid())
  );

CREATE POLICY "Users can leave sessions" ON public.classroom_participants
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Classroom messages policies
CREATE POLICY "View session messages" ON public.classroom_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.classroom_participants cp WHERE cp.session_id = classroom_messages.session_id AND cp.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.classroom_sessions cs WHERE cs.id = classroom_messages.session_id AND cs.teacher_id = auth.uid())
  );

CREATE POLICY "Send session messages" ON public.classroom_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND (
      EXISTS (SELECT 1 FROM public.classroom_participants cp WHERE cp.session_id = classroom_messages.session_id AND cp.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.classroom_sessions cs WHERE cs.id = classroom_messages.session_id AND cs.teacher_id = auth.uid())
    )
  );

-- Function to generate a short session code
CREATE OR REPLACE FUNCTION public.generate_session_code()
RETURNS text
LANGUAGE sql
AS $$
  SELECT upper(substr(md5(random()::text), 1, 6));
$$;