import { useNavigate } from "react-router-dom";
import { MapPin, Sprout } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const LocalFood = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <title>Local Food Resources NYC — Gardens, Markets &amp; Food Banks | Saved by the Plate</title>
      <meta name="description" content="Find community gardens, farmers markets, food banks, community fridges, and urban farms near you in New York City." />
      <link rel="canonical" href="https://www.savedbytheplate.org/local-food" />
      <meta property="og:title" content="Local Food Resources NYC | Saved by the Plate" />
      <meta property="og:url" content="https://www.savedbytheplate.org/local-food" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.savedbytheplate.org/"},{"@type":"ListItem","position":2,"name":"Local Food Resources","item":"https://www.savedbytheplate.org/local-food"}]}` }} />
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Local Food Resources
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you'd like to connect with local food
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Garden Space */}
          <button
            onClick={() => navigate("/local-food/garden-planner")}
            className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all duration-300 p-8 text-left bg-card hover:shadow-lg"
          >
            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Sprout className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">
                Ask Jane
              </h2>
              <p className="text-muted-foreground">
                Chat with Jane, your personal gardening assistant, to get personalized advice, plant recommendations, and tips tailored to your space.
              </p>
            </div>
          </button>

          {/* Find Local Food Sources */}
          <button
            onClick={() => navigate("/local-food/map")}
            className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all duration-300 p-8 text-left bg-card hover:shadow-lg"
          >
            <div className="relative z-10">
              <div className="mb-6 inline-block p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">
                Find Local Food Sources
              </h2>
              <p className="text-muted-foreground">
                Discover farmers markets, community gardens, food banks, and other local food resources near you.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalFood;
