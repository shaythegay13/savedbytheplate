
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-sbtp-green-100 to-sbtp-beige">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sbtp-green-200 to-sbtp-beige pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 flex justify-center mb-10 md:mb-0 md:order-2">
            <img 
              src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.png" 
              alt="Saved by the Plate Logo" 
              className="w-64 h-64 md:w-96 md:h-96 object-contain rounded-full bg-white p-4 shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold text-sbtp-green-800 mb-4">
              Connect with <span className="text-sbtp-blue">Local Food</span> & Sustainable <span className="text-sbtp-green-600">Agriculture</span>
            </h1>
            <p className="text-lg md:text-xl text-sbtp-brown-700 mb-8 max-w-md">
              Empowering individuals to make informed food choices by connecting them to local food sources and sustainable agriculture education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white py-6 px-8 text-lg">
                <Link to="/map">Find Local Food</Link>
              </Button>
              <Button asChild variant="outline" className="border-sbtp-green-500 text-sbtp-green-700 hover:bg-sbtp-green-100 py-6 px-8 text-lg">
                <Link to="/garden-plan">Start Your Garden</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
