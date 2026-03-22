import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PREMIUM_PRICE_ID = "price_1SG1U8ChJRCHBzGFN7GB3S3g";

const PricingSection = () => {
  const [loading, setLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setShowLoginDialog(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price_id: PREMIUM_PRICE_ID },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-16 bg-sbtp-green-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">Premium Subscription</h2>
          <p className="text-sbtp-brown-500 max-w-2xl mx-auto">
            Unlock all features and support our mission to connect people with sustainable, local food sources.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-sbtp-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-8 bg-sbtp-green-600 text-white">
                <h3 className="text-2xl font-bold mb-6">Premium Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-sbtp-yellow" />
                    <span>Advanced gardening programs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-sbtp-yellow" />
                    <span>Ask Jane - Your Personal Gardening Assistant</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-sbtp-yellow" />
                    <span>Exclusive access to expert webinars</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-sbtp-yellow" />
                    <span>Priority community support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-sbtp-yellow" />
                    <span>Early access to new features</span>
                  </li>
                </ul>
              </div>
              
              <div className="col-span-2 p-8 flex flex-col">
                <h3 className="text-2xl font-bold text-sbtp-green-800 mb-2">Choose Your Plan</h3>
                <p className="text-sbtp-brown-500 mb-6">Select the option that works best for you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-sbtp-green-200 rounded-lg p-4 flex flex-col">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-sbtp-green-700">Monthly</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-sbtp-green-800">$10</span>
                        <span className="text-sbtp-brown-500">/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-sbtp-brown-500 text-center mb-4">Billed monthly</p>
                    <Button 
                      className="mt-auto bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white text-sm py-2"
                      onClick={handleSubscribe}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Subscribe Monthly"}
                    </Button>
                  </div>
                  
                  <div className="border-2 border-sbtp-green-500 rounded-lg p-4 flex flex-col relative">
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="bg-sbtp-yellow text-sbtp-brown-700 text-xs font-semibold px-3 py-1 rounded-full">
                        BEST VALUE
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-sbtp-green-700">Annual</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-sbtp-green-800">$100</span>
                        <span className="text-sbtp-brown-500">/year</span>
                      </div>
                    </div>
                    <p className="text-sm text-sbtp-brown-500 text-center mb-4">Save $20 with annual billing</p>
                    <Button 
                      className="mt-auto bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white text-sm py-2"
                      onClick={handleSubscribe}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Subscribe Yearly"}
                    </Button>
                  </div>

                  <div className="border border-sbtp-blue rounded-lg p-4 flex flex-col">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-sbtp-blue">Educator</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold text-sbtp-blue">$8</span>
                        <span className="text-sbtp-brown-500 text-sm">/month</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-xl font-bold text-sbtp-blue">$85</span>
                        <span className="text-sbtp-brown-500 text-sm">/year</span>
                      </div>
                    </div>
                    <p className="text-xs text-sbtp-brown-500 text-center mb-4">Special pricing for educators</p>
                    <Button 
                      variant="outline" 
                      className="mt-auto border-sbtp-blue text-sbtp-blue hover:bg-sbtp-blue hover:text-white text-sm py-2"
                      onClick={handleSubscribe}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Educator Plan"}
                    </Button>
                  </div>
                </div>

                <div className="bg-sbtp-green-50 border border-sbtp-green-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-sbtp-green-800 mb-2">Institutions</h4>
                  <p className="text-sm text-sbtp-brown-500 mb-3">
                    Are you interested in setting up a contract for your institution? We offer custom solutions for schools, organizations, and businesses.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-sbtp-green-500 text-sbtp-green-700 hover:bg-sbtp-green-500 hover:text-white text-sm"
                    onClick={() => window.location.href = "mailto:info@savedbytheplate.com?subject=Institutional Partnership with Saved by the Plate Inc. Inc."}
                  >
                    Contact Us
                  </Button>
                </div>
                
                <p className="text-sm text-sbtp-brown-500 text-center">
                  All plans come with a 7-day free trial. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please log in to subscribe</DialogTitle>
            <DialogDescription>
              You need to be logged in to subscribe to our premium plans. Please log in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button 
              className="flex-1 bg-sbtp-green-500 hover:bg-sbtp-green-600"
              onClick={() => window.location.href = '/auth'}
            >
              Log In / Sign Up
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PricingSection;
