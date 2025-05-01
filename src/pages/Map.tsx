
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Placeholder component for Map (in a real implementation, this would use a mapping library)
const MapPlaceholder = () => {
  return (
    <div className="relative w-full h-[60vh] bg-sbtp-green-100 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-full shadow-md mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
        </div>
        <h3 className="text-xl font-semibold text-sbtp-green-800 mb-2">Map Loading...</h3>
        <p className="text-sbtp-brown-500">
          This is a placeholder for the interactive map.<br/>
          The actual implementation would use a mapping library.
        </p>
      </div>
      
      {/* Mock map pins */}
      <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-sbtp-green-500 rounded-full border-2 border-white shadow-md pulse-animation"></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-sbtp-blue rounded-full border-2 border-white shadow-md pulse-animation"></div>
      <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-sbtp-yellow rounded-full border-2 border-white shadow-md pulse-animation"></div>
      <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-sbtp-green-500 rounded-full border-2 border-white shadow-md pulse-animation"></div>
    </div>
  );
};

// Filter component for the map
const MapFilters = () => {
  const [currentTab, setCurrentTab] = useState('current');
  
  return (
    <Card className="border-sbtp-green-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-sbtp-green-800 mb-4">Map Filters</h3>
        
        <Tabs defaultValue="current" onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="bg-sbtp-green-100 w-full">
            <TabsTrigger value="current" className="flex-1 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
              Current Season
            </TabsTrigger>
            <TabsTrigger value="historical" className="flex-1 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
              Historical
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="season" className="text-sbtp-brown-700">Season</Label>
                <Select defaultValue="summer">
                  <SelectTrigger id="season" className="bg-white">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="fall">Fall</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location" className="text-sbtp-brown-700">Location</Label>
                <Select defaultValue="current">
                  <SelectTrigger id="location" className="bg-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Location</SelectItem>
                    <SelectItem value="northeast">Northeast</SelectItem>
                    <SelectItem value="southeast">Southeast</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="northwest">Northwest</SelectItem>
                    <SelectItem value="southwest">Southwest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="historical" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-sbtp-brown-500 mb-4">
                View what food grew in this area before colonization and urbanization, when indigenous peoples were the stewards of Turtle Island.
              </p>
              
              <div>
                <Label htmlFor="region" className="text-sbtp-brown-700">Indigenous Region</Label>
                <Select defaultValue="northeast-woodlands">
                  <SelectTrigger id="region" className="bg-white">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="northeast-woodlands">Northeast Woodlands</SelectItem>
                    <SelectItem value="southeast">Southeast</SelectItem>
                    <SelectItem value="great-plains">Great Plains</SelectItem>
                    <SelectItem value="southwest">Southwest</SelectItem>
                    <SelectItem value="great-basin">Great Basin</SelectItem>
                    <SelectItem value="california">California</SelectItem>
                    <SelectItem value="northwest-coast">Northwest Coast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 border-t border-sbtp-green-200 pt-4">
          <h4 className="font-medium text-sbtp-green-800 mb-2">Show on Map:</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="farms" className="text-sbtp-brown-700 cursor-pointer">Farms</Label>
            <Switch id="farms" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="farmers-markets" className="text-sbtp-brown-700 cursor-pointer">Farmers Markets</Label>
            <Switch id="farmers-markets" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="community-gardens" className="text-sbtp-brown-700 cursor-pointer">Community Gardens</Label>
            <Switch id="community-gardens" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="local-businesses" className="text-sbtp-brown-700 cursor-pointer">Local Food Businesses</Label>
            <Switch id="local-businesses" defaultChecked />
          </div>
        </div>
        
        <Button className="w-full mt-6 bg-sbtp-green-500 hover:bg-sbtp-green-600">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

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
              <MapPlaceholder />
              
              <div className="mt-6 bg-white p-6 rounded-lg border border-sbtp-green-200">
                <h3 className="text-xl font-semibold text-sbtp-green-800 mb-4">Contribute to Our Map</h3>
                <p className="text-sbtp-brown-500 mb-4">
                  Help our community grow by adding local food sources to our map. Share farms, markets, community gardens, and businesses that support local food.
                </p>
                <Button className="bg-sbtp-yellow hover:bg-sbtp-yellow/80 text-sbtp-brown-700">
                  Add to Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Map;
