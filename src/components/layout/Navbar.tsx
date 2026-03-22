
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sprout, LogOut, User, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DonationButton from "@/components/DonationButton";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [username, setUsername] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUsername(session.user.id);
        } else {
          setUsername("");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUsername(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUsername = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (data) {
      setUsername(data.username);
    }
  };

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
    { href: "/education", label: "Education" },
    { href: "/local-food/garden-planner", label: "Ask Jane" },
    { href: "/local-food/map", label: "Local Food" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-sbtp-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center min-w-0">
            <Link to="/index" className="flex items-center min-w-0">
              <Sprout className="h-6 w-6 flex-shrink-0 mr-2" />
              <span className="font-bold text-base lg:text-lg truncate">Saved by the Plate Inc.</span>
            </Link>
          </div>
          
          {/* Desktop menu — tighter spacing for smaller laptops */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(item.href)
                    ? "bg-sbtp-green-700 text-white"
                    : "text-green-100 hover:bg-sbtp-green-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <DonationButton />
            
            {user ? (
              <div className="flex items-center gap-1 xl:gap-2">
                <span className="text-sm flex items-center gap-1 truncate max-w-[120px]">
                  <User className="h-4 w-4 flex-shrink-0" />
                  {username || user.email?.split('@')[0]}
                </span>
                <Link to="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white text-white hover:bg-sbtp-green-700 text-xs"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-sbtp-green-700 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-sbtp-green-700 text-xs"
                >
                  <User className="h-3.5 w-3.5 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Tablet menu — show nav links, collapse user actions into hamburger */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-2 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive(item.href)
                    ? "bg-sbtp-green-700 text-white"
                    : "text-green-100 hover:bg-sbtp-green-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button 
              onClick={toggleMenu} 
              className="text-white hover:text-sbtp-yellow focus:outline-none ml-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
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
      
      {/* Mobile/tablet dropdown menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sbtp-green-800">
            {/* Only show nav items on mobile (they're already visible on tablet) */}
            <div className="md:hidden">
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
            </div>
            
            <div className="px-3 py-2">
              <DonationButton />
            </div>
            
            {user ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm flex items-center gap-1 text-white">
                  <User className="h-4 w-4" />
                  {username || user.email?.split('@')[0]}
                </div>
                <Link to="/profile" onClick={toggleMenu}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border-white text-white hover:bg-sbtp-green-700"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </Link>
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
