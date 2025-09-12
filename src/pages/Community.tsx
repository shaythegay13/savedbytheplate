
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Calendar, MapPin, Leaf, Sprout, ExternalLink, Clock, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

// Discord Servers (specific to your requirements)
const discordServers = [
  {
    name: "NYC Urban Gardeners",
    description: "Connect with fellow urban gardeners across the five boroughs",
    memberCount: 3200,
    featured: true
  },
  {
    name: "Container Gardening",
    description: "Master the art of growing in small spaces and containers",
    memberCount: 2850,
    featured: false
  },
  {
    name: "Permaculture Principles",
    description: "Learn sustainable design principles for urban environments",
    memberCount: 1940,
    featured: false
  },
  {
    name: "Soil Health",
    description: "Everything about building and maintaining healthy soil",
    memberCount: 2120,
    featured: false
  },
  {
    name: "Rooftop Farming",
    description: "Specialized community for rooftop and vertical growing",
    memberCount: 1580,
    featured: false
  },
  {
    name: "Seasonal Harvests",
    description: "Share your harvests and seasonal growing experiences",
    memberCount: 2340,
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

// Upcoming Community Events
const upcomingEvents = [
  {
    title: "Seed Swap Saturday",
    date: "March 15, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "Brooklyn Botanic Garden",
    description: "Bring seeds to trade and meet fellow gardeners"
  },
  {
    title: "Container Gardening Workshop",
    date: "March 22, 2024", 
    time: "1:00 PM - 4:00 PM",
    location: "Queens Community Center",
    description: "Hands-on workshop for apartment gardening"
  },
  {
    title: "Urban Composting Demo",
    date: "March 29, 2024",
    time: "11:00 AM - 1:00 PM", 
    location: "Central Park Conservatory",
    description: "Learn composting techniques for small spaces"
  }
];

// Community Showcase (weekly rotation)
const currentShowcase = {
  title: "Brooklyn Grange Rooftop Farm",
  location: "Long Island City, Queens",
  description: "This week we're featuring Brooklyn Grange, one of NYC's largest rooftop soil farms. Spanning over 2.5 acres across multiple locations, they demonstrate how urban agriculture can thrive in unexpected places.",
  image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
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
                <h3 className="font-semibold">Discord Community</h3>
                <p className="text-sm opacity-80">14,000+ members and growing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discord Servers Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-sbtp-green-800 mb-6 sm:mb-8 px-2">Discord Communities</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {discordServers.map((server, index) => (
                <Card key={index} className={`border-sbtp-green-200 hover:shadow-lg transition-all ${server.featured ? 'ring-2 ring-sbtp-yellow' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-sbtp-green-100 p-3 rounded-full">
                          <MessageCircle className="h-6 w-6 text-sbtp-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-sbtp-green-700">{server.name}</CardTitle>
                          <CardDescription className="text-xs text-sbtp-brown-500">
                            {server.memberCount.toLocaleString()} members
                          </CardDescription>
                        </div>
                      </div>
                      {server.featured && (
                        <Badge className="bg-sbtp-yellow text-sbtp-brown-700">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sbtp-brown-500 text-sm mb-4">{server.description}</p>
                    <Button className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Join Server
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

            {/* Upcoming Events */}
            <h3 className="text-2xl font-bold text-sbtp-green-800 mb-8">Upcoming Community Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="border-sbtp-green-200 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="bg-sbtp-blue/20 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-sbtp-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-sbtp-green-700">{event.title}</CardTitle>
                        <CardDescription className="text-sm text-sbtp-brown-500">
                          {event.date} • {event.time}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-sbtp-brown-400" />
                      <span className="text-sm text-sbtp-brown-600">{event.location}</span>
                    </div>
                    <p className="text-sm text-sbtp-brown-500 mb-4">{event.description}</p>
                    <Button variant="outline" className="w-full border-sbtp-green-500 text-sbtp-green-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </CardContent>
                </Card>
              ))}
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

      {/* Join Discord CTA */}
      <section className="py-12 bg-sbtp-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Join the Conversation?</h2>
            <p className="text-lg opacity-90 mb-8">
              Our Discord community is a vibrant space for gardeners, farmers, educators, and food enthusiasts sharing knowledge and inspiration.
            </p>
            <Button asChild className="bg-sbtp-yellow hover:bg-sbtp-yellow/80 text-sbtp-brown-700 text-lg py-6 px-10">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Join our Discord
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
