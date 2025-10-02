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
              placeholder="Search discussions, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-primary"
              onClick={() => navigate(`/forum/category/${category.slug}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}