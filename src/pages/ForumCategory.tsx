import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus, Search, Clock, Pin, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  user_id: string;
  category_id: string;
  profiles: {
    username: string;
    points: number;
  };
}

export default function ForumCategory() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchCategory();
  }, [slug]);

  useEffect(() => {
    if (!category?.id) return;
    const delayDebounceFn = setTimeout(() => {
      fetchDiscussions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category?.id, searchQuery]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCategory = async () => {
    const { data, error } = await supabase
      .from("discussion_categories")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (data) setCategory(data);
  };

  const fetchDiscussions = async () => {
    if (!category) return;

    let query = supabase
      .from("discussions")
      .select("*")
      .eq("category_id", category.id)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (data) setDiscussions(data as any);
  };

  const handleCreateDiscussion = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a discussion. Authentication is coming soon!",
        variant: "destructive",
      });
      return;
    }
    navigate(`/forum/new?category=${slug}`);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/forum")}
          className="mb-6 transition-all hover:scale-105"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Topics
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">
              {category.description}
            </p>
          </div>
          
          <Button 
            onClick={handleCreateDiscussion} 
            size="lg"
            className="transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Start a New Topic
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {discussions.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No discussions yet</p>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation in this category!
              </p>
              <Button onClick={handleCreateDiscussion} className="transition-all hover:scale-105">
                Create Discussion
              </Button>
            </Card>
          ) : (
            discussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => navigate(`/forum/discussion/${discussion.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {discussion.is_pinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                        {discussion.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {discussion.content}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(discussion.created_at).toLocaleDateString()}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {discussion.reply_count} replies
                      </span>
                      
                      {discussion.profiles?.username && (
                        <span>
                          by <span className="font-medium text-foreground">
                            {discussion.profiles.username}
                          </span>
                        </span>
                      )}
                      
                      {discussion.tags && discussion.tags.length > 0 && (
                        <div className="flex gap-2">
                          {discussion.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
