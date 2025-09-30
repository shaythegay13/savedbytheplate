import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";

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
                Saved by the Plate empowers individuals to make informed food choices by connecting them to local food sources and sustainable agriculture education with the long-term goal of shifting consumer food acquisition patterns towards local options like farmers markets and growing food themselves.
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
                A future where every community has access to fresh, locally grown food and the knowledge to sustain it.
              </p>
            </CardContent>
          </Card>

          {/* Leadership Section */}
          <Card className="border-sbtp-green-300 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold text-sbtp-green-700 mb-6">Leadership</h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-sbtp-green-600">
                  Shay Bouchles, Executive Director & Founder
                </h3>
                
                <div className="text-sbtp-brown-500 leading-relaxed space-y-4">
                  <p>
                    As Executive Director and Founder of Saved by the Plate Inc., Shay drives the mission to make food justice education accessible, engaging, and actionable for communities across New York City and beyond. Combining a foundation in academic research with real-world experience in social impact entrepreneurship, Shay leads initiatives that bridge sustainable agriculture, digital innovation, and hands-on learning for students and educators.
                  </p>
                  
                  <p>
                    Shay specializes in launching transformative educational programs, building powerful cross-sector partnerships, and guiding multidisciplinary teams toward impactful, systemic change. From developing youth-focused online courses and producing community storytelling series, to organizing food policy forums and garden tours, Shay brings a creative and collaborative approach to every project—always centering equity, inclusion, and local empowerment.
                  </p>
                  
                  <p>
                    Recognized for expertise in project management, grant writing, and digital strategy, Shay is dedicated to advancing equitable food systems and nurturing the next generation of changemakers. Enthusiastic about collaboration, she welcomes new connections with educators, advocates, and founders working to elevate social good at the intersection of technology and community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
