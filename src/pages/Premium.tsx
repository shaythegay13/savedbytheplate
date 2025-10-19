import { useState, useEffect } from "react";
import { Check, Star, Zap, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Stripe Price IDs
const PRICE_IDS = {
  monthly: "price_1SG1U8ChJRCHBzGFN7GB3S3g",
  annual: "price_1SK2zwChJRCHBzGFiO0cJuYQ",
  educatorMonthly: "price_1SK315ChJRCHBzGFmwp0Fnuj",
  educatorAnnual: "price_1SK31JChJRCHBzGFbWYNijcV",
};


interface PlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: 'monthly' | 'annual' | 'educator';
  onSubscribe: (priceId: string) => void;
  loading: boolean;
}

const PlanModal = ({ open, onOpenChange, planType, onSubscribe, loading }: PlanModalProps) => {
  const [educatorBilling, setEducatorBilling] = useState<'monthly' | 'annual'>('monthly');

  const planDetails = {
    monthly: {
      title: "Monthly Plan",
      price: "$10/month",
      priceId: PRICE_IDS.monthly,
      savings: undefined,
      features: [
        "AI-powered custom garden designs",
        "Access curated educational content",
        "Discord community access",
        "City-wide event calendar",
        "Personalized garden planning tools",
        "Priority support",
        "Cancel anytime"
      ]
    },
    annual: {
      title: "Annual Plan",
      price: "$100/year",
      priceId: PRICE_IDS.annual,
      savings: "Save $20 vs monthly billing",
      features: [
        "AI-powered custom garden designs",
        "Access curated educational content",
        "Discord community access",
        "City-wide event calendar",
        "Personalized garden planning tools",
        "Priority support",
        "2 months free compared to monthly",
        "Cancel anytime"
      ]
    },
    educator: {
      title: "Educator Plan",
      price: educatorBilling === 'monthly' ? "$8/month" : "$85/year",
      priceId: educatorBilling === 'monthly' ? PRICE_IDS.educatorMonthly : PRICE_IDS.educatorAnnual,
      savings: "Special pricing for educators",
      features: [
        "All premium features included",
        "AI-powered custom garden designs",
        "Access curated educational content",
        "Discord community access",
        "City-wide event calendar",
        "Personalized garden planning tools",
        "Priority support",
        "Perfect for classroom use"
      ]
    }
  };

  const currentPlan = planDetails[planType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sbtp-green-800">
            {currentPlan.title}
          </DialogTitle>
          <DialogDescription className="text-sbtp-brown-500">
            {currentPlan.savings && (
              <span className="inline-block bg-sbtp-yellow text-sbtp-brown-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                {currentPlan.savings}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Section */}
          <div className="text-center py-4 bg-sbtp-green-50 rounded-lg">
            <div className="text-4xl font-bold text-sbtp-green-800 mb-2">
              {currentPlan.price}
            </div>
            {planType === 'educator' && (
              <div className="flex gap-2 justify-center mt-3">
                <Button
                  variant={educatorBilling === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEducatorBilling('monthly')}
                  className={educatorBilling === 'monthly' ? 'bg-sbtp-green-600' : ''}
                >
                  Monthly
                </Button>
                <Button
                  variant={educatorBilling === 'annual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEducatorBilling('annual')}
                  className={educatorBilling === 'annual' ? 'bg-sbtp-green-600' : ''}
                >
                  Annual
                </Button>
              </div>
            )}
          </div>

          {/* Features List */}
          <div>
            <h3 className="font-semibold text-sbtp-green-800 mb-3">What's included:</h3>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-sbtp-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sbtp-brown-500">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Button */}
          <Button
            className="w-full bg-sbtp-green-600 hover:bg-sbtp-green-700 text-white py-6 text-lg"
            onClick={() => onSubscribe(currentPlan.priceId)}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Subscribe Now
              </>
            )}
          </Button>

          <p className="text-xs text-center text-sbtp-brown-400">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmailServiceDialog = () => {
  const [open, setOpen] = useState(false);
  const email = 'info@savedbytheplate.org';
  const subject = 'Institutional Pricing Inquiry';
  
  const emailServices = [
    {
      name: 'Gmail',
      url: `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(subject)}`,
      icon: Mail
    },
    {
      name: 'Outlook',
      url: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodeURIComponent(subject)}`,
      icon: Mail
    },
    {
      name: 'Yahoo',
      url: `https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent(subject)}`,
      icon: Mail
    },
    {
      name: 'Default Mail App',
      url: `mailto:${email}?subject=${encodeURIComponent(subject)}`,
      icon: Mail
    }
  ];

  return (
    <>
      <Button 
        variant="outline"
        className="border-sbtp-green-500 text-sbtp-green-700 hover:bg-sbtp-green-500 hover:text-white"
        onClick={() => setOpen(true)}
      >
        Contact Us for Institutional Pricing
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-sbtp-green-800">Choose Your Email Service</DialogTitle>
            <DialogDescription className="text-sbtp-brown-500">
              Please select your preferred email service to contact us
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {emailServices.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-sbtp-green-200 hover:bg-sbtp-green-50 hover:border-sbtp-green-500 transition-colors"
                onClick={() => setOpen(false)}
              >
                <service.icon className="h-5 w-5 text-sbtp-green-600" />
                <span className="font-medium text-sbtp-green-800">{service.name}</span>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PremiumFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white p-6 rounded-lg border border-sbtp-green-200">
      <div className="flex items-start mb-4">
        <div className="bg-sbtp-green-100 p-2 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M7 20h10"></path><path d="M10 20c1.5 0 3.485-2.857 4-6.5"></path><path d="M14 20c-1.5 0-2.5-5.5-2.5-9s1-7 3-8c1 1 2 2 2.5 5s.5 4 .5 7-1 5-3 5Z"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sbtp-green-800 mb-2">Personalized Garden Plans</h3>
          <p className="text-sbtp-brown-500">AI-powered custom garden designs tailored to your space, climate, and goals.</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg border border-sbtp-green-200">
      <div className="flex items-start mb-4">
        <div className="bg-sbtp-green-100 p-2 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sbtp-green-800 mb-2">Curated Educational Content</h3>
          <p className="text-sbtp-brown-500">Access articles, videos, and course recommendations from reputable gardening organizations.</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg border border-sbtp-green-200">
      <div className="flex items-start mb-4">
        <div className="bg-sbtp-green-100 p-2 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sbtp-green-800 mb-2">Discord Community Access</h3>
          <p className="text-sbtp-brown-500">Connect with fellow community gardeners, share experiences, and get support.</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg border border-sbtp-green-200">
      <div className="flex items-start mb-4">
        <div className="bg-sbtp-green-100 p-2 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sbtp-green-800 mb-2">Centralized Event Calendar</h3>
          <p className="text-sbtp-brown-500">Never miss a community garden event with our city-wide calendar featuring workshops, tours, and gatherings.</p>
        </div>
      </div>
    </div>
  </div>
);

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'educator' | null>(null);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setCheckingSubscription(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
      } else {
        setIsSubscribed(data?.subscribed || false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to subscribe");
        setSelectedPlan(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price_id: priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Redirecting to checkout...");
        setSelectedPlan(null);
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to manage subscription");
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error(error.message || "Failed to open customer portal");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-accent text-accent-foreground px-3 sm:px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base">
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                Premium Features
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">Unlock Premium</h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto mb-6 px-4">
              Get personalized garden plans, curated educational content, Discord community access, and city-wide event calendars
            </p>
            <div className="bg-white/10 rounded-lg p-4 sm:p-6 inline-block mx-4">
              <h2 className="text-2xl font-bold mb-2">Multiple Plans Available</h2>
              <p className="text-sbtp-beige mb-4">Standard, Educator, and Institution options</p>
              <Button 
                className="bg-sbtp-yellow hover:bg-sbtp-yellow/80 text-sbtp-brown-700 font-semibold py-6 px-10 text-lg"
                onClick={() => {
                  document.getElementById('comparison-table')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">Premium Features</h2>
              <p className="text-sbtp-brown-500 max-w-2xl mx-auto">
                Enhance your sustainable living journey with our premium tools and resources.
              </p>
            </div>
            
            <PremiumFeatures />

            <div id="comparison-table" className="mt-12 bg-white rounded-lg border border-sbtp-green-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-8 bg-sbtp-green-600 text-white">
                  <div className="h-[88px] flex items-end mb-6">
                    <h3 className="text-2xl font-bold">Feature</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center min-h-[40px]">
                      <span>Local Food Map</span>
                    </li>
                    <li className="flex items-center min-h-[40px]">
                      <span>School Garden Tours</span>
                    </li>
                    <li className="flex items-center min-h-[40px]">
                      <span>Community Forums</span>
                    </li>
                    <li className="flex items-center min-h-[40px]">
                      <span>AI Garden Planner</span>
                    </li>
                    <li className="flex items-center min-h-[40px]">
                      <span>Educational Resources</span>
                    </li>
                    <li className="flex items-center min-h-[40px]">
                      <span>Discord Community</span>
                    </li>
                    <li className="flex items-center min-h-[40px]">
                      <span>Event Calendar</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-8">
                  <div className="h-[88px] mb-6">
                    <h3 className="text-2xl font-bold text-sbtp-green-700 mb-2">Free</h3>
                    <p className="text-sbtp-brown-500">Basic access</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-brown-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-brown-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-brown-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-brown-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-8 border-sbtp-green-500 text-sbtp-green-700">
                    Current Plan
                  </Button>
                </div>

                <div className="p-8 bg-sbtp-green-50 border-l border-sbtp-green-200">
                  <div className="h-[88px] mb-6">
                    <h3 className="text-2xl font-bold text-sbtp-green-700 mb-2">Premium</h3>
                    <p className="text-sbtp-brown-500">Full access</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                  </ul>
                  {!checkingSubscription && (
                    isSubscribed ? (
                      <Button 
                        className="w-full mt-8 bg-sbtp-green-500 hover:bg-sbtp-green-600"
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={loading}
                      >
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button 
                        className="w-full mt-8 bg-sbtp-green-500 hover:bg-sbtp-green-600"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Get Premium"}
                      </Button>
                    )
                  )}
                </div>

                <div className="p-8 bg-sbtp-blue/5 border-l border-sbtp-blue">
                  <div className="h-[88px] mb-6">
                    <h3 className="text-2xl font-bold text-sbtp-blue mb-2">Educator</h3>
                    <p className="text-sbtp-brown-500">Special pricing</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                    <li className="flex items-center justify-center min-h-[40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </li>
                  </ul>
                  <Button 
                    className="w-full mt-8 bg-sbtp-blue hover:bg-sbtp-blue/80 text-white"
                    disabled={loading}
                  >
                    Educator Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-sbtp-green-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">What Our Members Say</h2>
              <p className="text-sbtp-brown-500">Hear from people who have transformed their food choices with our premium features.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-sbtp-green-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold text-sbtp-green-800">Maria L.</h4>
                    <p className="text-sm text-sbtp-brown-500">Urban Gardener</p>
                  </div>
                </div>
                <p className="text-sbtp-brown-700">
                  "The personalized garden plan transformed my small balcony into a thriving food source. I'm now growing enough herbs and greens for my family's needs!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-sbtp-blue w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    J
                  </div>
                  <div>
                    <h4 className="font-semibold text-sbtp-green-800">James K.</h4>
                    <p className="text-sm text-sbtp-brown-500">School Teacher</p>
                  </div>
                </div>
                <p className="text-sbtp-brown-700">
                  "As an educator, the premium content has been invaluable for creating engaging curriculum about sustainable agriculture for my students."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-6">Ready to Go Premium?</h2>
            <p className="text-lg text-sbtp-brown-700 mb-8">
              Join our growing community of sustainable living enthusiasts and get access to all our premium features.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              <Button 
                className="bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white py-6"
                onClick={() => setSelectedPlan('monthly')}
                disabled={loading}
              >
                Monthly - $10
              </Button>
              <Button 
                className="bg-sbtp-yellow hover:bg-sbtp-yellow/80 text-sbtp-brown-700 py-6 relative"
                onClick={() => setSelectedPlan('annual')}
                disabled={loading}
              >
                Annual - $100
                <span className="absolute -top-3 right-0 left-0 mx-auto w-max bg-sbtp-green-500 text-white text-xs px-3 py-0.5 rounded-full">
                  BEST VALUE
                </span>
              </Button>
              <Button 
                className="bg-sbtp-blue hover:bg-sbtp-blue/80 text-white py-6"
                onClick={() => setSelectedPlan('educator')}
                disabled={loading}
              >
                Educator - $8/$85
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-sbtp-green-600 to-sbtp-green-700 text-white rounded-xl p-8 mb-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Institutional Pricing</h3>
              </div>
              <p className="text-sbtp-beige mb-6 text-lg leading-relaxed">
                Interested in setting up a contract for your institution? We offer custom solutions for schools, organizations, and businesses with volume pricing and dedicated support.
              </p>
              <EmailServiceDialog />
            </div>
            
            <p className="text-sm text-sbtp-brown-500">
              7-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Modal */}
      {selectedPlan && (
        <PlanModal
          open={selectedPlan !== null}
          onOpenChange={(open) => !open && setSelectedPlan(null)}
          planType={selectedPlan}
          onSubscribe={handleSubscribe}
          loading={loading}
        />
      )}
        
    </div>
  );
};

export default Premium;
