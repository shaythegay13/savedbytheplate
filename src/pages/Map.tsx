
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import MapComponent from "@/components/map/MapComponent";
import MapFilters from "@/components/map/MapFilters";

const Map = () => {
  return (
    <div className="min-h-screen bg-sbtp-beige">
      {/* Hero Section */}
      <section className="bg-sbtp-green-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Local Food & Business Map</h1>
            <p className="text-xl">
              Discover farms, farmers markets, community gardens, and businesses that source their products locally.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MapFilters />
            </div>
            
            <div className="lg:col-span-3">
              <MapComponent />
              
              <div className="mt-6 bg-white p-6 rounded-lg border border-sbtp-green-200">
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Contribute to Our Map</h3>
                <p className="text-sbtp-brown-500 mb-4">
                  Help our community grow by adding local food sources to our map. Share farms, markets, community gardens, and businesses that support local food.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-sbtp-yellow hover:bg-sbtp-yellow/80 text-sbtp-brown-700">
                    <MapPin className="h-4 w-4 mr-2" /> Add to Map
                  </Button>
                  <Button variant="outline" className="border-sbtp-green-300 text-sbtp-green-700">
                    Report an Issue
                  </Button>
                </div>
              </div>
              
              {/* Featured locations */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Featured Locations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">Union Square Farmers Market</h4>
                          <p className="text-sm text-sbtp-brown-500">Open Mon, Wed, Fri, Sat (8am-2pm)</p>
                        </div>
                        <Badge className="bg-sbtp-blue text-white">Market</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">Lower East Side Community Garden</h4>
                          <p className="text-sm text-sbtp-brown-500">20+ community plots</p>
                        </div>
                        <Badge className="bg-sbtp-yellow text-sbtp-brown-700">Garden</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Map;
