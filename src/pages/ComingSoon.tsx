import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Sprout className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground">
              We're working hard to bring you an amazing AI-powered garden planning experience.
            </p>
            <p className="text-muted-foreground">
              This feature will help you design the perfect garden tailored to your space, climate, and preferences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/local-food">
                Explore Other Features
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
