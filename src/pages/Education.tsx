
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, Download, Clock, Star, Play, FileText } from "lucide-react";
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">Urban Gardening Education Hub</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              Learn, grow, and thrive with our comprehensive collection of articles, videos, guides, and premium courses.
            </p>
            <Button variant="secondary" size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-sbtp-green-800 mb-6 sm:mb-8 px-2">Featured Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {featuredArticles.map((article, index) => (
                <Card key={index} className="border-sbtp-green-200 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-sbtp-green-100 text-sbtp-green-700">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-sbtp-brown-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-sbtp-green-700 group-hover:text-sbtp-green-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sbtp-brown-500">
                      {article.excerpt}
                    </CardDescription>
                    <div className="text-xs text-sbtp-brown-400 mt-2">
                      By {article.author}
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-sbtp-green-500 text-sbtp-green-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Video Tutorials Section */}
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-8">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="border-sbtp-green-200 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="h-6 w-6 text-sbtp-green-700" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={video.difficulty === 'Beginner' ? 'bg-sbtp-green-500' : 'bg-sbtp-blue'}>
                        {video.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sbtp-green-700">{video.title}</CardTitle>
                    <CardDescription className="text-sbtp-brown-500">
                      By {video.instructor} • {video.views} views
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-sbtp-green-500 text-sbtp-green-700">
                      <Video className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Downloadable Guides Section */}
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-8">Downloadable Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {downloadableGuides.map((guide, index) => (
                <Card key={index} className="border-sbtp-green-200 hover:shadow-lg transition-all">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-sbtp-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-sbtp-green-600" />
                    </div>
                    <CardTitle className="text-sbtp-green-700">{guide.title}</CardTitle>
                    <CardDescription className="text-sbtp-brown-500">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-between text-xs text-sbtp-brown-400 mb-4">
                      <span>{guide.format} • {guide.fileSize}</span>
                      <span>{guide.downloads} downloads</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download Free
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Premium Courses Section */}
            <div className="bg-sbtp-yellow/20 rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">Premium Courses</h2>
              <p className="text-lg text-sbtp-brown-700 mb-6">
                Take your gardening skills to the next level with our comprehensive premium courses. 
                <Link to="/premium" className="ml-1 underline text-sbtp-green-700 font-medium">
                  Upgrade to premium
                </Link> for $10/month or $100/year to access all advanced content.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {premiumCourses.map((course, index) => (
                  <Card key={index} className="border-sbtp-green-200 overflow-hidden opacity-90 hover:shadow-md transition-all">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white z-10">
                        <div className="text-center">
                          <Star className="mx-auto mb-2 h-6 w-6" />
                          <span className="text-sm font-medium">Premium</span>
                        </div>
                      </div>
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sbtp-green-700">{course.title}</CardTitle>
                        <Badge className="bg-sbtp-yellow text-sbtp-brown-700">
                          {course.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-sbtp-brown-500">{course.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
                        <Link to="/premium">Unlock Premium</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
