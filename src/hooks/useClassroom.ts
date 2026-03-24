import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface ClassroomSession {
  id: string;
  teacher_id: string;
  session_code: string;
  session_name: string;
  status: string;
  created_at: string;
  ended_at: string | null;
  participant_count: number;
}

export interface ClassroomParticipant {
  id: string;
  session_id: string;
  user_id: string;
  display_name: string;
  joined_at: string;
}

export interface ClassroomMessage {
  id: string;
  session_id: string;
  sender_type: string;
  sender_id: string | null;
  content: string;
  created_at: string;
}

interface UseClassroomOptions {
  user: User | null;
}

export function useClassroom({ user }: UseClassroomOptions) {
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [participants, setParticipants] = useState<ClassroomParticipant[]>([]);
  const [messages, setMessages] = useState<ClassroomMessage[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a random 6-char code
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Create a new classroom session (teacher)
  const createSession = useCallback(async (sessionName: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const code = generateCode();
      const { data, error: insertError } = await supabase
        .from('classroom_sessions')
        .insert({
          teacher_id: user.id,
          session_code: code,
          session_name: sessionName,
          status: 'active',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setSession(data as ClassroomSession);
      setIsTeacher(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create session';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Join an existing session (student)
  const joinSession = useCallback(async (code: string, displayName: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // Find session by code
      const { data: sessionData, error: findError } = await supabase
        .from('classroom_sessions')
        .select('*')
        .eq('session_code', code.toUpperCase())
        .eq('status', 'active')
        .single();

      if (findError || !sessionData) {
        setError('Session not found or has ended.');
        setLoading(false);
        return;
      }

      // Join as participant
      const { error: joinError } = await supabase
        .from('classroom_participants')
        .insert({
          session_id: sessionData.id,
          user_id: user.id,
          display_name: displayName,
        });

      if (joinError) {
        if (joinError.code === '23505') {
          // Already joined - just load the session
        } else {
          throw joinError;
        }
      }

      // Update participant count
      await supabase
        .from('classroom_sessions')
        .update({ participant_count: (sessionData.participant_count || 0) + 1 })
        .eq('id', sessionData.id);

      setSession(sessionData as ClassroomSession);
      setIsTeacher(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join session';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // End session (teacher only)
  const endSession = useCallback(async () => {
    if (!session || !isTeacher) return;

    await supabase
      .from('classroom_sessions')
      .update({ status: 'ended', ended_at: new Date().toISOString() })
      .eq('id', session.id);

    setSession(null);
    setParticipants([]);
    setMessages([]);
    setIsTeacher(false);
  }, [session, isTeacher]);

  // Leave session (student)
  const leaveSession = useCallback(async () => {
    if (!session || !user) return;

    await supabase
      .from('classroom_participants')
      .delete()
      .eq('session_id', session.id)
      .eq('user_id', user.id);

    setSession(null);
    setParticipants([]);
    setMessages([]);
  }, [session, user]);

  // Broadcast a message (Jane's response)
  const broadcastMessage = useCallback(async (content: string, senderType: string = 'jane') => {
    if (!session || !user) return;

    await supabase
      .from('classroom_messages')
      .insert({
        session_id: session.id,
        sender_type: senderType,
        sender_id: user.id,
        content,
      });
  }, [session, user]);

  // Award a badge to a student
  const awardBadge = useCallback(async (studentId: string, badgeName: string, badgeType: string, description: string) => {
    if (!isTeacher) return;
    
    // Badges are inserted via service role in edge function
    // For now, broadcast a message about the badge
    await broadcastMessage(`🏅 Badge awarded: "${badgeName}" — ${description}`, 'teacher');
  }, [isTeacher, broadcastMessage]);

  // Load participants and messages when session is active
  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      const [{ data: parts }, { data: msgs }] = await Promise.all([
        supabase
          .from('classroom_participants')
          .select('*')
          .eq('session_id', session.id)
          .order('joined_at', { ascending: true }),
        supabase
          .from('classroom_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true }),
      ]);

      if (parts) setParticipants(parts as ClassroomParticipant[]);
      if (msgs) setMessages(msgs as ClassroomMessage[]);
    };

    loadData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`classroom-${session.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'classroom_messages', filter: `session_id=eq.${session.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ClassroomMessage]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'classroom_participants', filter: `session_id=eq.${session.id}` },
        (payload) => {
          setParticipants(prev => [...prev, payload.new as ClassroomParticipant]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'classroom_participants', filter: `session_id=eq.${session.id}` },
        (payload) => {
          setParticipants(prev => prev.filter(p => p.id !== (payload.old as any).id));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'classroom_sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          const updated = payload.new as ClassroomSession;
          if (updated.status === 'ended') {
            setSession(null);
            setParticipants([]);
            setMessages([]);
          } else {
            setSession(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  return {
    session,
    participants,
    messages,
    isTeacher,
    loading,
    error,
    createSession,
    joinSession,
    endSession,
    leaveSession,
    broadcastMessage,
    awardBadge,
    setError,
  };
}
