import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import shayPhoto from "@/assets/shay-bouchles.jpeg";
import larsPhoto from "@/assets/lars-heidenreich.jpg";
import khurramPhoto from "@/assets/khurram-kalimi.jpg";
import saraPhoto from "@/assets/sara-bruno.jpg";
import carolAnnePhoto from "@/assets/carolanne-bouchles.jpg";
import kelseyPhoto from "@/assets/kelsey-estevez.jpg";
import shanePhoto from "@/assets/shane-nantais.png";
import charlesPhoto from "@/assets/charles-kirby.jpg";
import ccpLogo from "@/assets/ccp-logo.jpg";
import modularYearLogo from "@/assets/modular-year-logo.svg";
import communitasLogo from "@/assets/communitas-ventures.png";
import fsLogo from "@/assets/fs-logo.png";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sbtp-beige to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-sbtp-green-800 mb-4">About Us</h1>
            <div className="w-24 h-1 bg-sbtp-green-500 mx-auto"></div>
          </div>

          {/* Mission Section */}
          <Card className="mb-8 border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-4 flex items-center">
                <span className="w-10 h-10 flex items-center justify-center bg-sbtp-green-500 text-white rounded-full mr-3 text-lg">
                  M
                </span>
                Our Mission
              </h2>
              <p className="text-sbtp-brown-500 leading-relaxed">
                Empower the next generation to build a resilient food future by connecting children and families to community gardens, sustainable eating education, and food justice initiatives across New York City and beyond. We provide experiential programs and resources that make urban gardening accessible, foster curiosity, and strengthen local communities.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card className="mb-8 border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-4 flex items-center">
                <span className="w-10 h-10 flex items-center justify-center bg-sbtp-green-500 text-white rounded-full mr-3 text-lg">
                  V
                </span>
                Our Values
              </h2>
              <p className="text-sbtp-brown-500 leading-relaxed">
                Create cities where every child and neighborhood has the opportunity to grow fresh food, learn the value of sustainability, and participate in a thriving, equitable local food system. Our vision is to cultivate lifelong advocates for healthy food, green spaces, and justice—reshaping cities with gardens at their hearts.
              </p>
            </CardContent>
          </Card>

          {/* Leadership Section */}
          <Card className="border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-6">Leadership</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={shayPhoto} 
                      alt="Shay Bouchles, Founder, President, and Executive Director" 
                      className="w-48 h-48 rounded-lg object-cover shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-sbtp-green-600 mb-4">
                      Shay Bouchles, Founder, President, and Executive Director
                    </h3>
                    
                    <div className="text-sbtp-brown-500 leading-relaxed space-y-4">
                      <p>
                        As Executive Director and Founder of Saved by the Plate Inc., Shay drives the mission to make food justice education accessible, engaging, and actionable for communities across New York City and beyond. Combining a foundation in academic research with real-world experience in social impact entrepreneurship, Shay leads initiatives that bridge sustainable agriculture, digital innovation, and hands-on learning for students and educators.
                      </p>
                      
                      <p>
                        Shay specializes in launching transformative educational programs, building powerful cross-sector partnerships, and guiding multidisciplinary teams toward impactful, systemic change. From developing youth-focused food justice after school courses and producing community storytelling series, to organizing food policy forums and garden tours, Shay brings a creative and collaborative approach to every project—always centering equity, inclusion, and local empowerment.
                      </p>
                      
                      <p>
                        Recognized for expertise in project management and digital strategy, Shay is dedicated to advancing equitable food systems and nurturing the next generation of changemakers. Enthusiastic about collaboration, she welcomes new connections with educators, advocates, and founders working to elevate social good at the intersection of technology and community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Board of Directors Section */}
          <Card className="mt-8 border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-6">Board of Directors</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Shay Bouchles - President */}
                <div className="text-center">
                  <img 
                    src={shayPhoto} 
                    alt="Shay Bouchles, President" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Shay Bouchles</h3>
                  <p className="text-sm text-sbtp-brown-500">President</p>
                </div>

                {/* Lars Heidenreich - Secretary */}
                <div className="text-center">
                  <img 
                    src={larsPhoto} 
                    alt="Lars Heidenreich, Secretary" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Lars Heidenreich</h3>
                  <p className="text-sm text-sbtp-brown-500">Secretary</p>
                </div>

                {/* Khurram Kalimi */}
                <div className="text-center">
                  <img 
                    src={khurramPhoto} 
                    alt="Khurram Kalimi" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Khurram Kalimi</h3>
                  <p className="text-sm text-sbtp-brown-500">Board Member</p>
                </div>

                {/* Sara Bruno */}
                <div className="text-center">
                  <img 
                    src={saraPhoto} 
                    alt="Sara Bruno" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Sara Bruno</h3>
                  <p className="text-sm text-sbtp-brown-500">Board Member</p>
                </div>

                {/* CarolAnne Bouchles - Treasurer */}
                <div className="text-center">
                  <img 
                    src={carolAnnePhoto} 
                    alt="CarolAnne Bouchles, Treasurer" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">CarolAnne Bouchles</h3>
                  <p className="text-sm text-sbtp-brown-500">Treasurer</p>
                </div>

                {/* Kelsey Estevez */}
                <div className="text-center">
                  <img 
                    src={kelseyPhoto} 
                    alt="Kelsey Estevez" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Kelsey Estevez</h3>
                  <p className="text-sm text-sbtp-brown-500">Board Member</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founding Advisors Section */}
          <Card className="mt-8 border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-6">Founding Advisors</h2>
              
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                {/* Shane Nantais */}
                <div className="text-center">
                  <img 
                    src={shanePhoto} 
                    alt="Shane Nantais, Founding Advisor" 
                    className="w-32 h-32 rounded-lg object-cover object-top shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Shane Nantais</h3>
                  <p className="text-sm text-sbtp-brown-500">Founding Advisor</p>
                </div>

                {/* Charles Kirby */}
                <div className="text-center">
                  <img 
                    src={charlesPhoto} 
                    alt="Charles Kirby, Founding Advisor" 
                    className="w-32 h-32 rounded-lg object-cover shadow-md mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-sbtp-green-600">Charles Kirby</h3>
                  <p className="text-sm text-sbtp-brown-500">Founding Advisor</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-8 border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-6 text-center">In Partnership With</h2>
              
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                <img 
                  src={ccpLogo} 
                  alt="Calm Collected Professionals" 
                  className="h-24 w-auto object-contain"
                />
                <img 
                  src={modularYearLogo} 
                  alt="Modular Year 2025" 
                  className="h-24 w-auto object-contain"
                />
                <img 
                  src={fsLogo} 
                  alt="FS" 
                  className="h-24 w-auto object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="mt-8 border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-6 text-center">With Support From</h2>
              
              <div className="flex items-center justify-center">
                <img 
                  src={communitasLogo} 
                  alt="Communitas Ventures" 
                  className="h-24 w-auto object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
