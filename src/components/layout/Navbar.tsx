
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sprout } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: "/index", label: "Home" },
    { href: "/map", label: "Local Food" },
    { href: "/education", label: "Learn to Grow" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/garden-plan", label: "Garden Planner" },
    { href: "/community", label: "Community" },
  ];

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/index" className="flex items-center">
              <Sprout className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Saved by the Plate</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-green-700 text-white"
                    : "hover:bg-green-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-white hover:text-green-200 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-green-700 text-white"
                    : "hover:bg-green-700"
                }`}
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
