
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "School Garden Tours",
    description: "Connect your students with local food justice work through educational community garden tours.",
    icon: (
      <div className="bg-sbtp-green-100 p-3 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"></path><path d="M10 7v10"></path><path d="m15 7-3 5 3 5"></path></svg>
      </div>
    ),
    link: "/education",
    isPremium: true
  },
  {
    title: "Community",
    description: "Connect with like-minded individuals on our Discord server organized by topics and regions.",
    icon: (
      <div className="bg-sbtp-green-100 p-3 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
      </div>
    ),
    link: "/community",
    isPremium: false
  },
  {
    title: "Local Food Map",
    description: "Discover farms, farmers markets, and local food sources with our interactive map.",
    icon: (
      <div className="bg-sbtp-green-100 p-3 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
      </div>
    ),
    link: "/map",
    isPremium: false
  },
  {
    title: "Garden Plan",
    description: "Get a personalized gardening plan tailored to your space, whether urban or rural.",
    icon: (
      <div className="bg-sbtp-green-100 p-3 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"></path></svg>
      </div>
    ),
    link: "/garden-plan",
    isPremium: true
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">Explore Our Features</h2>
          <p className="text-sbtp-brown-500 max-w-2xl mx-auto">
            Discover all the ways Saved by the Plate can help you connect with local food sources and learn sustainable practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-sbtp-green-200 hover:shadow-md transition-shadow">
              <CardHeader>
                {feature.isPremium && (
                  <div className="premium-indicator">Premium</div>
                )}
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-center text-sbtp-green-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sbtp-brown-500">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline" className="border-sbtp-green-500 text-sbtp-green-700">
                  <Link to={feature.link}>Explore</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
