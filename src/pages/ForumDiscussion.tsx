import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, MessageCircle, Clock, Award, 
  Trash2, Edit, Lock, Pin, Flag 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Discussion {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    points: number;
    bio: string;
  };
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  is_edited: boolean;
  user_id: string;
  parent_reply_id: string | null;
  profiles: {
    username: string;
    points: number;
  };
}

export default function ForumDiscussion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    fetchDiscussion();
    fetchReplies();
    incrementViewCount();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (roleData) setUserRole(roleData.role);
    }
  };

  const fetchDiscussion = async () => {
    const { data, error } = await supabase
      .from("discussions")
      .select(`
        *,
        profiles!discussions_user_id_fkey(username, points, bio)
      `)
      .eq("id", id)
      .single();

    if (data) setDiscussion(data as any);
  };

  const fetchReplies = async () => {
    const { data, error } = await supabase
      .from("discussion_replies")
      .select(`
        *,
        profiles!discussion_replies_user_id_fkey(username, points)
      `)
      .eq("discussion_id", id)
      .order("created_at", { ascending: true });

    if (data) setReplies(data as any);
  };

  const incrementViewCount = async () => {
    await supabase.rpc("increment_discussion_views", { discussion_id: id });
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to reply",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!newReply.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("discussion_replies")
      .insert({
        discussion_id: id,
        user_id: user.id,
        content: newReply,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    } else {
      setNewReply("");
      fetchReplies();
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
    }

    setIsSubmitting(false);
  };

  const handleDeleteReply = async (replyId: string) => {
    const { error } = await supabase
      .from("discussion_replies")
      .delete()
      .eq("id", replyId);

    if (!error) {
      fetchReplies();
      toast({
        title: "Success",
        description: "Reply deleted successfully",
      });
    }
  };

  const canModerate = userRole === "admin" || userRole === "moderator";

  if (!discussion) {
    return <div className="min-h-screen bg-background"><Navbar /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/forum")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {discussion.is_pinned && (
                  <Pin className="h-5 w-5 text-primary" />
                )}
                {discussion.is_locked && (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <h1 className="text-3xl font-bold">{discussion.title}</h1>
              </div>
              
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {discussion.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {discussion.profiles?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">
                  {discussion.profiles?.username}
                </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {discussion.profiles?.points} points
                </Badge>
                <span className="text-sm text-muted-foreground">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {new Date(discussion.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                {discussion.profiles?.bio}
              </p>
              
              <div className="prose prose-sm max-w-none">
                {discussion.content}
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Replies ({discussion.reply_count})
        </h2>

        <div className="space-y-4 mb-8">
          {replies.map((reply) => (
            <Card key={reply.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {reply.profiles?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {reply.profiles?.username}
                      </span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {reply.profiles?.points} points
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                      {reply.is_edited && (
                        <Badge variant="secondary">edited</Badge>
                      )}
                    </div>
                    
                    {(user?.id === reply.user_id || canModerate) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this reply? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteReply(reply.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  
                  <p className="text-sm">{reply.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!discussion.is_locked && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Post a Reply</h3>
            <Textarea
              placeholder="Share your thoughts..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <Button
              onClick={handleSubmitReply}
              disabled={isSubmitting || !newReply.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}