import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isWaitingList = location.pathname === "/waiting-list";
  const currentYear = new Date().getFullYear();

  // Dynamically choose layout class
  const layoutClass = isWaitingList
    ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:flex lg:justify-between lg:gap-0"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";

  return (
    <footer className="bg-sbtp-green-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        
        <div className={layoutClass}>
          {/* Logo Block */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.png" 
                alt="Saved by the Plate" 
                className="h-12 w-12 object-contain bg-white rounded-full p-1"
              />
              <span className="text-lg font-bold">Saved by the Plate</span>
            </Link>
            <p className="text-sm text-gray-300 mt-2">
              Empowering individuals to make informed food choices by connecting them to local food sources and sustainable agriculture education.
            </p>
          </div>

          {/* Conditionally shown center columns */}
          {!isWaitingList && (
            <>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/education" className="hover:text-white transition-colors">Education</Link></li>
                  <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                  <li><Link to="/map" className="hover:text-white transition-colors">Local Map</Link></li>
                  <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                  <li><Link to="/garden-plan" className="hover:text-white transition-colors">Garden Plan</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Premium</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/premium" className="hover:text-white transition-colors">Premium Benefits</Link></li>
                  <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="hover:text-white transition-colors">Subscription</span>
                      <span className="bg-sbtp-yellow text-sbtp-green-800 text-xs px-2 py-0.5 rounded-full">$10/mo</span>
                    </div>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Stay Connected Block */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            {/* ... social icons code stays unchanged ... */}
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-sbtp-green-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {currentYear} Saved by the Plate. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
