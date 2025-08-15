
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, ShoppingCart, Package, Sprout, Wrench, HelpCircle, Truck, Leaf } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

// Individual Seeds
const seeds = [
  {
    id: 4,
    name: "Heirloom Tomato Seeds (5 varieties)",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    description: "Premium heirloom tomato varieties perfect for container growing.",
    tags: ["Heirloom", "Tomatoes"]
  }
];

// Tools
const tools = [
  {
    id: 6,
    name: "Bamboo Garden Tools Set",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    description: "Eco-friendly garden tool set made from sustainable bamboo.",
    tags: ["Tools", "Sustainable"]
  }
];

// Produce
const produce = [
  {
    id: 8,
    name: "Fresh Herb Bundle",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    description: "Weekly fresh herb delivery from local NYC urban farms.",
    tags: ["Fresh", "Local", "Weekly"]
  }
];

// CSA Programs
const csaPrograms = [
  {
    id: 10,
    name: "Brooklyn Grange CSA",
    price: 25,
    recurrence: "weekly",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    description: "Weekly box of seasonal vegetables from NYC's largest rooftop farm.",
    location: "Brooklyn/Queens"
  }
];

// Featured Collections
const featuredCollections = [
  {
    name: "Balcony Garden Collection",
    description: "Everything you need for a productive balcony garden",
    items: 8,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    price: "From $49.99"
  },
  {
    name: "Seasonal Seed Collection",
    description: "Curated seeds for each growing season in NYC",
    items: 12,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    price: "From $34.99"
  },
  {
    name: "Indoor Herb Garden",
    description: "Complete setup for year-round indoor herbs",
    items: 6,
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    price: "From $39.99"
  }
];

// FAQ Data
const faqData = [
  {
    question: "How do I know which seeds are right for my space?",
    answer: "Our seed descriptions include space requirements and growing conditions. For personalized recommendations, use our Garden Planner tool or join our Discord community for advice."
  },
  {
    question: "Do you offer delivery throughout NYC?",
    answer: "Yes! We deliver to all five boroughs. Fresh produce and live plants typically arrive within 24-48 hours, while seeds and tools ship within 3-5 business days."
  }
];


// Sample products data
const seedKits = [
  {
    id: 1,
    name: "Urban Garden Starter Kit",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    description: "Everything you need to start your own balcony or window garden, including 6 varieties of vegetable seeds.",
    tags: ["Beginner", "Urban"]
  },
  {
    id: 2,
    name: "Seasonal Vegetable Mix",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    description: "A curated selection of seasonal vegetable seeds suited for your climate zone.",
    tags: ["Seasonal", "Vegetables"]
  },
  {
    id: 3,
    name: "Herb Garden Collection",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    description: "Grow your own culinary herbs with this complete kit including basil, cilantro, mint, and more.",
    tags: ["Herbs", "Kitchen Garden"]
  }
];

const supplies = [
  {
    id: 4,
    name: "Sustainable Soil Mix",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    description: "Organic, sustainably sourced soil optimized for vegetable and herb growing.",
    tags: ["Organic", "Soil"]
  },
  {
    id: 5,
    name: "Bamboo Garden Tools Set",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    description: "Eco-friendly garden tool set made from sustainable bamboo and recycled materials.",
    tags: ["Tools", "Sustainable"]
  },
  {
    id: 6,
    name: "Compost Bin System",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    description: "Turn kitchen scraps into garden gold with this easy-to-use composting system.",
    tags: ["Compost", "Zero Waste"]
  }
];

const csaOptions = [
  {
    id: 7,
    name: "Green Valley Family Farm",
    price: 25,
    recurrence: "weekly",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    description: "Weekly box of seasonal vegetables from a local family farm. Choose small, medium, or large box options.",
    location: "Northeast"
  },
  {
    id: 8,
    name: "Sunrise Urban Farm",
    price: 30,
    recurrence: "biweekly",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
    description: "Bi-weekly delivery of urban-grown produce with focus on unique varieties and specialty crops.",
    location: "Central"
  },
  {
    id: 9,
    name: "Mountain View Orchards",
    price: 35,
    recurrence: "monthly",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    description: "Monthly fruit and value-added products like jams and preserves from sustainable orchards.",
    location: "Northwest"
  }
];

