
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";


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
    <div className="min-h-screen bg-sbtp-beige">
      {/* Hero Section */}
      <section className="bg-sbtp-green-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
            <p className="text-xl">
              Shop for seed kits, gardening supplies, CSA subscriptions, and premium educational content.
            </p>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="seeds" className="w-full">
            <div className="text-center mb-8">
              <TabsList className="bg-sbtp-green-100 inline-flex h-auto p-1">
                <TabsTrigger value="seeds" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                  Seed Kits
                </TabsTrigger>
                <TabsTrigger value="supplies" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                  Gardening Supplies
                </TabsTrigger>
                <TabsTrigger value="csa" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                  CSA Subscriptions
                </TabsTrigger>
                <TabsTrigger value="courses" className="px-4 py-2 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
                  Premium Courses
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="seeds" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {seedKits.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="supplies" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {supplies.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="csa" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {csaOptions.map((product) => (
                  <ProductCard key={product.id} product={product} buttonText="Subscribe" />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="pt-4">
              <div className="bg-sbtp-yellow/30 rounded-lg p-6 mb-8">
                <h3 className="font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-sbtp-brown-700"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                  Premium Content
                </h3>
                <p className="text-sbtp-brown-700 mt-2">
                  These advanced courses are available exclusively to our premium subscribers or for individual purchase. 
                  <Button variant="link" className="text-sbtp-green-700 font-medium px-1 py-0 h-auto">
                    Upgrade to premium
                  </Button>
                  for $10/month or $100/year to access all courses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {premiumCourses.map((product) => (
                  <ProductCard key={product.id} product={product} buttonText="Purchase Course" isPremium={true} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Cart Summary */}
      <section className="py-10 bg-sbtp-green-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 border border-sbtp-green-200">
            <h2 className="text-2xl font-bold text-sbtp-green-800 mb-4">Shopping Cart</h2>
            <p className="text-sbtp-brown-500 mb-6">
              Your cart is currently empty. Browse our products and add items to your cart.
            </p>
            <div className="flex justify-between items-center">
              <Button variant="outline" className="border-sbtp-green-500 text-sbtp-green-700">
                Continue Shopping
              </Button>
              <Button disabled className="bg-sbtp-green-500 hover:bg-sbtp-green-600">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Marketplace;
