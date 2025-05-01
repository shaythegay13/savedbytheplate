
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.png" 
              alt="Saved by the Plate" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-sbtp-green-700">Saved by the Plate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/education" className="text-sbtp-green-700 hover:text-sbtp-green-500 transition-colors">
              Education
            </Link>
            <Link to="/community" className="text-sbtp-green-700 hover:text-sbtp-green-500 transition-colors">
              Community
            </Link>
            <Link to="/map" className="text-sbtp-green-700 hover:text-sbtp-green-500 transition-colors">
              Local Map
            </Link>
            <Link to="/marketplace" className="text-sbtp-green-700 hover:text-sbtp-green-500 transition-colors">
              Marketplace
            </Link>
            <Link to="/garden-plan" className="text-sbtp-green-700 hover:text-sbtp-green-500 transition-colors">
              Garden Plan
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="border-sbtp-green-500 text-sbtp-green-700">
              Sign In
            </Button>
            <Button className="bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white">
              Get Premium
            </Button>
          </div>

          {/* Mobile Navigation Icon */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-sbtp-green-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="flex flex-col gap-3">
              <Link 
                to="/education" 
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-sbtp-green-700 hover:bg-sbtp-green-100 rounded-md"
              >
                Education
              </Link>
              <Link 
                to="/community" 
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-sbtp-green-700 hover:bg-sbtp-green-100 rounded-md"
              >
                Community
              </Link>
              <Link 
                to="/map" 
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-sbtp-green-700 hover:bg-sbtp-green-100 rounded-md"
              >
                Local Map
              </Link>
              <Link 
                to="/marketplace" 
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-sbtp-green-700 hover:bg-sbtp-green-100 rounded-md"
              >
                Marketplace
              </Link>
              <Link 
                to="/garden-plan" 
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 text-sbtp-green-700 hover:bg-sbtp-green-100 rounded-md"
              >
                Garden Plan
              </Link>
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" className="border-sbtp-green-500 text-sbtp-green-700 w-full">
                  Sign In
                </Button>
                <Button className="bg-sbtp-green-500 hover:bg-sbtp-green-600 text-white w-full">
                  Get Premium
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
