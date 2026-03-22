import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-to-beehiiv", {
        body: { email },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(data.message || "Subscribed!");
        setEmail("");
      } else {
        toast.error(data?.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[300px]">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Add email address"
        required
        className="flex-1 min-w-0 rounded-l-md border-0 px-3 py-2 text-sm text-white bg-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sbtp-yellow"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-r-md bg-sbtp-yellow px-4 py-2 text-sm font-semibold text-sbtp-green-800 hover:bg-sbtp-yellow/90 transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
};

const Footer = () => {
  const location = useLocation();
  const isWaitingList = location.pathname === "/waiting-list";
  const isLegalPage = location.pathname === "/terms" || location.pathname === "/privacy" || location.pathname.startsWith("/legal");
  const isWaitingListLegal = location.pathname.startsWith("/legal");
  const currentYear = new Date().getFullYear();

  // Choose layout class dynamically
  const layoutClass = isWaitingList || isLegalPage
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
                src="/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.webp"
                alt="Saved by the Plate"
                className="h-12 w-12 object-contain bg-white rounded-full p-1"
              />
              <span className="text-lg font-bold">Saved by the Plate</span>
            </Link>
            <p className="text-sm text-gray-300 mt-2 max-w-xs">
              Inspiring the next generation to grow, learn, and lead by connecting youth and communities to local gardens, sustainable food education, and hands-on experiences in urban agriculture.
            </p>
          </div>

          {/* Conditionally show these columns if NOT on waiting list or legal pages */}
          {!isWaitingList && !isLegalPage && (
            <>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/index" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/education" className="hover:text-white transition-colors">Education</Link></li>
                  <li><Link to="/local-food/garden-planner" className="hover:text-white transition-colors">Ask Jane</Link></li>
                  <li><Link to="/local-food/map" className="hover:text-white transition-colors">Local Food</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Premium</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/premium" className="hover:text-white transition-colors">Premium Benefits</Link></li>
                  <li>
                    <div className="flex items-center gap-2">
                      <span className="hover:text-white transition-colors">Subscription</span>
                      <span className="bg-sbtp-yellow text-sbtp-green-800 text-xs px-2 py-0.5 rounded-full">$10/mo</span>
                    </div>
                  </li>
                </ul>
                <h4 className="text-lg font-semibold mt-6 mb-2">Newsletter</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Bi-monthly updates on food justice & gardening.
                </p>
                <NewsletterForm />
              </div>
            </>
          )}

          {/* Stay Connected Block */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="mailto:info@savedbytheplate.org" className="hover:text-white transition-colors">info@savedbytheplate.org</a></li>
              <li>
                <div className="flex space-x-4 mt-4">
                  {/* Facebook */}
                  <a href="https://www.facebook.com/SavedbythePlate/" target="_blank" rel="noopener noreferrer" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Facebook</title><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  {/* TikTok */}
                   <a href="https://www.tiktok.com/@saved.by.the.plate" target="_blank" rel="noopener noreferrer" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><title>TikTok</title><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/saved-by-the-plate/" target="_blank" rel="noopener noreferrer" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="https://www.instagram.com/savedbytheplate/" target="_blank" rel="noopener noreferrer" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@Savedby.thePlate" target="_blank" rel="noopener noreferrer" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                  <a href="https://discord.com/invite/NE3kyCNqr9" target="_blank" rel="noopener noreferrer" className="hover:text-sbtp-yellow transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-sbtp-green-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {currentYear} Saved by the Plate. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link to={(isWaitingList || isWaitingListLegal) ? "/legal/terms" : "/terms"} className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to={(isWaitingList || isWaitingListLegal) ? "/legal/privacy" : "/privacy"} className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
