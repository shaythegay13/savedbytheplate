import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import shayPhoto from "@/assets/shay-bouchles.jpeg";
import hebatallahPhoto from "@/assets/hebatallah-tharhan.jpeg";

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
                      alt="Shay Bouchles, Executive Director & Founder" 
                      className="w-48 h-48 rounded-lg object-cover shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-sbtp-green-600 mb-4">
                      Shay Bouchles, Executive Director & Founder
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

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={hebatallahPhoto} 
                      alt="Hebatallah Tharhan, Full Stack Developer" 
                      className="w-48 h-48 rounded-lg object-cover shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-sbtp-green-600 mb-4">
                      Hebatallah Tharhan, Full Stack Developer
                    </h3>
                    
                    <div className="text-sbtp-brown-500 leading-relaxed space-y-4">
                      <p>
                        Starting as a Web Development Intern and growing into her role as Full Stack Developer at Saved by the Plate Inc., Hebatallah drives the creation of accessible, user-focused technology that powers the organization's educational and community impact.
                      </p>
                      
                      <p>
                        With a strong foundation in full stack development, automated regression testing, quality assurance, and educational technology systems, she ensures that every platform is built for reliability, scalability, and ease of use. Her work spans the full development cycle—from designing interactive learning tools and optimizing performance to integrating analytics that inform data-driven decisions in education technology.
                      </p>
                      
                      <p>
                        Known for her creativity, initiative, and collaborative mindset, Hebatallah blends technical excellence with a deep commitment to equity and accessibility. Passionate about leveraging technology to advance education and social good, she continues to expand the reach of Saved by the Plate's mission through innovation, thoughtful engineering, and community-driven design.
                      </p>
                    </div>
                  </div>
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
