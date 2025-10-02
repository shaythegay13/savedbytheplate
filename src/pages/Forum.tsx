import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Plus, Search, TrendingUp, Clock, Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
  sort_order: number;
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

export default function Forum() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchCategories();
    fetchDiscussions();
  }, [activeTab]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("discussion_categories")
      .select("*")
      .order("sort_order");
    
    if (data) setCategories(data);
  };

  const fetchDiscussions = async () => {
    let query = supabase
      .from("discussions")
      .select(`
        *,
        profiles!discussions_user_id_fkey(username, points)
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (activeTab !== "all") {
      const category = categories.find(c => c.slug === activeTab);
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (data) setDiscussions(data as any);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDiscussions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCreateDiscussion = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a discussion",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate("/forum/new");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">
              Connect, share, and learn with fellow urban gardeners
            </p>
          </div>
          
          <Button onClick={handleCreateDiscussion} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Discussion
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">
              <TrendingUp className="mr-2 h-4 w-4" />
              All Discussions
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.slug}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {discussions.length === 0 ? (
                <Card className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">No discussions yet</p>
                  <p className="text-muted-foreground mb-4">
                    Be the first to start a conversation!
                  </p>
                  <Button onClick={handleCreateDiscussion}>Create Discussion</Button>
                </Card>
              ) : (
                discussions.map((discussion) => (
                  <Card
                    key={discussion.id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
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
                          
                          <span>
                            by <span className="font-medium text-foreground">
                              {discussion.profiles?.username}
                            </span>
                          </span>
                          
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}