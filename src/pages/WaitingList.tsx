import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Users, MapPin, Sparkles } from "lucide-react";

const WaitingList = () => {
  const [email, setEmail] = useState("");
  const [heroEmail, setHeroEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHeroSubmitted, setIsHeroSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeroLoading, setIsHeroLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitEmailToMakeWebhook = async (emailAddress: string) => {
    const response = await fetch("https://hook.us2.make.com/kqoibhs6z1tdkrm13bmjocbal9ft4h7n", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailAddress }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to join the waiting list.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await submitEmailToMakeWebhook(email);
      console.log("Email submitted successfully:", email);
      setIsSubmitted(true);
      toast({
        title: "Welcome to the waiting list!",
        description: "You'll be the first to know when we launch.",
      });
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!heroEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address to join the waiting list.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(heroEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsHeroLoading(true);
    
    try {
      await submitEmailToMakeWebhook(heroEmail);
      console.log("Hero email submitted successfully:", heroEmail);
      setIsHeroSubmitted(true);
      toast({
        title: "Welcome to the waiting list!",
        description: "You'll be the first to know when we launch.",
      });
    } catch (error) {
      console.error("Error submitting hero email:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsHeroLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sbtp-green-100 to-sbtp-beige">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sbtp-green-200 to-sbtp-beige pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.png" 
                alt="Saved by the Plate Logo" 
                className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-full bg-white p-4 shadow-lg"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-sbtp-green-800 mb-6">
              Saved by the <span className="text-sbtp-blue">Plate</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-sbtp-brown-700 mb-8 max-w-3xl mx-auto">
              Connect with local food sources and sustainable agriculture. 
              We're building something amazing to empower your food choices.
            </p>
            
            {!isHeroSubmitted ? (
              <div className="bg-sbtp-yellow px-6 py-6 rounded-lg text-sbtp-brown-700 inline-block mb-8 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl mr-2">🚀</span>
                  <span className="text-lg font-semibold">Coming Soon - Join the Waiting List!</span>
                </div>
                <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    className="flex-1 bg-white text-gray-900 border-0"
                    required
                    disabled={isHeroLoading}
                  />
                  <Button 
                    type="submit" 
                    className="bg-sbtp-green-600 text-white hover:bg-sbtp-green-700 font-semibold px-6"
                    disabled={isHeroLoading}
                  >
                    {isHeroLoading ? "Joining..." : "Join Now"}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-sbtp-green-600 text-white px-6 py-6 rounded-lg inline-block mb-8 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">🎉</span>
                  <span className="text-lg font-semibold">You're on the list!</span>
                </div>
                <p className="text-sbtp-beige">
                  Thank you for joining! We'll keep you updated on our progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We're Building Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-sbtp-green-800 text-center mb-12">
              What We're Building
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-sbtp-green-300 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-12 w-12 text-sbtp-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sbtp-green-700 mb-3">
                    Local Food Map
                  </h3>
                  <p className="text-sbtp-brown-500">
                    Discover farmers markets, community gardens, and local food sources right in your neighborhood.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-sbtp-green-300 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <Leaf className="h-12 w-12 text-sbtp-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sbtp-green-700 mb-3">
                    Garden Planning
                  </h3>
                  <p className="text-sbtp-brown-500">
                    Get personalized garden plans and learn sustainable growing practices for your space and climate.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-sbtp-green-300 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-sbtp-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sbtp-green-700 mb-3">
                    Community Hub
                  </h3>
                  <p className="text-sbtp-brown-500">
                    Connect with local growers, share knowledge, and build a sustainable food community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-sbtp-beige">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-sbtp-green-800 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-sbtp-brown-700 mb-8 leading-relaxed">
              We're empowering individuals to make informed food choices by connecting them to local food sources 
              and sustainable agriculture education. Our goal is to shift consumer patterns towards local options 
              like farmers' markets and home growing.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-sbtp-green-500">
              <p className="text-sbtp-green-700 font-semibold italic">
                "A future where every community has access to fresh, locally grown food and the knowledge to sustain it."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waiting List Signup */}
      <section className="py-20 bg-sbtp-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-sbtp-yellow" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Be the First to Know
            </h2>
            <p className="text-xl mb-8 text-sbtp-beige">
              Join our waiting list and get exclusive early access when we launch. 
              Plus, receive updates on local food initiatives in your area.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-gray-900 border-0"
                  required
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-sbtp-yellow text-sbtp-green-800 hover:bg-sbtp-yellow/90 font-semibold px-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Joining..." : "Join Waiting List"}
                </Button>
              </form>
            ) : (
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-2">🎉 You're on the list!</h3>
                <p className="text-sbtp-beige">
                  Thank you for joining! We'll keep you updated on our progress and let you know as soon as we launch.
                </p>
              </div>
            )}
            
            <p className="text-sm text-sbtp-beige mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sbtp-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.png" 
              alt="Saved by the Plate" 
              className="h-8 w-8 object-contain mr-2"
            />
            <span className="text-lg font-semibold">Saved by the Plate</span>
          </div>
          <p className="text-sbtp-beige">
            Empowering communities through local food connections
          </p>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0 text-xs text-gray-400">
              <p>All contents {currentYear} © All rights reserved</p>
          </div>
      </footer>
    </div>
  );
};

export default WaitingList;
