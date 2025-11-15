
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Video, Download, Clock, Star, Play, FileText, Mail, Users, MapPin, GraduationCap, Sprout } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 6-Week Youth Education Course Curriculum
const courseCurriculum = [
  {
    week: 1,
    focus: "History of Community Gardens",
    description: "Uncover the rich legacies of urban gardens and their pivotal role in NYC's food justice movements"
  },
  {
    week: 2,
    focus: "Community Gardens Today",
    description: "Investigate the current state of gardens across NYC and their impacts on neighborhoods"
  },
  {
    week: 3,
    focus: "Urban Growing Strategies",
    description: "Practice composting, urban planting, and other sustainable techniques for city environments"
  },
  {
    week: 4,
    focus: "Urban Biodiversity & Environmental Benefits",
    description: "Explore how gardens support biodiversity, reduce heat island effect, and improve air quality"
  },
  {
    week: 5,
    focus: "Guest Speaker",
    description: "Bring in a guest speaker who works in a community garden to talk about their experience"
  },
  {
    week: 6,
    focus: "Environmental Justice & Community Gardens",
    description: "Examine the intersection of urban agriculture, equity, and environmental advocacy"
  }
];


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

const ShayEmailDialog = () => {
  const [open, setOpen] = useState(false);
  const email = 'info@savedbytheplate.org';
  const subject = '6-Week Youth Course Inquiry';
  
  const emailServices = [
    {
      name: 'Gmail',
      url: `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(subject)}`,
      icon: Mail
    },
    {
      name: 'Yahoo',
      url: `https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent(subject)}`,
      icon: Mail
    }
  ];

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        <Mail className="mr-2 h-5 w-5" />
        Email Shay Directly
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-primary">Choose Your Email Service</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please select your preferred email service to contact Shay
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {emailServices.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-primary/20 hover:bg-primary/5 hover:border-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                <service.icon className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{service.name}</span>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Education = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">6-Week Youth Education Course</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              A comprehensive program for middle and high school students exploring food justice, food sovereignty, 
              community gardens, urban agriculture, and growing their own food
            </p>
          </div>
        </div>
      </section>

      {/* Course Curriculum Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Course Curriculum</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our structured 6-week program takes students on a journey through food justice, 
                from historical context to hands-on sustainable practices
              </p>
            </div>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Week</TableHead>
                    <TableHead className="w-64">Session Focus</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseCurriculum.map((session) => (
                    <TableRow key={session.week}>
                      <TableCell className="font-bold text-primary text-lg">
                        {session.week}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {session.focus}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {session.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
                    Executive Director - Course Coordinator
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Interested in bringing this 6-week course to your school? Contact Shay to learn more
                  </p>
                  <div className="flex justify-center">
                    <ShayEmailDialog />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Program Information */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary mb-4">6-Week Afterschool Program</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our comprehensive afterschool program teaches students about community gardens, urban agriculture, 
                  environmental justice, and sustainable growing practices through hands-on learning experiences.
                </p>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-primary">Program Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">History of Community Gardens</h4>
                        <p className="text-sm text-muted-foreground">
                          Explore the rich history of community gardens and their role in food justice movements
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Community Gardens Today</h4>
                        <p className="text-sm text-muted-foreground">
                          Discover what community gardens are doing in NYC today and their impact on neighborhoods
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Urban Growing Strategies</h4>
                        <p className="text-sm text-muted-foreground">
                          Learn essential techniques including composting and other sustainable practices for urban settings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Urban Biodiversity & Environmental Benefits</h4>
                        <p className="text-sm text-muted-foreground">
                          Understand how urban gardens reduce the heat island effect and naturally filter the air
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Environmental Justice & Community Gardens</h4>
                        <p className="text-sm text-muted-foreground">
                          Explore the intersection of environmental justice, equity, and community gardening
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        6
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Additional Topics & Wrap-Up</h4>
                        <p className="text-sm text-muted-foreground">
                          Deep dive into additional urban agriculture topics and reflect on what students have learned
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl justify-center">
                    <MapPin className="mr-3 h-6 w-6 text-primary" />
                    Optional 7th Week: Community Garden Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    As we get closer to the opening season of the city's community gardens, there could be an 
                    optional 7th week where we take a tour of the nearest community garden during the normal 
                    session time. This hands-on field trip brings everything students have learned to life!
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <BookOpen className="mr-3 h-6 w-6 text-primary" />
                      Educational Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Students gain comprehensive knowledge about urban agriculture, environmental science, 
                      and social justice while developing practical skills in sustainable living and community engagement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Users className="mr-3 h-6 w-6 text-primary" />
                      Community Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This program connects students with food justice work happening in their local communities, 
                      showing them that meaningful change is happening right in their own neighborhoods.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Card className="inline-block border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">
                      Contact Shay to discuss bringing this program to your school
                    </p>
                    <ShayEmailDialog />
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
