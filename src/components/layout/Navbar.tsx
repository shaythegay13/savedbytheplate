
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sprout, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DonationButton from "@/components/DonationButton";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: "/index", label: "Home" },
    { href: "/local-food", label: "Local Food" },
    { href: "/calendar", label: "Events" },
    { href: "/education", label: "Education" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-sbtp-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/index" className="flex items-center">
              <Sprout className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
              <span className="font-bold text-lg sm:text-xl truncate">Saved by the Plate</span>
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
                    ? "bg-sbtp-green-700 text-white"
                    : "hover:bg-sbtp-green-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <DonationButton />
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user.email?.split('@')[0]}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-sbtp-green-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-sbtp-green-700"
                >
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-white hover:text-sbtp-yellow focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sbtp-green-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-sbtp-green-700 text-white"
                    : "hover:bg-sbtp-green-700"
                }`}
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="px-3 py-2">
              <DonationButton />
            </div>
            
            {user ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm flex items-center gap-1 text-white">
                  <User className="h-4 w-4" />
                  {user.email?.split('@')[0]}
                </div>
                <Button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-white text-white hover:bg-sbtp-green-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" onClick={toggleMenu}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-white text-white hover:bg-sbtp-green-700 mx-3"
                >
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
