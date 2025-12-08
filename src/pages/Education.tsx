
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

// Course 1: Community Gardens & Food Justice
const communityGardensCurriculum = [
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

// Course 2: Composting, Soil Science & Sustainability
const soilScienceCurriculum = [
  {
    week: 1,
    focus: "Understanding Food Waste",
    description: "Explore the scale of food waste in our communities and its environmental impact"
  },
  {
    week: 2,
    focus: "Composting Fundamentals",
    description: "Learn the science behind composting and how to turn food scraps into nutrient-rich soil"
  },
  {
    week: 3,
    focus: "Soil Nutrients & Health",
    description: "Discover the essential nutrients plants need and how to build healthy, productive soil"
  },
  {
    week: 4,
    focus: "Micro & Macro Nutrients",
    description: "Deep dive into the role of nitrogen, phosphorus, potassium, and micronutrients in plant growth"
  },
  {
    week: 5,
    focus: "Guest Speaker",
    description: "Hear from a composting or soil science expert about real-world applications"
  },
  {
    week: 6,
    focus: "Soil Organisms & Ecosystems",
    description: "Explore the fascinating world of bacteria, fungi, earthworms, and other organisms that make soil alive"
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">6-Week Youth Education Courses</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              Two comprehensive programs for middle and high school students exploring food justice, sustainability, 
              community gardens, composting, and environmental science
            </p>
          </div>
        </div>
      </section>

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
                    Interested in bringing one of our 6-week courses to your school? Contact Shay to learn more
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
                <h2 className="text-3xl font-bold text-primary mb-4">Choose Your Course</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We offer two 6-week programs designed for middle and high school students. Both courses include 
                  a guest speaker in week 5 and an optional 7th week garden tour.
                </p>
              </div>

              <Tabs defaultValue="community-gardens" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="community-gardens" className="flex items-center gap-2">
                    <Sprout className="h-4 w-4" />
                    <span className="hidden sm:inline">Community Gardens</span>
                    <span className="sm:hidden">Gardens</span>
                  </TabsTrigger>
                  <TabsTrigger value="soil-science" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="hidden sm:inline">Soil Science</span>
                    <span className="sm:hidden">Soil</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="community-gardens">
                  <Card className="bg-primary/5 border-primary/20 mb-6">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl text-primary">Community Gardens & Food Justice</CardTitle>
                      <CardDescription className="text-center">
                        Explore food justice, food sovereignty, community gardens, and urban agriculture
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {communityGardensCurriculum.map((week) => (
                          <div key={week.week} className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                              {week.week}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{week.focus}</h4>
                              <p className="text-sm text-muted-foreground">{week.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="soil-science">
                  <Card className="bg-primary/5 border-primary/20 mb-6">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl text-primary">Composting, Soil Science & Sustainability</CardTitle>
                      <CardDescription className="text-center">
                        Learn about food waste, composting, soil nutrients, and the organisms that make soil alive
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {soilScienceCurriculum.map((week) => (
                          <div key={week.week} className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                              {week.week}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{week.focus}</h4>
                              <p className="text-sm text-muted-foreground">{week.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl justify-center">
                    <MapPin className="mr-3 h-6 w-6 text-primary" />
                    Optional 7th Week: Community Garden Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Both courses offer an optional 7th week where students tour the nearest community garden 
                    during the normal session time. This hands-on field trip brings everything learned to life!
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
