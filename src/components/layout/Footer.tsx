import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isWaitingList = location.pathname === "/waiting-list";

  return (
    <footer className="bg-sbtp-green-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top footer section layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {/* Column 1: Logo and Description */}
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

          {/* Column 2: Quick Links */}
          {!isWaitingList && (
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
          )}

          {/* Column 3: Premium */}
          {!isWaitingList && (
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
          )}

          {/* Column 4: Social Links (Always Visible) */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="mailto:contact@savedbytheplate.com" className="hover:text-white transition-colors">contact@savedbytheplate.com</a></li>
              <li>
                <div className="flex space-x-4 mt-4">
                  <a href="https://tiktok.com/@saved.by.the.plate" className="hover:text-sbtp-yellow transition-colors" aria-label="TikTok">
                    {/* TikTok icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/saved-by-the-plate" className="hover:text-sbtp-yellow transition-colors" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
                  </a>
                  <a href="https://instagram.com/savedbytheplate" className="hover:text-sbtp-yellow transition-colors" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
                  </a>
                  <a href="https://www.youtube.com/@SavedbythePlate" className="hover:text-sbtp-yellow transition-colors" aria-label="YouTube">
                    <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
                  </a>
                  <a href="https://discord.gg/NE3kyCNqr9" className="hover:text-sbtp-yellow transition-colors" aria-label="Discord">
                    <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer bar */}
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
