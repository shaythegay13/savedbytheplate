
import { Link } from 'react-router-dom';
import { MapPin, Book, Leaf, Users, Sprout, Globe, GraduationCap } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import StudentStories from "@/components/home/StudentStories";
import gardenPlanningImage from "@/assets/garden-planning.jpg";
import educationGardenImage from "@/assets/education-garden-1.jpg";
import localFoodResourcesImage from "@/assets/local-food-resources.jpeg";
import TransparentJaneAvatar from "@/components/garden-plan/TransparentJaneAvatar";

const Index = () => {
  return (
    <div className="w-full">
      <title>Saved by the Plate Inc. — Grow Local, Eat Local</title>
      <meta name="description" content="Connecting communities with sustainable food options and local agriculture education, starting with youth in New York City." />
      <link rel="canonical" href="https://www.savedbytheplate.org/" />
      <meta property="og:title" content="Saved by the Plate Inc. — Grow Local, Eat Local" />
      <meta property="og:url" content="https://www.savedbytheplate.org/" />
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-green-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Urban garden"
            className="w-full h-full object-cover opacity-20"
            fetchPriority="high"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Grow Local, Eat Local
            </h1>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-green-100">
              Connecting communities with sustainable food options<br />
              and local agriculture, starting with our youth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/local-food/map"
                className="inline-flex items-center justify-center bg-sbtp-green-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-sbtp-green-400 transition-colors shadow-lg text-lg"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Food Near You
              </Link>
              <Link
                to="/local-food/garden-planner"
                className="inline-flex items-center justify-center bg-white/15 backdrop-blur text-white font-semibold px-8 py-4 rounded-full hover:bg-white/25 transition-colors border border-white/30 text-lg"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Ask Jane — AI Garden Planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <StudentStories />

      {/* Impact Statistics Section */}
      <section className="py-12 sm:py-16 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white">
            The Food Justice Crisis in New York City
          </h2>
          <p className="text-center text-green-100 mb-10 max-w-2xl mx-auto">
            Food insecurity and unequal access to fresh food affect millions of New Yorkers.
            Education and community action are the path forward.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-green-300 mb-2">1 in 4</p>
              <p className="text-lg font-semibold mb-1">NYC Children Face Food Insecurity</p>
              <p className="text-green-200 text-sm">Approximately 1.3 million New Yorkers lack consistent access to nutritious food.</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-green-300 mb-2">500+</p>
              <p className="text-lg font-semibold mb-1">Community Gardens in NYC</p>
              <p className="text-green-200 text-sm">New York City's GreenThumb program supports over 500 community gardens across all five boroughs.</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-green-300 mb-2">6 Weeks</p>
              <p className="text-lg font-semibold mb-1">To Transform a Young Gardener</p>
              <p className="text-green-200 text-sm">Our hands-on education programs give students real-world skills in food justice, composting, and urban farming.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Food Justice — Definition Block */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">What Is Food Justice?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Food justice is the belief that all people — regardless of income, race, or zip code — have the right to
            grow, sell, and eat healthy, affordable food that reflects their cultural traditions. It is both a social
            movement and a framework for addressing the systemic inequities that create "food deserts" and limit
            access to fresh, nutritious food in low-income communities.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            In New York City, food justice work includes supporting community gardens, advocating for equitable
            grocery store placement, funding food banks and community fridges, and — critically — educating the
            next generation about where their food comes from and why the current food system produces such
            unequal outcomes.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            At Saved by the Plate Inc., food justice is our foundation. Every program we run — from our 6-week
            community garden curriculum to our composting and soil science workshops — is designed to equip
            young people in New York City with the knowledge and skills to become lifelong advocates for an
            equitable, sustainable food system.
          </p>
          <Link
            to="/education"
            className="inline-flex items-center text-green-700 font-semibold hover:text-green-800"
          >
            Explore our education programs
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Feature Sections - Discover What We Offer */}
      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-green-800 px-2">
            Discover What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Local Food Resources */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={localFoodResourcesImage}
                  alt="Community garden with labeled vegetable beds"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">Local Food Resources</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Discover community gardens, farmers markets, food banks, and community fridges near you with our interactive map.
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

            {/* Education */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={educationGardenImage}
                  alt="Youth education program in community garden"
                  className="w-full h-full object-cover"
                  loading="lazy"
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
          </div>
        </div>
      </section>

      {/* Schools & Organizations CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-green-200" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bring Food Justice Education to Your School
          </h2>
          <p className="text-lg sm:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Our customizable 6-week programs connect students with community gardens,
            composting practices, and urban agriculture—teaching hands-on skills and the
            principles of food sovereignty and environmental justice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:info@savedbytheplate.org?subject=Education Program Inquiry"
              className="inline-flex items-center bg-white text-green-800 font-semibold px-10 py-4 rounded-full hover:bg-green-50 transition-colors shadow-lg text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Contact Us for Your School
            </a>
            <Link
              to="/education"
              className="inline-flex items-center text-white font-semibold hover:text-green-200 transition-colors"
            >
              Learn more about our programs
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
