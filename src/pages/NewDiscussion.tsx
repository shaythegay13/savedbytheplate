import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewDiscussion() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    fetchCategories();
    
    // Pre-select category from URL parameter if present
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get('category');
    if (categorySlug) {
      // Set category after categories are loaded
      const timer = setTimeout(() => {
        const foundCategory = categories.find(c => c.slug === categorySlug);
        if (foundCategory) {
          setCategoryId(foundCategory.id);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [categories]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a discussion. Authentication is coming soon!",
        variant: "destructive",
      });
      navigate("/forum");
      return;
    }
    setUser(user);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("discussion_categories")
      .select("id, name, slug")
      .order("sort_order");
    
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a discussion. Authentication is coming soon!",
        variant: "destructive",
      });
      navigate("/forum");
      return;
    }

    if (!title.trim() || !content.trim() || !categoryId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const tagArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const { data, error } = await supabase
      .from("discussions")
      .insert({
        user_id: user.id,
        category_id: categoryId,
        title: title.trim(),
        content: content.trim(),
        tags: tagArray,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Success",
      description: "Discussion created successfully",
    });

    navigate(`/forum/discussion/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/forum")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Create New Discussion</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, questions, or ideas..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., tomatoes, composting, beginner"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Add tags to help others find your discussion
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create Discussion"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/forum")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}