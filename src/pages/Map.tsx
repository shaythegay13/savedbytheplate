import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Map as MapIcon, MapPin, Filter, Leaf, Calendar, Store, Search, TreeDeciduous, Building2, ShoppingBasket } from 'lucide-react';
import { useForm } from "react-hook-form";

// Placeholder component for Map (in a real implementation, this would use a mapping library)
const MapPlaceholder = () => {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const handlePinClick = (id: string) => {
    setActivePopup(activePopup === id ? null : id);
  };

  return (
    <div className="relative w-full h-[70vh] bg-gradient-to-b from-sbtp-beige to-sbtp-green-100 rounded-lg overflow-hidden border border-sbtp-green-200 shadow-lg">
      {/* Manhattan mockup background */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://i.imgur.com/XYBtfqP.png')] bg-cover bg-center"></div>
      
      {/* Mockup map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white rounded-md shadow-md p-2 flex flex-col gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Zoom in">+</Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Zoom out">−</Button>
        </div>
        <Button size="icon" variant="secondary" className="h-8 w-8 bg-white shadow-md" aria-label="My location">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-md shadow-md text-xs">
        <h4 className="font-medium mb-2 text-sbtp-brown-700">Map Legend</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sbtp-green-500"></span>
            <span>Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sbtp-blue"></span>
            <span>Farmers Markets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sbtp-yellow"></span>
            <span>Community Gardens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sbtp-brown-300"></span>
            <span>Urban Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Local Food Businesses</span>
          </div>
        </div>
      </div>
      
      {/* Mock map pins with popups */}
      <div className="absolute top-[30%] left-[40%]">
        <div 
          className="w-6 h-6 bg-sbtp-green-500 rounded-full border-2 border-white shadow-md cursor-pointer animate-pulse-slow"
          onClick={() => handlePinClick('farm1')}
        ></div>
        {activePopup === 'farm1' && (
          <div className="absolute bottom-8 left-0 w-60 bg-white rounded-md shadow-lg p-3 z-10">
            <h4 className="font-medium text-sbtp-green-700">Uptown Urban Farm</h4>
            <p className="text-xs text-sbtp-brown-500 mt-1">Organic produce, seasonal crops</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-sbtp-green-100 text-sbtp-green-700">Vegetables</Badge>
              <Badge variant="outline" className="text-xs bg-sbtp-green-100 text-sbtp-green-700">Fruits</Badge>
              <Badge variant="outline" className="text-xs bg-sbtp-green-100 text-sbtp-green-700">Herbs</Badge>
            </div>
            <p className="text-xs mt-2">Currently growing: Tomatoes, Peppers, Basil</p>
            <Button size="sm" className="w-full mt-2 bg-sbtp-green-500 text-white text-xs">View Details</Button>
          </div>
        )}
      </div>
      
      <div className="absolute top-[45%] right-[35%]">
        <div 
          className="w-6 h-6 bg-sbtp-blue rounded-full border-2 border-white shadow-md cursor-pointer animate-pulse-slow"
          onClick={() => handlePinClick('market1')}
        ></div>
        {activePopup === 'market1' && (
          <div className="absolute bottom-8 left-0 w-60 bg-white rounded-md shadow-lg p-3 z-10">
            <h4 className="font-medium text-sbtp-blue">Union Square Farmers Market</h4>
            <p className="text-xs text-sbtp-brown-500 mt-1">Open Mon, Wed, Fri, Sat (8am-2pm)</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-sbtp-blue/10 text-sbtp-blue">30+ Vendors</Badge>
              <Badge variant="outline" className="text-xs bg-sbtp-blue/10 text-sbtp-blue">Local</Badge>
            </div>
            <p className="text-xs mt-2">Seasonal highlights: Summer berries, Stone fruits</p>
            <Button size="sm" className="w-full mt-2 bg-sbtp-blue text-white text-xs">View Details</Button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-[30%] right-[25%]">
        <div 
          className="w-6 h-6 bg-sbtp-yellow rounded-full border-2 border-white shadow-md cursor-pointer animate-pulse-slow" 
          onClick={() => handlePinClick('garden1')}
        ></div>
        {activePopup === 'garden1' && (
          <div className="absolute bottom-8 left-0 w-60 bg-white rounded-md shadow-lg p-3 z-10">
            <h4 className="font-medium text-sbtp-brown-700">Lower East Side Community Garden</h4>
            <p className="text-xs text-sbtp-brown-500 mt-1">Urban oasis with 20+ community plots</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-sbtp-yellow/20 text-sbtp-brown-700">Community Plots</Badge>
              <Badge variant="outline" className="text-xs bg-sbtp-yellow/20 text-sbtp-brown-700">Education</Badge>
            </div>
            <p className="text-xs mt-2">Workshops every Sunday at 10am</p>
            <Button size="sm" className="w-full mt-2 bg-sbtp-yellow text-sbtp-brown-700 text-xs">View Details</Button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-[40%] left-[30%]">
        <div 
          className="w-6 h-6 bg-sbtp-brown-300 rounded-full border-2 border-white shadow-md cursor-pointer animate-pulse-slow"
          onClick={() => handlePinClick('urbanfarm1')}
        ></div>
        {activePopup === 'urbanfarm1' && (
          <div className="absolute bottom-8 left-0 w-60 bg-white rounded-md shadow-lg p-3 z-10">
            <h4 className="font-medium text-sbtp-brown-500">Rooftop Growing Collective</h4>
            <p className="text-xs text-sbtp-brown-500 mt-1">Rooftop farm with innovative growing methods</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-sbtp-brown-300/20 text-sbtp-brown-500">Hydroponics</Badge>
              <Badge variant="outline" className="text-xs bg-sbtp-brown-300/20 text-sbtp-brown-500">Vertical Farming</Badge>
            </div>
            <p className="text-xs mt-2">Tours available by appointment</p>
            <Button size="sm" className="w-full mt-2 bg-sbtp-brown-300 text-white text-xs">View Details</Button>
          </div>
        )}
      </div>
      
      <div className="absolute top-[35%] right-[20%]">
        <div 
          className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-pointer animate-pulse-slow"
          onClick={() => handlePinClick('business1')}
        ></div>
        {activePopup === 'business1' && (
          <div className="absolute bottom-8 left-0 w-60 bg-white rounded-md shadow-lg p-3 z-10">
            <h4 className="font-medium text-purple-700">Local Harvest Café</h4>
            <p className="text-xs text-sbtp-brown-500 mt-1">Farm-to-table café sourcing within 100 miles</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">Café</Badge>
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">Local-sourced</Badge>
            </div>
            <p className="text-xs mt-2">Open 7am-8pm daily</p>
            <Button size="sm" className="w-full mt-2 bg-purple-500 text-white text-xs">View Details</Button>
          </div>
        )}
      </div>
      
      {/* Seasonal crop area overlay */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-sbtp-green-400 rounded-full opacity-30 bg-sbtp-green-200/20"></div>
      
      {/* Historical indigenous crop area overlay */}
      <div className="absolute top-1/5 left-1/5 w-3/5 h-2/5 border-2 border-dashed border-sbtp-brown-500 rounded-full opacity-30 bg-sbtp-brown-300/10"></div>
      
      {/* Manhattan label */}
      <div className="absolute bottom-8 right-8">
        <Badge className="bg-white text-sbtp-brown-700 border border-sbtp-green-200">Manhattan, NYC</Badge>
      </div>
    </div>
  );
};

// Enhanced Filter component for the map
const MapFilters = () => {
  const [currentTab, setCurrentTab] = useState('current');
  const [showRadius, setShowRadius] = useState(false);
  const [searchRadius, setSearchRadius] = useState([5]);
  const [viewType, setViewType] = useState("map");
  
  // Add form context using react-hook-form
  const form = useForm({
    defaultValues: {
      search_radius: [5],
    }
  });
  
  return (
    <Card className="border-sbtp-green-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sbtp-green-800">Map Filters</h3>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sbtp-brown-500">
            <Filter className="h-4 w-4" /> Reset
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sbtp-brown-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search Manhattan, NYC..."
            className="w-full pl-10 pr-4 py-2 border border-sbtp-green-200 rounded-md focus:ring-1 focus:ring-sbtp-green-300 focus:border-sbtp-green-300"
          />
        </div>

        <div className="mb-4">
          <Label className="text-sbtp-brown-700 mb-2 block">View</Label>
          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value)} className="justify-stretch border rounded-md bg-white p-1">
            <ToggleGroupItem value="map" className="data-[state=on]:bg-sbtp-green-500 data-[state=on]:text-white flex-1 text-xs">
              <MapIcon className="h-3 w-3 mr-1" /> Map
            </ToggleGroupItem>
            <ToggleGroupItem value="satellite" className="data-[state=on]:bg-sbtp-green-500 data-[state=on]:text-white flex-1 text-xs">
              Satellite
            </ToggleGroupItem>
            <ToggleGroupItem value="terrain" className="data-[state=on]:bg-sbtp-green-500 data-[state=on]:text-white flex-1 text-xs">
              Terrain
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="radius" className="text-sbtp-brown-700">Search Radius</Label>
            <Badge variant="outline" className="text-xs">{searchRadius[0]} miles</Badge>
          </div>
          <div className="px-1">
            <Form {...form}>
              <FormField
                control={form.control}
                name="search_radius"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Slider
                        value={searchRadius}
                        min={1}
                        max={25}
                        step={1}
                        onValueChange={(value) => {
                          setSearchRadius(value);
                          field.onChange(value);
                        }}
                        className="[&>span]:bg-sbtp-green-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="show-radius" className="text-sbtp-brown-700">Show Radius on Map</Label>
          <Switch id="show-radius" checked={showRadius} onCheckedChange={setShowRadius} />
        </div>
        
        <Tabs defaultValue="current" onValueChange={setCurrentTab} className="mt-6">
          <TabsList className="bg-sbtp-green-100 w-full">
            <TabsTrigger value="current" className="flex-1 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-1" /> Current Season
            </TabsTrigger>
            <TabsTrigger value="historical" className="flex-1 data-[state=active]:bg-sbtp-green-500 data-[state=active]:text-white">
              <Leaf className="h-4 w-4 mr-1" /> Historical
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
                    <SelectItem value="spring">Spring (Mar-May)</SelectItem>
                    <SelectItem value="summer">Summer (Jun-Aug)</SelectItem>
                    <SelectItem value="fall">Fall (Sep-Nov)</SelectItem>
                    <SelectItem value="winter">Winter (Dec-Feb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="crops" className="text-sbtp-brown-700">Crop Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="crops" className="bg-white">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="herbs">Herbs & Spices</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="growing-method" className="text-sbtp-brown-700">Growing Method</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="growing-method" className="bg-white">
                    <SelectValue placeholder="Select growing method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="conventional">Conventional</SelectItem>
                    <SelectItem value="hydroponic">Hydroponic</SelectItem>
                    <SelectItem value="aquaponic">Aquaponic</SelectItem>
                    <SelectItem value="vertical">Vertical Farming</SelectItem>
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
                <Label htmlFor="time-period" className="text-sbtp-brown-700">Time Period</Label>
                <Select defaultValue="pre-colonial">
                  <SelectTrigger id="time-period" className="bg-white">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-colonial">Pre-Colonial (before 1600s)</SelectItem>
                    <SelectItem value="early-colonial">Early Colonial (1600s-1700s)</SelectItem>
                    <SelectItem value="pre-industrial">Pre-Industrial (1800s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="indigenous-region" className="text-sbtp-brown-700">Indigenous Region</Label>
                <Select defaultValue="lenape">
                  <SelectTrigger id="indigenous-region" className="bg-white">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lenape">Lenape (Manhattan)</SelectItem>
                    <SelectItem value="northeast-woodlands">Northeast Woodlands</SelectItem>
                    <SelectItem value="haudenosaunee">Haudenosaunee (Iroquois)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="crop-category" className="text-sbtp-brown-700">Crop Category</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="crop-category" className="bg-white">
                    <SelectValue placeholder="Select crop category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="three-sisters">Three Sisters (Corn, Beans, Squash)</SelectItem>
                    <SelectItem value="wild-plants">Wild Edible Plants</SelectItem>
                    <SelectItem value="medicinals">Medicinal Plants</SelectItem>
                    <SelectItem value="nuts-berries">Nuts & Berries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 border-t border-sbtp-green-200 pt-4 mt-4">
          <h4 className="font-medium text-sbtp-green-800 mb-2">Show on Map:</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="farms" className="text-sbtp-brown-700 cursor-pointer flex items-center gap-2">
              <TreeDeciduous className="h-4 w-4 text-sbtp-green-500" /> Farms
            </Label>
            <Switch id="farms" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="farmers-markets" className="text-sbtp-brown-700 cursor-pointer flex items-center gap-2">
              <Store className="h-4 w-4 text-sbtp-blue" /> Farmers Markets
            </Label>
            <Switch id="farmers-markets" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="community-gardens" className="text-sbtp-brown-700 cursor-pointer flex items-center gap-2">
              <Leaf className="h-4 w-4 text-sbtp-yellow" /> Community Gardens
            </Label>
            <Switch id="community-gardens" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="urban-farms" className="text-sbtp-brown-700 cursor-pointer flex items-center gap-2">
              <Building2 className="h-4 w-4 text-sbtp-brown-300" /> Urban Farms
            </Label>
            <Switch id="urban-farms" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="local-businesses" className="text-sbtp-brown-700 cursor-pointer flex items-center gap-2">
              <ShoppingBasket className="h-4 w-4 text-purple-500" /> Local Food Businesses
            </Label>
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
