
import { Link } from "react-router-dom";
const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="bg-sbtp-green-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="mailto:contact@savedbytheplate.com" className="hover:text-white transition-colors">contact@savedbytheplate.com</a></li>
              <li>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                  <a href="#" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-discord"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.2c.3-.4 2.9-2.5 4.5-2.5 1.6.1 3 .7 4.9 2.5"></path><path d="M7.5 16.8c.3.4 2.9 2.5 4.5 2.5 1.6-.1 3-.7 4.9-2.5"></path><path d="M15.5 17c.3 1.3.2 2.5-1.5 4.5"></path><path d="M8.5 17c-.3 1.3-.2 2.5 1.5 4.5"></path><path d="M12 4v16"></path><path d="M20 10c0-4.4-1.8-6-4-6-2 0-4.5 2-4.5 2-1 .5-5 .5-6 0 0 0-2.5-2-4.5-2-2.5 0-4 2-4 6 0 4.1 2 8 2 8 1.4 1.4 4.5 3 7.5 3v-3h2v3c3 0 6.1-1.6 7.5-3 0 0 2-3.9 2-8z"></path></svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sbtp-green-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Saved by the Plate. All rights reserved.</p>
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
