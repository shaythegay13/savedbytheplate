
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
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
                    <span>Advanced gardening courses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-sbtp-yellow" />
                    <span>Personalized garden planning</span>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-sbtp-green-200 rounded-lg p-6 flex flex-col">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-sbtp-green-700">Monthly</h4>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-sbtp-green-800">$10</span>
                        <span className="text-sbtp-brown-500">/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-sbtp-brown-500 text-center mb-4">Billed monthly</p>
                    <Button className="mt-auto bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white">
                      Subscribe Monthly
                    </Button>
                  </div>
                  
                  <div className="border-2 border-sbtp-green-500 rounded-lg p-6 flex flex-col relative">
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="bg-sbtp-yellow text-sbtp-brown-700 text-xs font-semibold px-3 py-1 rounded-full">
                        BEST VALUE
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-sbtp-green-700">Annual</h4>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-sbtp-green-800">$100</span>
                        <span className="text-sbtp-brown-500">/year</span>
                      </div>
                    </div>
                    <p className="text-sm text-sbtp-brown-500 text-center mb-4">Save $20 with annual billing</p>
                    <Button className="mt-auto bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white">
                      Subscribe Yearly
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-sbtp-brown-500 text-center">
                  All plans come with a 7-day free trial. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
