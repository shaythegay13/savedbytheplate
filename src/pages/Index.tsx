
import { Link } from 'react-router-dom';
import { MapPin, Book, Leaf, Users } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import gardenPlanningImage from "@/assets/garden-planning.jpg";
import educationGardenImage from "@/assets/education-garden-1.jpg";
import TransparentJaneAvatar from "@/components/garden-plan/TransparentJaneAvatar";

const Index = () => {
  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-green-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Urban garden" 
            className="w-full h-full object-cover opacity-20" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Grow Local, Eat Local
            </h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8">
              Connecting communities with sustainable food options<br />
              and local agriculture, starting with our youth.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-green-800 px-2">
            Discover What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Education */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={educationGardenImage} 
                  alt="Youth education program in community garden" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Educational Programming</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Customizable educational programs for youth exploring food justice, 
                  food sovereignty, community gardens, and urban agriculture. Programs 
                  can be tailored to fit your student population and desired length.
                </p>
                <Link 
                  to="/education" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Contact us about our programs
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Ask Jane */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-56 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-3">
                <TransparentJaneAvatar className="h-full" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Ask Jane</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Meet Jane, your AI-powered garden assistant. Get personalized 
                  gardening advice and create custom growing plans for your space.
                </p>
                <Link 
                  to="/local-food/garden-planner" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Chat with Jane
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Local Food Resources */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Local food resources" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Local Food Resources</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Find local food sources and get personalized gardening advice through Jane, your personal gardening assistant.
                </p>
                <Link 
                  to="/local-food/map"
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Explore resources
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
