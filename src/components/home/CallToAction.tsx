
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 bg-sbtp-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Grow Local?</h2>
          <p className="text-xl mb-8 text-sbtp-beige">
            Join our community today and start your journey towards sustainable local food choices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-sbtp-green-700 hover:bg-sbtp-yellow hover:text-sbtp-green-800 rounded-full py-6 px-10 text-lg font-semibold shadow-lg">
              <Link to="/map">Explore Local Food Map</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 rounded-full py-6 px-10 text-lg font-semibold">
              <Link to="/premium">Get Premium</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