const premiumCourses = [
  {
    id: 10,
    name: "Master Gardener Certification",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    description: "Comprehensive course to become a certified master gardener with focus on sustainable practices.",
    duration: "12 weeks"
  },
  {
    id: 11,
    name: "Advanced Permaculture Design",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    description: "Learn advanced permaculture techniques to create self-sustaining garden ecosystems.",
    duration: "8 weeks"
  },
  {
    id: 12,
    name: "Organic Pest Management",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    description: "Natural and organic approaches to managing pests and diseases in your garden.",
    duration: "4 weeks"
  }
];

const ProductCard = ({ product, buttonText = "Add to Cart", isPremium = false }) => {
  return (
    <Card className="border-sbtp-green-200 overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        {isPremium && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-sbtp-yellow text-sbtp-brown-700 hover:bg-sbtp-yellow">Premium</Badge>
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-sbtp-green-700">{product.name}</CardTitle>
        </div>
        <CardDescription className="flex justify-between items-center">
          <span className="font-semibold text-sbtp-green-600">${product.price.toFixed(2)}</span>
          {product.recurrence && <span className="text-xs">{product.recurrence}</span>}
          {product.duration && <span className="text-xs">{product.duration}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-sbtp-brown-500">{product.description}</p>
        {product.tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs bg-sbtp-green-100 text-sbtp-green-700 px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        {product.location && (
          <div className="mt-3">
            <span className="text-xs bg-sbtp-blue/20 text-sbtp-blue px-2 py-1 rounded-md flex items-center w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {product.location}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Urban Garden Marketplace</h1>
            <p className="text-xl opacity-90 mb-8">
              Shop for seeds, supplies, tools, fresh produce, and CSA programs from local NYC urban farmers and gardeners.
            </p>
            <Button variant="secondary" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-sbtp-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-8">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredCollections.map((collection, index) => (
                <Card key={index} className="border-sbtp-green-200 hover:shadow-lg transition-all group overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sbtp-green-700">{collection.name}</CardTitle>
                    <CardDescription className="text-sbtp-brown-500">
                      {collection.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-sbtp-brown-600">{collection.items} items included</span>
                      <span className="font-semibold text-sbtp-green-700">{collection.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
                      <Package className="h-4 w-4 mr-2" />
                      View Collection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="seed-kits" className="w-full">
              <div className="text-center mb-8">
                <TabsList className="bg-sbtp-green-100 inline-flex h-auto p-1 flex-wrap">
                  <TabsTrigger value="seed-kits" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                    <Package className="h-4 w-4 mr-2" />
                    Seed Kits
                  </TabsTrigger>
                  <TabsTrigger value="seeds" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                    <Sprout className="h-4 w-4 mr-2" />
                    Seeds
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                    <Wrench className="h-4 w-4 mr-2" />
                    Tools
                  </TabsTrigger>
                  <TabsTrigger value="produce" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                    <Leaf className="h-4 w-4 mr-2" />
                    Produce
                  </TabsTrigger>
                  <TabsTrigger value="csa" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                    <Truck className="h-4 w-4 mr-2" />
                    CSA Programs
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="seed-kits" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {seedKits.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="seeds" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {seeds.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="tools" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tools.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="produce" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {produce.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="csa" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {csaPrograms.map((product) => (
                    <ProductCard key={product.id} product={product} buttonText="Subscribe" />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-sbtp-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <Card key={index} className="border-sbtp-green-200">
                  <CardHeader>
                    <CardTitle className="text-sbtp-green-700 flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 mt-1 text-sbtp-green-500" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sbtp-brown-600 ml-8">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Marketplace;
