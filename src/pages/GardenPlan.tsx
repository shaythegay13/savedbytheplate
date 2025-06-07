
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GardenPlanGenerator from "@/components/garden-plan/GardenPlanGenerator";

const GardenPlan = () => {
  // For demo purposes, let's assume the user is subscribed
  // In a real app, this would check the user's subscription status
  const isSubscribed = true; // This would come from your authentication/subscription context

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-sbtp-beige">
        {/* Hero Section for Subscribed Users */}
        <section className="bg-sbtp-green-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-sbtp-yellow text-sbtp-brown-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Premium Feature
              </span>
              <h1 className="text-4xl font-bold mb-4">Your Personalized Garden Planning Tool</h1>
              <p className="text-xl">
                Create a customized gardening plan tailored to your specific space, climate, and goals.
              </p>
            </div>
          </div>
        </section>

        {/* Garden Planning Tool */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <GardenPlanGenerator />
          </div>
        </section>
      </div>
    );
  }

  // Premium Lock Section (original content for non-subscribers)
  return (
    <div className="min-h-screen bg-sbtp-beige">
      {/* Hero Section - Premium Feature */}
      <section className="bg-sbtp-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-sbtp-yellow text-sbtp-brown-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Premium Feature
            </span>
            <h1 className="text-4xl font-bold mb-4">Your Personalized Garden Plan</h1>
            <p className="text-xl mb-8">
              Get a customized gardening plan tailored to your space, climate, and goals, whether you have an urban balcony or rural acreage.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Lock Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-sbtp-yellow mb-8 overflow-hidden">
              <div className="bg-sbtp-yellow/20 px-6 py-8 text-center">
                <div className="w-20 h-20 bg-sbtp-yellow rounded-full mx-auto flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-brown-700"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 className="text-2xl font-semibold text-sbtp-brown-700 mb-2">Premium Content</h2>
                <p className="text-sbtp-brown-500 max-w-lg mx-auto mb-6">
                  Unlock our personalized garden planning feature with a premium subscription to get tailored advice and plans for your specific growing conditions.
                </p>
                <Button asChild className="bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white">
                  <Link to="/premium">Upgrade to Premium</Link>
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">What You'll Get With Premium</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500 mr-3 mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sbtp-brown-700">Customized planting calendar based on your zone and climate</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500 mr-3 mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sbtp-brown-700">Plant recommendations optimized for your space and sunlight</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500 mr-3 mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sbtp-brown-700">Custom garden layout designs for maximum efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500 mr-3 mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sbtp-brown-700">Detailed care instructions tailored to your specific conditions</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500 mr-3 mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sbtp-brown-700">Expert troubleshooting tips and seasonal guidance</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-500 mr-3 mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span className="text-sbtp-brown-700">Intelligent plant variety recommendations for your climate</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Pricing</h3>
                <Card className="border-sbtp-green-200 h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-sbtp-green-700 mb-1">Monthly Plan</h4>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-sbtp-green-800">$10</span>
                          <span className="text-sbtp-brown-500 ml-1">/month</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sbtp-green-700 mb-1">Annual Plan (Best Value)</h4>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-sbtp-green-800">$100</span>
                          <span className="text-sbtp-brown-500 ml-1">/year</span>
                        </div>
                        <span className="text-sm text-sbtp-green-500">Save $20 with annual billing</span>
                      </div>
                      
                      <Button asChild className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
                        <Link to="/premium">Get Premium</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-sbtp-green-800 mb-6">Preview: Garden Planning Tool</h2>
            <div className="bg-white rounded-lg border border-sbtp-green-200 p-6 mb-8 opacity-70">
              <div className="rounded-lg overflow-hidden bg-sbtp-beige p-8 flex flex-col items-center justify-center min-h-[300px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-400 mb-6"><path d="M7 20h10"></path><path d="M10 20c1.5 0 3.485-2.857 4-6.5"></path><path d="M14 20c-1.5 0-2.5-5.5-2.5-9s1-7 3-8c1 1 2 2 2.5 5s.5 4 .5 7-1 5-3 5Z"></path></svg>
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-2">Garden Planning Interface</h3>
                <p className="text-center text-sbtp-brown-500">
                  Our interactive garden planning tool creates personalized recommendations based on your space, climate, and goals.
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="bg-sbtp-green-100 rounded-lg p-4 text-center">
                    <p className="text-sbtp-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Locked Premium Feature
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sbtp-green-100 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-sbtp-green-800">Ready to start your garden?</h3>
                  <p className="text-sbtp-brown-700">Unlock personalized garden planning with premium.</p>
                </div>
                <Button asChild className="bg-sbtp-green-600 hover:bg-sbtp-green-700">
                  <Link to="/premium">Upgrade Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GardenPlan;
