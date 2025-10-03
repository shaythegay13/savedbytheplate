
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, MessageCircle, Calendar, MapPin, Leaf, Sprout, ExternalLink, Clock, Star, Search, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import brooklynNavyYard from "@/assets/brooklyn-navy-yard.webp";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
}

// Community Guidelines
const communityGuidelines = [
  "Be respectful and supportive of all community members",
  "Share knowledge freely and ask questions without hesitation",
  "Stay on topic in each channel to maintain organization", 
  "No spam, self-promotion without prior approval, or commercial solicitation",
  "Help maintain a positive, inclusive environment for learning"
];


// Community Showcase (weekly rotation)
const currentShowcase = {
  title: "Brooklyn Grange Rooftop Farm",
  location: "Brooklyn Navy Yard",
  description: "This week we're featuring Brooklyn Grange, one of NYC's largest rooftop soil farms. Spanning over 2.5 acres across multiple locations, they demonstrate how urban agriculture can thrive in unexpected places.",
  image: brooklynNavyYard,
  highlights: [
    "Over 80,000 lbs of produce grown annually",
    "Hosts educational programs for 10,000+ visitors yearly", 
    "Creates habitat for local wildlife and pollinators",
    "Demonstrates sustainable urban farming practices"
  ]
};

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchCategories();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('discussion_categories')
      .select('*')
      .order('sort_order');
    
    if (data) {
      setCategories(data);
    }
    setLoading(false);
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
    navigate("/forum/new");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">Join Our Growing Community</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              Connect with fellow urban gardeners, share experiences, and learn from experts.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={handleCreateDiscussion}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 transition-all"
              >
                <Plus className="mr-2 h-5 w-5" />
                Start a New Topic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Forums Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 px-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-sbtp-green-800">Discussion Forums</h2>
            </div>

            {/* Search Bar */}
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
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-sbtp-brown-500">Loading forums...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                {categories.map((category, index) => (
                  <Card 
                    key={category.id} 
                    className="border-sbtp-green-200 hover:shadow-lg hover:border-sbtp-green-400 transition-all cursor-pointer"
                    onClick={() => navigate(`/forum/category/${category.slug}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-sbtp-green-100 p-3 rounded-full">
                            <MessageCircle className="h-6 w-6 text-sbtp-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-sbtp-green-700 hover:text-sbtp-green-800 transition-colors">
                              {category.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-sbtp-brown-500 mt-1">
                              Click to explore
                            </CardDescription>
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-sbtp-yellow text-sbtp-brown-700">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sbtp-brown-500 text-sm mb-4">{category.description}</p>
                      <Button 
                        className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/forum/category/${category.slug}`);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View Category
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Community Guidelines */}
            <div className="bg-sbtp-green-50 rounded-lg p-8 mb-16">
              <h3 className="text-2xl font-bold text-sbtp-green-800 mb-6">Community Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-sbtp-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sbtp-brown-700">{guideline}</p>
                  </div>
                ))}
              </div>
            </div>


            {/* Community Showcase */}
            <div className="bg-gradient-to-r from-sbtp-green-100 to-sbtp-beige rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-sbtp-yellow" />
                    <span className="text-sm font-medium text-sbtp-brown-600">Community Showcase</span>
                  </div>
                  <h3 className="text-2xl font-bold text-sbtp-green-800 mb-2">{currentShowcase.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-sbtp-brown-500" />
                    <span className="text-sm text-sbtp-brown-600">{currentShowcase.location}</span>
                  </div>
                  <p className="text-sbtp-brown-700 mb-6">{currentShowcase.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {currentShowcase.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="bg-sbtp-green-500 rounded-full w-2 h-2 mt-2"></div>
                        <span className="text-sm text-sbtp-brown-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-sbtp-brown-500 italic">
                    Featured community showcase rotates weekly
                  </p>
                </div>
                <div className="h-64 lg:h-auto">
                  <img 
                    src={currentShowcase.image} 
                    alt={currentShowcase.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Community Access CTA */}
      <section className="py-16 bg-gradient-to-br from-sbtp-green-800 to-sbtp-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-sbtp-yellow text-sbtp-brown-700 rounded-full px-4 py-2 mb-4">
                  <Star className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-sm">Premium Access</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Want to Connect with Community Gardeners Directly?</h2>
                <p className="text-lg sm:text-xl opacity-90 mb-8">
                  Get exclusive access to our private Discord community of experienced gardeners and our centralized event calendar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-sbtp-yellow/20 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-sbtp-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Private Discord Community</h3>
                      <p className="text-sm opacity-80">Chat directly with experienced community gardeners, get personalized advice, and join live Q&A sessions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-sbtp-yellow/20 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-sbtp-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Centralized Event Calendar</h3>
                      <p className="text-sm opacity-80">Never miss a workshop, seed swap, or community gathering with our comprehensive event calendar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg" className="bg-sbtp-yellow hover:bg-sbtp-yellow/90 text-sbtp-brown-700 text-lg px-8 py-6">
                  <a href="/premium">
                    <Sprout className="mr-2 h-5 w-5" />
                    Subscribe for Premium Access
                  </a>
                </Button>
                <p className="text-sm opacity-70 mt-4">Join hundreds of community gardeners already growing together</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
