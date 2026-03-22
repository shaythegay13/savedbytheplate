import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Video, Download, Clock, Star, Play, FileText, Mail, Users, MapPin, GraduationCap, Sprout, ZoomIn, Monitor, Award, Mic, Leaf } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PhotoLightbox } from "@/components/ui/photo-lightbox";
import educationGarden1 from "@/assets/education-garden-1.jpg";
import educationGarden2 from "@/assets/education-garden-2.jpeg";
import educationGarden3 from "@/assets/education-garden-3.jpeg";
import educationGarden4 from "@/assets/education-garden-4.jpeg";
import educationGarden5 from "@/assets/education-garden-5.jpeg";

// Gallery images configuration
const galleryImages = [
  { src: educationGarden1, alt: "Students learning about cover cropping", caption: "Students in the Bronx at their community garden learning about cover cropping." },
  { src: educationGarden2, alt: "Students describing beneficial microfauna", caption: "Students describing what beneficial microfauna and micronutrients are." },
  { src: educationGarden3, alt: "Student providing examples of beneficial microbes", caption: "A student providing some examples of microbes that are beneficial to the environment and sustainability." },
  { src: educationGarden4, alt: "Nando Rodriguez and Che talking to students", caption: "Nando Rodriguez, Senior Manager for Environmental Programming at Brotherhood Sister Sol, and Che, a community gardener in the Bronx, talking to students about the benefits of composting locally." },
  { src: educationGarden5, alt: "Vermicomposting education", caption: "Educating the students on the benefits of vermicomposting - worms that digest our food waste." },
];

// Program 1: Community Gardens & Food Justice
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

// Program 2: Composting, Soil Science & Sustainability
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

