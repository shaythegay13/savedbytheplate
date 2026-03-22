
import { Link } from 'react-router-dom';
import { MapPin, Book, Leaf, Users, Sprout, Globe, GraduationCap, Mic, Award, Monitor } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import StudentStories from "@/components/home/StudentStories";
import ClassroomModeSection from "@/components/home/ClassroomModeSection";
import gardenPlanningImage from "@/assets/garden-planning.jpg";
import educationGardenImage from "@/assets/education-garden-1.jpg";
import localFoodResourcesImage from "@/assets/local-food-resources.jpeg";
import TransparentJaneAvatar from "@/components/garden-plan/TransparentJaneAvatar";

const Index = () => {
  return (
    <div className="w-full">
      <title>Saved by the Plate Inc. — Food Justice Education for Schools</title>
      <meta name="description" content="Hands-on food justice education programs for K-12 schools in New York City. Customizable curricula, AI-powered garden assistant, and interactive local food maps for educators." />
      <link rel="canonical" href="https://www.savedbytheplate.org/" />
      <meta property="og:title" content="Saved by the Plate Inc. — Food Justice Education for Schools" />
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
            <p className="text-green-300 font-semibold text-sm sm:text-base uppercase tracking-wide mb-3">
              For Educators & Schools
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Bring Food Justice<br />Into Your Classroom
            </h1>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-green-100">
              Customizable hands-on programs that connect your students<br className="hidden sm:block" />
              with community gardens, composting, and urban agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:info@savedbytheplate.org?subject=Education Program Inquiry"
                className="inline-flex items-center justify-center bg-sbtp-green-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-sbtp-green-400 transition-colors shadow-lg text-lg"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Book a Program for Your School
              </a>
              <Link
                to="/education"
                className="inline-flex items-center justify-center bg-white/15 backdrop-blur text-white font-semibold px-8 py-4 rounded-full hover:bg-white/25 transition-colors border border-white/30 text-lg"
              >
                <Book className="w-5 h-5 mr-2" />
                View Our Curriculum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Educators Choose Us */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-green-800">
            Why Educators Choose Us
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Everything your school needs to teach food justice — from ready-made curricula to AI-powered tools your students will love.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-7 w-7 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Curriculum-Ready Programs</h3>
              <p className="text-muted-foreground text-sm">
                6-week programs aligned to NGSS and social studies standards. Customizable for any grade level, from a single session to a full semester.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-7 w-7 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">AI Garden Assistant for Students</h3>
              <p className="text-muted-foreground text-sm">
                "Ask Jane" is a voice-first AI assistant designed for hands-in-the-dirt learning — students ask questions while they garden, no screens needed.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Interactive Local Food Map</h3>
              <p className="text-muted-foreground text-sm">
                Plan field trips with our map of 500+ community gardens, farmers markets, food banks, and community fridges across all five boroughs.
              </p>
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
            Your students are growing up in a city where food access is deeply unequal.
            Education is how we change that.
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
              <p className="text-green-200 text-sm">GreenThumb supports over 500 community gardens — many available for school visits and partnerships.</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-green-300 mb-2">6 Weeks</p>
              <p className="text-lg font-semibold mb-1">To Transform a Young Gardener</p>
              <p className="text-green-200 text-sm">Our programs give students real-world skills in food justice, composting, and urban farming.</p>
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
            For educators, food justice is a powerful lens for teaching across disciplines — science, social studies,
            math, and civic engagement. When students learn where their food comes from, they develop critical
            thinking skills and a deeper understanding of the communities they live in.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            At Saved by the Plate Inc., food justice is our foundation. Every program we deliver — from our 6-week
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

      {/* Classroom Mode Section */}
      <ClassroomModeSection />

      {/* Tools for Your Classroom */}
      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-green-800 px-2">
            Tools for Your Classroom
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
            Free digital resources that complement our in-person programs — or stand on their own.
          </p>
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
                  <h3 className="text-xl font-semibold">Local Food Map</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Plan field trips and classroom projects with our interactive map of community gardens, 
                  farmers markets, food banks, and community fridges near your school.
                </p>
                <Link 
                  to="/local-food/map"
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Explore the map
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
                  <h3 className="text-xl font-semibold">Ask Jane — AI Garden Assistant</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  A voice-first AI assistant your students can talk to while gardening.
                  Jane answers questions about planting, soil, pests, and more — hands-free.
                </p>
                <Link 
                  to="/local-food/garden-planner" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  Try Jane with your class
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
                  <h3 className="text-xl font-semibold">Full Curriculum</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Browse our complete 6-week curricula on food justice, composting, and soil science.
                  Customizable for any grade level or program length.
                </p>
                <Link 
                  to="/education" 
                  className="text-green-700 font-medium hover:text-green-800 flex items-center"
                >
                  View programs
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
            Ready to Bring This to Your School?
          </h2>
          <p className="text-lg sm:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you need a single workshop or a full-semester program,
            we'll customize our curriculum to fit your students, schedule, and goals.
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
