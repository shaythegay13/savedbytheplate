
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, Download, Clock, Star, Play, FileText, Mail, Users, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

// Featured Articles
const featuredArticles = [
  {
    title: "Container Gardening in Small NYC Apartments",
    excerpt: "Maximize your growing potential with these space-saving container gardening techniques perfect for NYC living.",
    author: "Sarah Green",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    category: "Urban Gardening"
  },
  {
    title: "Seasonal Growing Guide for Zone 7a",
    excerpt: "A complete month-by-month guide to growing vegetables in New York's climate zone.",
    author: "Mike Rodriguez",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    category: "Seasonal Guides"
  },
  {
    title: "Building Community Through Urban Farming",
    excerpt: "How neighborhood gardens are strengthening communities across the five boroughs.",
    author: "Lisa Chen",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    category: "Community"
  }
];

// Video Tutorials
const videoTutorials = [
  {
    title: "Setting Up Your First Balcony Garden",
    duration: "15:30",
    instructor: "Garden Expert Maria",
    views: "24.5K",
    thumbnail: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    difficulty: "Beginner"
  },
  {
    title: "Composting in Small Spaces",
    duration: "12:45",
    instructor: "Eco-Warrior Jake",
    views: "18.2K",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    difficulty: "Beginner"
  },
  {
    title: "Advanced Companion Planting Techniques",
    duration: "22:15",
    instructor: "Dr. Plant Science",
    views: "31.8K",
    thumbnail: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    difficulty: "Advanced"
  }
];

// Downloadable Guides
const downloadableGuides = [
  {
    title: "NYC Planting Calendar PDF",
    description: "Month-by-month planting guide specifically for New York City's climate",
    fileSize: "2.3 MB",
    downloads: "5.2K",
    format: "PDF"
  },
  {
    title: "Pest Identification Handbook",
    description: "Identify and treat common garden pests in urban environments",
    fileSize: "4.1 MB",
    downloads: "3.8K",
    format: "PDF"
  },
  {
    title: "Seed Starting Checklist",
    description: "Complete checklist for starting seeds indoors successfully",
    fileSize: "1.5 MB",
    downloads: "7.1K",
    format: "PDF"
  }
];


// Sample course data
const freeCourses = [
  {
    title: "Introduction to Urban Gardening",
    description: "Learn the basics of starting your own urban garden in small spaces.",
    imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    platform: "YouTube",
    duration: "45 minutes",
    link: "#"
  },
  {
    title: "Sustainable Agriculture Fundamentals",
    description: "Understand the core principles of sustainability in modern agriculture.",
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    platform: "YouTube",
    duration: "1 hour",
    link: "#"
  },
  {
    title: "Composting for Beginners",
    description: "Transform your kitchen waste into garden gold with simple composting techniques.",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    platform: "YouTube",
    duration: "30 minutes",
    link: "#"
  }
];

const premiumCourses = [
  {
    title: "Advanced Container Gardening",
    description: "Master techniques for maximizing yields in small containers and urban spaces.",
    imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    platform: "Systeme.io",
    duration: "2 hours",
    link: "#"
  },
  {
    title: "Season Extension Techniques",
    description: "Learn how to grow food year-round with greenhouses, row covers, and cold frames.",
    imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    platform: "Systeme.io",
    duration: "3 hours",
    link: "#"
  },
  {
    title: "Permaculture Design Certification",
    description: "Comprehensive course on designing sustainable and productive ecosystems.",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    platform: "Systeme.io",
    duration: "12 hours",
    link: "#"
  },
  {
    title: "Sustainable Agriculture Basics",
    description: "This course teaches you about some of the basic knowledge about the varied topics underneath sustainable agriculture such as composting, water-saving techniques, and organic growing.",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b",
    platform: "Systeme.io",
    duration: "8 hours",
    link: "https://savedbytheplate.systeme.io/start"
  }
];

const Education = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">School Garden Tours</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              Connect your students with local food justice work through community garden tours
            </p>
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:shay@savedbytheplate.org">
                <Mail className="mr-2 h-5 w-5" />
                Contact Shay
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* School Garden Tours Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Contact Shay Section */}
            <div className="text-center mb-12">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">Contact Shay Bouchles</CardTitle>
                  <CardDescription className="text-lg">
                    Executive Director - School Garden Tour Programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Schedule a consultation to discuss bringing educational garden tours to your school
                  </p>
                  <div className="flex justify-center">
                    <Button size="lg" asChild>
                      <a href="mailto:shay@savedbytheplate.org" className="inline-flex items-center">
                        <Mail className="mr-2 h-5 w-5" />
                        Email Shay Directly
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Program Information */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary mb-4">School Garden Tour Program</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Now, schools can contact Shay Bouchles - the executive director - to set up a contract 
                  to give kids within their schools tours of their closest community garden as a way to 
                  show the children what is going on in their local communities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <MapPin className="mr-3 h-6 w-6 text-primary" />
                      Local Community Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This will show kids that there is food justice work going on in their local communities 
                      and potentially down the block from them. Students will discover the amazing efforts 
                      happening right in their neighborhood.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Users className="mr-3 h-6 w-6 text-primary" />
                      Educational Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      These tours provide hands-on learning experiences that connect students with sustainable 
                      agriculture, food security, and community organizing. Students learn about growing food, 
                      environmental stewardship, and community engagement.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-primary">Program Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Local Garden Tours</h3>
                      <p className="text-sm text-muted-foreground">
                        Visit community gardens in your neighborhood to see food justice in action
                      </p>
                    </div>
                    <div>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Community Connection</h3>
                      <p className="text-sm text-muted-foreground">
                        Meet local gardeners and learn about grassroots food access initiatives
                      </p>
                    </div>
                    <div>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Educational Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        Hands-on learning about sustainability, nutrition, and community organizing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Card className="inline-block border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">
                      Contact Shay to discuss bringing this program to your school
                    </p>
                    <Button asChild>
                      <a href="mailto:shay@savedbytheplate.org">
                        <Mail className="mr-2 h-4 w-4" />
                        Schedule a Consultation
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
