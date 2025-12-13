import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Clock, ArrowLeft, Share2, Tag, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
  meta_title: string | null;
  meta_description: string | null;
  category: {
    name: string;
    slug: string;
    color: string;
  } | null;
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image_url,
        published_at,
        read_time_minutes,
        meta_title,
        meta_description,
        author_id,
        category:blog_categories(name, slug, color)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } else {
      // Fetch author separately
      let authorData = null;
      if (data.author_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url')
          .eq('id', data.author_id)
          .single();
        authorData = profile;
      }
      
      setPost({
        ...data,
        author: authorData
      });
      // Update page title for SEO
      document.title = data.meta_title || data.title;
    }
    setLoading(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || '',
          url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Check for headers
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{paragraph.slice(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-5 mb-2">{paragraph.slice(4)}</h3>;
      }
      // Check for bullet lists
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(item => item.startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, i) => (
              <li key={i}>{item.slice(2)}</li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return <p key={index} className="text-muted-foreground leading-relaxed my-4">{paragraph}</p>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-80 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        {/* Category */}
        {post.category && (
          <Link to={`/blog?category=${post.category.slug}`}>
            <Badge 
              className="mb-4 text-white hover:opacity-80 transition-opacity"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Badge>
          </Link>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.avatar_url ? (
                <img 
                  src={post.author.avatar_url} 
                  alt={post.author.display_name || post.author.username}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-sbtp-green-100 flex items-center justify-center">
                  <span className="text-sbtp-green-700 font-medium">
                    {(post.author.display_name || post.author.username)[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="font-medium text-foreground">
                {post.author.display_name || post.author.username}
              </span>
            </div>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.published_at), 'MMMM d, yyyy')}
            </span>
          )}
          {post.read_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.read_time_minutes} min read
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>

        {/* Cover image */}
        {post.cover_image_url && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium border-l-4 border-sbtp-green-500 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t">
          <div className="bg-sbtp-green-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Enjoyed this article?</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for more gardening tips and community updates.
            </p>
            <Link to="/#newsletter">
              <Button className="bg-sbtp-green-600 hover:bg-sbtp-green-700">
                Subscribe to Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;