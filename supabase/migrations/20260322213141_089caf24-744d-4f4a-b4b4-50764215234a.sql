-- Table to store conversation turns for Jane voice sessions (auto-expires after 48h)
CREATE TABLE public.jane_conversation_turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'tool_result')),
  content text NOT NULL,
  tool_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours')
);

-- Index for fast session lookups and cleanup
CREATE INDEX idx_jane_turns_session ON public.jane_conversation_turns (session_id, created_at);
CREATE INDEX idx_jane_turns_expires ON public.jane_conversation_turns (expires_at);

-- RLS: no public access (service role only)
ALTER TABLE public.jane_conversation_turns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to conversation turns"
  ON public.jane_conversation_turns
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- Cleanup function for expired turns
CREATE OR REPLACE FUNCTION public.cleanup_jane_conversation_turns()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.jane_conversation_turns
  WHERE expires_at < now();
END;
$$;