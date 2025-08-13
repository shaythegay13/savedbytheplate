
import { Link } from 'react-router-dom';
import { MapPin, Book, ShoppingBag, Leaf, Users } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-green-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Urban garden in NYC" 
            className="w-full h-full object-cover opacity-20" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Local, Eat Local in NYC
            </h1>
            <p className="text-xl mb-8">
              Connecting New Yorkers with sustainable food options across the
              five boroughs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/map" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Find Local Food
              </Link>
              <Link 
                to="/garden-plan" 
                className="bg-white hover:bg-green-100 text-green-800 px-6 py-3 rounded-lg font-medium"
              >
                Plan Your Garden
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
            Discover What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Local Food Finder */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Local farmers market" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Local Food Finder</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Discover farmers markets, CSAs, and urban farms across all
                  five boroughs of NYC.
                </p>
                <Link 
                  to="/map" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Explore local options
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80" 
                  alt="Learning to garden" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Learn to Grow</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Educational resources to help you grow food sustainably, even
                  in small urban spaces.
                </p>
                <Link 
                  to="/education" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Start learning
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Marketplace */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1526346698789-22fd84314424?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Seeds and gardening tools" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Marketplace</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Shop for seeds, tools, and locally grown produce to support
                  urban farmers.
                </p>
                <Link 
                  to="/marketplace" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Shop now
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Garden Planner */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1598901865264-4f19dfa8ceaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Garden planning" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Garden Planner</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Get a customized garden plan based on your location, space,
                  and preferences.
                </p>
                <Link 
                  to="/garden-plan" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Plan your garden
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Community */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556484687-30636164638b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Community gardening" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Community</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect with fellow urban gardeners through Discord channels
                  and local events.
                </p>
                <Link 
                  to="/community" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Join the community
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to grow your own food?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Start your urban gardening journey today with our AI-powered garden
            planner.
          </p>
          <Link 
            to="/garden-plan" 
            className="bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-lg font-medium text-lg"
          >
            Create Your Garden Plan
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
