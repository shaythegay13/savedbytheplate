
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import MapComponent from "@/components/map/MapComponent";
import MapFilters from "@/components/map/MapFilters";
import Footer from "@/components/layout/Footer";

const Map = () => {
  return (
    <div className="min-h-screen bg-sbtp-beige">
      {/* Hero Section */}
      <section className="bg-sbtp-green-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">NYC Food & Community Facilities Map</h1>
            <p className="text-xl">
              Discover real NYC facilities including community gardens, urban farms, and local food resources using official city data.
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
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Open Data Integration</h3>
                <p className="text-sbtp-brown-500 mb-4">
                  This map displays real facilities using multiple data sources. If you want to add any information about any of the spaces in the map, click the button "Add to Map" below!
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
              
              {/* Data Source Info */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Data Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">NYC Open Data Portal</h4>
                          <p className="text-sm text-sbtp-brown-500">Official city facility data</p>
                        </div>
                        <Badge className="bg-sbtp-blue text-white">Live Data</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">Real-time Updates</h4>
                          <p className="text-sm text-sbtp-brown-500">Data refreshed automatically</p>
                        </div>
                        <Badge className="bg-sbtp-green-500 text-white">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Map;
