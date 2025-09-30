
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Calendar, MapPin, Leaf, Sprout, ExternalLink, Clock, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

// Discussion Forums
const discussionForums = [
  {
    name: "NYC Urban Gardening",
    description: "Connect with fellow urban gardeners across the five boroughs",
    topics: 342,
    posts: 3200,
    latestPost: "2 hours ago",
    featured: true
  },
  {
    name: "Container Gardening Tips",
    description: "Master the art of growing in small spaces and containers",
    topics: 215,
    posts: 2850,
    latestPost: "3 hours ago",
    featured: false
  },
  {
    name: "Permaculture & Sustainability",
    description: "Learn sustainable design principles for urban environments",
    topics: 156,
    posts: 1940,
    latestPost: "5 hours ago",
    featured: false
  },
  {
    name: "Soil Health & Composting",
    description: "Everything about building and maintaining healthy soil",
    topics: 189,
    posts: 2120,
    latestPost: "1 day ago",
    featured: false
  },
  {
    name: "Rooftop & Vertical Farming",
    description: "Specialized community for rooftop and vertical growing",
    topics: 124,
    posts: 1580,
    latestPost: "1 day ago",
    featured: false
  },
  {
    name: "Seasonal Harvests & Recipes",
    description: "Share your harvests and seasonal growing experiences",
    topics: 201,
    posts: 2340,
    latestPost: "4 hours ago",
    featured: false
  }
];

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
  location: "Long Island City, Queens",
  description: "This week we're featuring Brooklyn Grange, one of NYC's largest rooftop soil farms. Spanning over 2.5 acres across multiple locations, they demonstrate how urban agriculture can thrive in unexpected places.",
  image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
  highlights: [
    "Over 80,000 lbs of produce grown annually",
    "Hosts educational programs for 10,000+ visitors yearly", 
    "Creates habitat for local wildlife and pollinators",
    "Demonstrates sustainable urban farming practices"
  ]
};

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">Join Our Growing Community</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              Connect with fellow urban gardeners, share experiences, and learn from experts across NYC's five boroughs.
            </p>
            <div className="bg-white/10 p-4 sm:p-6 rounded-lg inline-flex items-center mx-4">
              <MessageCircle className="mr-3 h-8 w-8" />
              <div className="text-left">
                <h3 className="font-semibold">Discussion Forums</h3>
                <p className="text-sm opacity-80">14,000+ members and growing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Forums Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-sbtp-green-800 mb-6 sm:mb-8 px-2">Discussion Forums</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {discussionForums.map((forum, index) => (
                <Card key={index} className={`border-sbtp-green-200 hover:shadow-lg transition-all ${forum.featured ? 'ring-2 ring-sbtp-yellow' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-sbtp-green-100 p-3 rounded-full">
                          <MessageCircle className="h-6 w-6 text-sbtp-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-sbtp-green-700">{forum.name}</CardTitle>
                          <CardDescription className="text-xs text-sbtp-brown-500 flex items-center gap-2 mt-1">
                            <span>{forum.topics} topics</span>
                            <span>•</span>
                            <span>{forum.posts} posts</span>
                          </CardDescription>
                        </div>
                      </div>
                      {forum.featured && (
                        <Badge className="bg-sbtp-yellow text-sbtp-brown-700">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sbtp-brown-500 text-sm mb-3">{forum.description}</p>
                    <div className="flex items-center gap-2 text-xs text-sbtp-brown-400 mb-4">
                      <Clock className="h-3 w-3" />
                      <span>Latest post: {forum.latestPost}</span>
                    </div>
                    <Button className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      View Forum
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

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
