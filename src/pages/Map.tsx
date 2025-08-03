
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import MapComponent from "@/components/map/MapComponent";
import MapFilters from "@/components/map/MapFilters";
import UnifiedMapLegend from "@/components/map/UnifiedMapLegend";
import { fetchEnhancedMapData, categorizeLocations } from "@/services/enhancedMapDataService";
import { useState, useEffect } from "react";

const Map = () => {
  const [locationCounts, setLocationCounts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data to get location counts for the legend
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const locations = await fetchEnhancedMapData();
        const categorized = categorizeLocations(locations);
        setLocationCounts({
          gardens: categorized.gardens.length,
          markets: categorized.markets.length,
          fridges: categorized.fridges.length,
          foodbanks: categorized.foodbanks.length,
          farms: categorized.farms.length,
          urbanfarms: categorized.urbanfarms.length,
          businesses: categorized.businesses.length
        });
      } catch (error) {
        console.error('Error loading location counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);
  return (
    <div className="min-h-screen bg-sbtp-beige">
      {/* Hero Section */}
      <section className="bg-sbtp-green-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Find Your Local Food Map 🗺️</h1>
            <p className="text-xl">
              Discover where you can find local sources of food around you including community gardens, farmers markets, farms, and other local resources. Also add any we are missing! 🌱
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <MapFilters />
              <UnifiedMapLegend locationCounts={locationCounts} isLoading={loading} />
            </div>
            
            <div className="lg:col-span-3">
              <MapComponent />
              
              <div className="mt-6 bg-white p-6 rounded-lg border border-sbtp-green-200">
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Enhanced Food Access Map</h3>
                <p className="text-sbtp-brown-500 mb-4">
                  This map displays {!loading && locationCounts ? 
                    `${Object.values(locationCounts).reduce((a: number, b: number) => a + b, 0)} verified food access locations` : 
                    'comprehensive food access locations'} from multiple trusted data sources including NYC Open Data, community organizations, and Food Bank NYC. 
                  Help us keep this data current by adding missing locations or reporting changes!
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
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Data Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">NYC Open Data</h4>
                          <p className="text-xs text-sbtp-brown-500">Community gardens & farms</p>
                        </div>
                        <Badge className="bg-sbtp-blue text-white text-xs">Live</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">GrowNYC</h4>
                          <p className="text-xs text-sbtp-brown-500">Farmers markets</p>
                        </div>
                        <Badge className="bg-sbtp-green-500 text-white text-xs">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sbtp-green-700">Food Bank NYC</h4>
                          <p className="text-xs text-sbtp-brown-500">Food pantries & fridges</p>
                        </div>
                        <Badge className="bg-sbtp-yellow text-sbtp-brown-700 text-xs">Verified</Badge>
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
