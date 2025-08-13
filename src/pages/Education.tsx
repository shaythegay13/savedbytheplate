
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";


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
    <>
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn to Grow</h1>
            <p className="text-xl opacity-90 mb-8">
              Master the art of urban farming with our comprehensive courses designed for New York City gardeners.
            </p>
            <Button variant="secondary" size="lg">
              <a href="#courses">Browse Courses</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="free" className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <TabsList className="bg-sbtp-green-100">
                <TabsTrigger value="free" className="data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                  Free Courses
                </TabsTrigger>
                <TabsTrigger value="premium" className="data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                  Premium Courses
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="free">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {freeCourses.map((course, index) => (
                  <Card key={index} className="border-sbtp-green-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sbtp-green-700">{course.title}</CardTitle>
                        <span className="bg-sbtp-blue text-white text-xs px-2 py-1 rounded-full">
                          {course.platform}
                        </span>
                      </div>
                      <CardDescription className="text-sm text-gray-500">{course.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-sbtp-brown-500">{course.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full border-sbtp-green-500 text-sbtp-green-700">
                        <a href={course.link} target="_blank" rel="noopener noreferrer">Watch Course</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="premium">
              <div className="bg-sbtp-yellow/30 rounded-lg p-6 mb-8">
                <h3 className="font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-sbtp-brown-700"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                  Premium Content
                </h3>
                <p className="text-sbtp-brown-700 mt-2">
                  These advanced courses are available exclusively to our premium subscribers. 
                  <Link to="/premium" className="ml-1 underline text-sbtp-green-700 font-medium">
                    Upgrade now
                  </Link> to access all premium content for just $10/month or $100/year.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {premiumCourses.map((course, index) => (
                  <Card key={index} className="border-sbtp-green-200 overflow-hidden opacity-90 hover:shadow-md transition-all">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          <span className="text-sm">Premium</span>
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
                        <span className="bg-sbtp-yellow text-sbtp-brown-700 text-xs px-2 py-1 rounded-full">
                          {course.platform}
                        </span>
                      </div>
                      <CardDescription className="text-sm text-gray-500">{course.duration}</CardDescription>
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
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
    </div>
    
    </>
  );
};

export default Education;
