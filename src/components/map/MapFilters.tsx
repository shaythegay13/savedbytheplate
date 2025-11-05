
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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MapPin, Filter, Leaf, Calendar, Store, Search, TreeDeciduous, Building2, ShoppingBasket, Map as MapIcon, Refrigerator, Building } from 'lucide-react';
import { useForm } from "react-hook-form";

interface MapFiltersProps {
  onOpenNowChange?: (showOpenOnly: boolean) => void;
}

// Enhanced Filter component for the map
const MapFilters = ({ onOpenNowChange }: MapFiltersProps) => {
  const [currentTab, setCurrentTab] = useState('current');
  const [showRadius, setShowRadius] = useState(false);
  const [searchRadius, setSearchRadius] = useState([5]);
  const [viewType, setViewType] = useState("map");
  const [showOpenNow, setShowOpenNow] = useState(false);
  
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

        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="show-open-now" className="text-sbtp-brown-700">Only Show Open Now</Label>
          <Switch 
            id="show-open-now" 
            checked={showOpenNow} 
            onCheckedChange={(checked) => {
              setShowOpenNow(checked);
              onOpenNowChange?.(checked);
            }}
          />
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
        
        <Button className="w-full mt-6 bg-sbtp-green-500 hover:bg-sbtp-green-600">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default MapFilters;
