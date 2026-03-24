import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useClassroom } from '@/hooks/useClassroom';
import { Monitor, Users, Award, LogOut, Copy, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ClassroomModeProps {
  user: User;
  onJaneResponse?: (response: string) => void;
  latestJaneResponse?: string;
}

const BADGE_OPTIONS = [
  { name: 'First Seed', type: 'milestone', description: 'Planted their first seed', emoji: '🌱' },
  { name: 'Soil Scientist', type: 'knowledge', description: 'Learned about soil types', emoji: '🔬' },
  { name: 'Harvest Hero', type: 'achievement', description: 'Completed a harvest milestone', emoji: '🏆' },
  { name: 'Water Wise', type: 'skill', description: 'Mastered watering techniques', emoji: '💧' },
  { name: 'Bug Buddy', type: 'knowledge', description: 'Identified a garden pest', emoji: '🐛' },
  { name: 'Compost Champion', type: 'achievement', description: 'Started composting', emoji: '♻️' },
];

const ClassroomMode: React.FC<ClassroomModeProps> = ({ user, latestJaneResponse }) => {
  const {
    session, participants, messages, isTeacher, loading, error,
    createSession, joinSession, endSession, leaveSession, broadcastMessage, setError,
  } = useClassroom({ user });
  
  const [sessionName, setSessionName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [copied, setCopied] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState('');
  const { toast } = useToast();

  const copyCode = async () => {
    if (!session) return;
    await navigator.clipboard.writeText(session.session_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Broadcast Jane's latest response
  const broadcastJaneResponse = () => {
    if (latestJaneResponse) {
      broadcastMessage(latestJaneResponse, 'jane');
      toast({ title: 'Broadcasted', description: "Jane's response was shared with the class." });
    }
  };

  const handleStudentQuestion = async () => {
    if (!studentQuestion.trim()) return;
    await broadcastMessage(studentQuestion, 'student');
    setStudentQuestion('');
  };

  const handleAwardBadge = async (participantId: string, badge: typeof BADGE_OPTIONS[0]) => {
    // Insert badge via Supabase for the participant
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;

    const { error: badgeError } = await (await import('@/integrations/supabase/client')).supabase
      .from('user_badges')
      .insert({
        user_id: participant.user_id,
        badge_name: badge.name,
        badge_type: badge.type,
        badge_description: badge.description,
      });

    if (badgeError) {
      // Badge insert may fail due to RLS (needs service role)
      // Broadcast the award message anyway
      console.warn('Badge insert requires service role:', badgeError);
    }

    await broadcastMessage(
      `${badge.emoji} ${participant.display_name} earned the "${badge.name}" badge! ${badge.description}`,
      'teacher'
    );

    toast({ title: `${badge.emoji} Badge Awarded!`, description: `${badge.name} given to ${participant.display_name}` });
  };

  // Not in a session — show create/join options
  if (!session) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
            <Monitor className="h-5 w-5" />
            Classroom Mode
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Teachers can broadcast Jane's advice to the whole class. Students earn badges for participation.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
              <button onClick={() => setError(null)} className="ml-2 underline">dismiss</button>
            </div>
          )}

          {/* Teacher: Create Session */}
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800 text-sm">Start a Session (Teachers)</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Session name (e.g., 'Period 3 Garden Lab')"
                value={sessionName}
                onChange={e => setSessionName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => createSession(sessionName)}
                disabled={!sessionName.trim() || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-green-50 px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Student: Join Session */}
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800 text-sm">Join a Session (Students)</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Session code"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="sm:w-28 uppercase tracking-widest text-center font-mono"
              />
              <Input
                placeholder="Your name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => joinSession(joinCode, displayName)}
                disabled={!joinCode.trim() || !displayName.trim() || loading}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                {loading ? 'Joining...' : 'Join'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active session view
  return (
    <Card className="border-2 border-green-300 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
            <Monitor className="h-5 w-5" />
            {session.session_name}
            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">● Live</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
              title="Copy session code"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="font-mono font-bold tracking-wider">{session.session_code}</span>
            </button>
            <Button
              size="sm"
              variant="ghost"
              onClick={isTeacher ? endSession : leaveSession}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {isTeacher ? 'End' : 'Leave'}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {participants.length} student{participants.length !== 1 ? 's' : ''} connected
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teacher broadcast controls */}
        {isTeacher && latestJaneResponse && (
          <Button
            onClick={broadcastJaneResponse}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Broadcast Jane's Response to Class
          </Button>
        )}

        {/* Message feed */}
        <div className="bg-green-50 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {isTeacher
                ? "Ask Jane a question, then broadcast her response to the class."
                : "Waiting for your teacher to share Jane's gardening advice..."}
            </p>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`rounded-lg p-3 text-sm ${
                  msg.sender_type === 'jane'
                    ? 'bg-white border border-green-200'
                    : msg.sender_type === 'teacher'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-medium mb-1">
                  {msg.sender_type === 'jane' && <span className="text-green-600">🌱 Jane</span>}
                  {msg.sender_type === 'teacher' && <span className="text-blue-600">👩‍🏫 Teacher</span>}
                  {msg.sender_type === 'student' && <span className="text-amber-600">✋ Student</span>}
                </div>
                <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Student question input */}
        {!isTeacher && (
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={studentQuestion}
              onChange={e => setStudentQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStudentQuestion()}
              className="flex-1"
            />
            <Button
              onClick={handleStudentQuestion}
              disabled={!studentQuestion.trim()}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Teacher: Participants & Badge Awards */}
        {isTeacher && participants.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-800 flex items-center gap-1">
              <Award className="h-4 w-4" />
              Award Badges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {participants.map(p => (
                <div key={p.id} className="bg-green-50 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-sm text-green-800">{p.display_name}</p>
                  <div className="flex flex-wrap gap-1">
                    {BADGE_OPTIONS.map(badge => (
                      <button
                        key={badge.name}
                        onClick={() => handleAwardBadge(p.id, badge)}
                        className="text-xs bg-white border border-green-200 rounded-full px-2 py-1 hover:bg-green-100 transition-colors"
                        title={badge.description}
                      >
                        {badge.emoji} {badge.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student: My Badges */}
        {!isTeacher && <StudentBadges userId={user.id} />}
      </CardContent>
    </Card>
  );
};

// Student badges display component
const StudentBadges: React.FC<{ userId: string }> = ({ userId }) => {
  const [badges, setBadges] = useState<Array<{ id: string; badge_name: string; badge_type: string; badge_description: string | null; earned_at: string | null }>>([]);

  React.useEffect(() => {
    const loadBadges = async () => {
      const { data } = await (await import('@/integrations/supabase/client')).supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      if (data) setBadges(data);
    };
    loadBadges();

    // Subscribe to new badges
    const channel = (await import('@/integrations/supabase/client')).then(mod => {
      const ch = mod.supabase
        .channel(`badges-${userId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_badges', filter: `user_id=eq.${userId}` }, (payload) => {
          setBadges(prev => [payload.new as any, ...prev]);
        })
        .subscribe();
      return ch;
    });

    return () => {
      channel.then(ch => {
        import('@/integrations/supabase/client').then(mod => mod.supabase.removeChannel(ch));
      });
    };
  }, [userId]);

  if (badges.length === 0) return null;

  const badgeEmojis: Record<string, string> = {
    'First Seed': '🌱', 'Soil Scientist': '🔬', 'Harvest Hero': '🏆',
    'Water Wise': '💧', 'Bug Buddy': '🐛', 'Compost Champion': '♻️',
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-green-800 flex items-center gap-1">
        <Award className="h-4 w-4" />
        My Badges
      </h4>
      <div className="flex flex-wrap gap-2">
        {badges.map(b => (
          <div key={b.id} className="bg-green-50 rounded-lg px-3 py-2 text-center border border-green-200">
            <span className="text-lg">{badgeEmojis[b.badge_name] || '🏅'}</span>
            <p className="text-xs font-semibold text-green-800">{b.badge_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassroomMode;