const ShayEmailDialog = () => {
  const [open, setOpen] = useState(false);
  const email = 'info@savedbytheplate.org';
  const subject = 'Youth Education Program Inquiry';
  
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
        Email Us Directly
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-primary">Choose Your Email Service</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please select your preferred email service to contact us
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Youth Food Education Programs — Food Justice &amp; Urban Agriculture | Saved by the Plate Inc.</title>
      <meta name="description" content="Customizable 6-week programs for youth exploring food justice, community gardens, composting, and urban agriculture in New York City. In-school and after-school programs available." />
      <link rel="canonical" href="https://www.savedbytheplate.org/education" />
      <meta property="og:title" content="Youth Food Education Programs | Saved by the Plate Inc." />
      <meta property="og:url" content="https://www.savedbytheplate.org/education" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.savedbytheplate.org/"},{"@type":"ListItem","position":2,"name":"Education Programs","item":"https://www.savedbytheplate.org/education"}]}` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"EducationalOrganization","@id":"https://www.savedbytheplate.org/education#educational-org","name":"Saved by the Plate Inc. — Youth Education Programs","url":"https://www.savedbytheplate.org/education","description":"Customizable youth education programs exploring food justice, sustainability, community gardens, composting, and environmental science for students of all ages.","parentOrganization":{"@id":"https://www.savedbytheplate.org/#organization"},"areaServed":{"@type":"City","name":"New York City"},"email":"info@savedbytheplate.org","hasOfferCatalog":{"@type":"OfferCatalog","name":"Youth Education Programs","itemListElement":[{"@type":"Offer","itemOffered":{"@id":"https://www.savedbytheplate.org/education#course-community-gardens"}},{"@type":"Offer","itemOffered":{"@id":"https://www.savedbytheplate.org/education#course-soil-science"}}]}}` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"Course","@id":"https://www.savedbytheplate.org/education#course-community-gardens","name":"Community Gardens & Food Justice","description":"Explore food justice, food sovereignty, community gardens, and urban agriculture in New York City. A 6-week customizable program for youth covering the history and impact of urban gardens, sustainable growing strategies, biodiversity, and environmental advocacy.","url":"https://www.savedbytheplate.org/education","provider":{"@id":"https://www.savedbytheplate.org/#organization"},"educationalLevel":"Youth / K-12","teaches":["Food Justice","Food Sovereignty","Community Garden History","Urban Growing Strategies","Urban Biodiversity","Environmental Justice"],"numberOfCredits":0,"hasCourseInstance":{"@type":"CourseInstance","courseMode":"onsite","duration":"P6W","courseWorkload":"PT1H","location":{"@type":"Place","name":"New York City","address":{"@type":"PostalAddress","addressLocality":"New York","addressRegion":"NY","addressCountry":"US"}}}}` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"Course","@id":"https://www.savedbytheplate.org/education#course-soil-science","name":"Composting, Soil Science & Sustainability","description":"Learn about food waste, composting, soil nutrients, and the organisms that make soil alive. A 6-week youth program covering food waste reduction, composting fundamentals, soil health, micro and macro nutrients, and soil ecosystems.","url":"https://www.savedbytheplate.org/education","provider":{"@id":"https://www.savedbytheplate.org/#organization"},"educationalLevel":"Youth / K-12","teaches":["Composting","Soil Science","Food Waste Reduction","Soil Nutrients","Microbiology","Environmental Sustainability"],"numberOfCredits":0,"hasCourseInstance":{"@type":"CourseInstance","courseMode":"onsite","duration":"P6W","courseWorkload":"PT1H","location":{"@type":"Place","name":"New York City","address":{"@type":"PostalAddress","addressLocality":"New York","addressRegion":"NY","addressCountry":"US"}}}}` }} />
      <PhotoLightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={educationGarden1}
            alt="Youth education in community garden"
            className="w-full h-full object-cover opacity-20"
            fetchPriority="high"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">Youth Education Programs</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 px-4">
              Customizable programs for students of all ages exploring food justice, sustainability, 
              community gardens, composting, and environmental science
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Featured Photo - Full Width */}
            <button 
              onClick={() => openLightbox(0)}
              className="mb-12 rounded-2xl overflow-hidden shadow-xl w-full cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={educationGarden1}
                  alt="Youth engaged in garden education"
                  className="w-full h-full object-contain bg-black/10 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-black/40 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-6 w-6 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Hands-On Learning</h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Our programs bring students into real community gardens for immersive educational experiences
                  </p>
                </div>
              </div>
            </button>

            {/* Program Information */}
            <div className="space-y-8">
              {/* Customization Notice */}
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center text-xl text-primary">
                    <Clock className="mr-3 h-6 w-6" />
                    Fully Customizable Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Each of our programs is fully customizable in terms of length and content. Whether your school wants us to come in for 
                    <strong> a single session</strong>, <strong>a 6-week series</strong>, or <strong>a full 12-week semester</strong>, 
                    we can tailor our curriculum to fit your needs. Programs include a guest speaker and an optional garden tour. Contact us to discuss how we can create the perfect program for your students.
                  </p>
                </CardContent>
              </Card>

              {/* Two-Column Photo Feature */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <button 
                  onClick={() => openLightbox(1)}
                  className="rounded-xl overflow-hidden shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={educationGarden2}
                      alt="Students learning about plants"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground text-center font-medium">
                      Students describing what beneficial microfauna and micronutrients are.
                    </p>
                  </div>
                </button>
                <button 
                  onClick={() => openLightbox(2)}
                  className="rounded-xl overflow-hidden shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={educationGarden3}
                      alt="Garden workshop session"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground text-center font-medium">
                      A student providing some examples of microbes that are beneficial to the environment and sustainability.
                    </p>
                  </div>
                </button>
              </div>

              {/* Definition Block — What is Food Justice? */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-3">What Is Food Justice?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Food justice is the belief that all people deserve access to healthy, affordable, culturally
                  appropriate food regardless of income, race, or zip code. In New York City, food deserts
                  disproportionately affect communities of color and low-income families. Our 6-week youth programs
                  connect students with community gardens, composting practices, and local food systems — teaching
                  the history of urban agriculture in NYC, hands-on growing techniques, and the role of food
                  sovereignty in environmental justice.
                </p>
              </div>

              {/* Definition Block — What is Urban Agriculture? */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-3">What Is Urban Agriculture?</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Urban agriculture refers to the practice of growing, processing, and distributing food within
                  cities and surrounding areas. It includes community gardens, rooftop farms, school gardens,
                  composting programs, and urban orchards. In New York City, urban agriculture plays a critical
                  role in improving food security, building community, and educating residents — especially
                  young people — about where their food comes from.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Urban agriculture is also central to food justice work. When communities can grow their own
                  food, they reduce dependence on large grocery chains that often bypass low-income
                  neighborhoods, lower household food costs, and build the skills and knowledge needed to
                  advocate for a more equitable, sustainable food system.
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <BookOpen className="mr-3 h-6 w-6 text-primary" />
                          Educational Impact
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Students develop a deep understanding of waste reduction, soil ecology, and nutrient cycles 
                          while gaining hands-on skills in composting and sustainable land stewardship.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <Users className="mr-3 h-6 w-6 text-primary" />
                          Environmental Stewardship
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Students learn how reducing food waste and building healthy soil directly impacts climate change, 
                          empowering them to make sustainable choices in their daily lives.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Another Photo Feature */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <button 
                  onClick={() => openLightbox(3)}
                  className="rounded-xl overflow-hidden shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={educationGarden4}
                      alt="Students in the garden"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground text-center font-medium">
                      Nando Rodriguez, Senior Manager for Environmental Programming at Brotherhood Sister Sol, and Che, a community gardener in the Bronx, talking to students about the benefits of composting locally.
                    </p>
                  </div>
                </button>
                <button 
                  onClick={() => openLightbox(4)}
                  className="rounded-xl overflow-hidden shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={educationGarden5}
                      alt="Community garden tour"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5">
                    <p className="text-sm text-muted-foreground text-center font-medium">
                      Educating the students on the benefits of vermicomposting - worms that digest our food waste.
                    </p>
                  </div>
                </button>
              </div>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl justify-center">
                    <MapPin className="mr-3 h-6 w-6 text-primary" />
                    Optional Week: Community Garden Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Both programs offer an optional session where students tour the nearest community garden 
                    during the normal session time. This hands-on field trip brings everything learned to life!
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Card className="inline-block border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">
                      Contact us to discuss bringing this program to your school
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
