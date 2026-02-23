import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Leaf, Users, Mail, CheckCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const WaitingList = () => {
  const [email, setEmail] = useState("");
  const [heroEmail, setHeroEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHeroSubmitted, setIsHeroSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeroLoading, setIsHeroLoading] = useState(false);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitEmailToNewsletter = async (emailAddress: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-to-beehiiv', {
        body: { email: emailAddress }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Network error. Please check your connection and try again.");
      }

      if (!data) {
        throw new Error("No response received. Please try again.");
      }

      if (!data.success) {
        throw new Error(data.error || "Subscription failed. Please try again.");
      }

      return data;
    } catch (error: any) {
      console.error("Network or parsing error:", error);
      if (error.message) {
        throw error;
      }
      throw new Error("Unable to connect. Please check your internet connection and try again.");
    }
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
      const result = await submitEmailToNewsletter(email);
      console.log("Email submitted successfully:", email);
      setIsSubmitted(true);
      toast({
        title: "Welcome to our newsletter!",
        description: result.message || "You've been added to our waiting list and will receive our newsletter updates.",
      });
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Submission failed",
        description: "There was an error adding you to our newsletter. Please try again.",
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
      const result = await submitEmailToNewsletter(heroEmail);
      console.log("Hero email submitted successfully:", heroEmail);
      setIsHeroSubmitted(true);
      toast({
        title: "Welcome to our newsletter!",
        description: result.message || "You've been added to our waiting list and will receive our newsletter updates.",
      });
    } catch (error) {
      console.error("Error submitting hero email:", error);
      toast({
        title: "Submission failed",
        description: "There was an error adding you to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsHeroLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sbtp-green-200 to-sbtp-beige pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.webp"
                alt="Saved by the Plate Logo"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain rounded-full bg-white p-3 sm:p-4 shadow-lg"
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-sbtp-green-800 mb-4 sm:mb-6 px-2">
              Saved by the <span className="text-sbtp-blue">Plate</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-sbtp-brown-700 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Get ready to inspire young minds and grow greener communities! We're bringing hands-on garden adventures and urban food education to kids, families, and schools—sign up to join the movement and be first to experience what's growing near you.
            </p>
            
            <div className="mb-6 sm:mb-8 px-4">
              <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
              <iframe 
                src="https://subscribe-forms.beehiiv.com/0fb10fdb-b28c-46d7-9de8-3df22c81bd72" 
                className="beehiiv-embed" 
                data-test-id="beehiiv-embed" 
                frameBorder="0" 
                scrolling="no" 
                style={{
                  width: '100%', 
                  height: '415px', 
                  margin: 0, 
                  borderRadius: '0px 0px 0px 0px', 
                  backgroundColor: 'transparent', 
                  boxShadow: '0 0 #0000', 
                  maxWidth: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sbtp-green-800 text-center mb-8 sm:mb-12 px-2">
              What We're Building
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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

      {/* Community Form Section */}
      <section className="py-12 bg-sbtp-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <a 
              href="https://forms.gle/iNS2s9rTZpHAsFji7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white px-16 py-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center font-semibold text-2xl"
            >
              Tell Us About Your Local Food Spaces!
            </a>
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
              Empower the next generation to build a resilient food future by connecting children and families to community gardens, sustainable eating education, and food justice initiatives across New York City and beyond. We provide experiential programs and resources that make urban gardening accessible, foster curiosity, and strengthen local communities.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-sbtp-green-500 mt-8">
              <h3 className="text-xl font-bold text-sbtp-green-800 mb-4">Our Vision</h3>
              <p className="text-sbtp-green-700 font-semibold italic">
                Create cities where every child and neighborhood has the opportunity to grow fresh food, learn the value of sustainability, and participate in a thriving, equitable local food system. Our vision is to cultivate lifelong advocates for healthy food, green spaces, and justice—reshaping cities with gardens at their hearts.
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
            
            <div className="max-w-md mx-auto">
              <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
              <iframe 
                src="https://subscribe-forms.beehiiv.com/0fb10fdb-b28c-46d7-9de8-3df22c81bd72" 
                className="beehiiv-embed" 
                data-test-id="beehiiv-embed" 
                frameBorder="0" 
                scrolling="no" 
                style={{
                  width: '100%', 
                  height: '415px', 
                  margin: 0, 
                  borderRadius: '0px 0px 0px 0px', 
                  backgroundColor: 'transparent', 
                  boxShadow: '0 0 #0000', 
                  maxWidth: '100%'
                }}
              />
            </div>
            
            <p className="text-sm text-sbtp-beige mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WaitingList;
