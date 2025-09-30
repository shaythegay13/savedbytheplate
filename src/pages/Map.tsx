
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Search, Filter, MoreVertical, Share, Heart, Eye, Layers, Settings, Menu } from 'lucide-react';
import MapComponent from "@/components/map/MapComponent";
import MapFilters from "@/components/map/MapFilters";
import UnifiedMapLegend from "@/components/map/UnifiedMapLegend";
import { fetchEnhancedMapData, categorizeLocations } from "@/services/enhancedMapDataService";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const Map = () => {
  const [locationCounts, setLocationCounts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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
          businesses: categorized.businesses.length,
          csas: 0 // Will be populated when you add the data
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Enhanced Header */}
      <div className="bg-white border-b border-sbtp-green-200">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
                    <div className="p-4 space-y-6">
                      {/* Quick Search */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sbtp-brown-400 h-4 w-4" />
                            <input
                              type="text"
                              placeholder="Search locations, neighborhoods..."
                              className="w-full pl-10 pr-4 py-3 border border-sbtp-green-200 rounded-lg focus:ring-2 focus:ring-sbtp-green-300 focus:border-sbtp-green-300 text-sm"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Stats */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-sbtp-green-800 flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Quick Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-sbtp-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-sbtp-green-700">
                                {!loading && locationCounts ? locationCounts.gardens + locationCounts.farms + locationCounts.urbanfarms : '...'}
                              </div>
                              <div className="text-xs text-sbtp-brown-500">Growing Spaces</div>
                            </div>
                            <div className="text-center p-3 bg-sbtp-yellow/20 rounded-lg">
                              <div className="text-2xl font-bold text-sbtp-brown-700">
                                {!loading && locationCounts ? locationCounts.markets : '...'}
                              </div>
                              <div className="text-xs text-sbtp-brown-500">Markets</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-700">
                                {!loading && locationCounts ? locationCounts.fridges : '...'}
                              </div>
                              <div className="text-xs text-sbtp-brown-500">Free Fridges</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-700">
                                {!loading && locationCounts ? locationCounts.foodbanks : '...'}
                              </div>
                              <div className="text-xs text-sbtp-brown-500">Food Banks</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Map Controls */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-sbtp-green-800 flex items-center gap-2">
                            <Layers className="h-5 w-5" />
                            Map Layers
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-sbtp-brown-700">Show all locations</span>
                              <input type="checkbox" defaultChecked className="rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-sbtp-brown-700">Transit accessibility</span>
                              <input type="checkbox" className="rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-sbtp-brown-700">Walking distance</span>
                              <input type="checkbox" className="rounded" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Filters */}
                      <MapFilters />
                      
                      {/* Legend */}
                      <UnifiedMapLegend locationCounts={locationCounts} isLoading={loading} />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <div className="min-w-0 flex-1">
                <h1 className={`${isMobile ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'} font-bold text-sbtp-green-800 mb-1 sm:mb-2 truncate`}>Local Food Access Map</h1>
                <p className="text-sbtp-brown-500 text-xs sm:text-sm md:text-base">
                  {!loading && locationCounts ? 
                    `Showing ${Object.values(locationCounts).reduce((a: number, b: number) => a + b, 0)} verified locations in your area` : 
                    'Loading food access locations in your area'}
                </p>
              </div>
            </div>
            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2 sm:gap-3'} flex-shrink-0`}>
              <Button variant="outline" size="sm" className={`${isMobile ? 'px-2 min-w-0' : 'flex items-center gap-2'}`}>
                <Share className="h-4 w-4" />
                {!isMobile && <span className="hidden sm:inline">Share Map</span>}
              </Button>
              <Button variant="outline" size="sm" className={`${isMobile ? 'px-2 min-w-0' : 'flex items-center gap-2'}`}>
                <Heart className="h-4 w-4" />
                {!isMobile && <span className="hidden sm:inline">Save</span>}
              </Button>
              <Button variant="outline" size="sm" className="px-2 min-w-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Map Layout */}
      <div className={`flex ${isMobile ? 'flex-col' : ''} h-[calc(100vh-200px)]`}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-white border-r border-sbtp-green-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Quick Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sbtp-brown-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search locations, neighborhoods..."
                      className="w-full pl-10 pr-4 py-3 border border-sbtp-green-200 rounded-lg focus:ring-2 focus:ring-sbtp-green-300 focus:border-sbtp-green-300 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-sbtp-green-800 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Quick Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-sbtp-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-sbtp-green-700">
                        {!loading && locationCounts ? locationCounts.gardens + locationCounts.farms + locationCounts.urbanfarms : '...'}
                      </div>
                      <div className="text-xs text-sbtp-brown-500">Growing Spaces</div>
                    </div>
                    <div className="text-center p-3 bg-sbtp-yellow/20 rounded-lg">
                      <div className="text-2xl font-bold text-sbtp-brown-700">
                        {!loading && locationCounts ? locationCounts.markets : '...'}
                      </div>
                      <div className="text-xs text-sbtp-brown-500">Markets</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">
                        {!loading && locationCounts ? locationCounts.fridges : '...'}
                      </div>
                      <div className="text-xs text-sbtp-brown-500">Free Fridges</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">
                        {!loading && locationCounts ? locationCounts.foodbanks : '...'}
                      </div>
                      <div className="text-xs text-sbtp-brown-500">Food Banks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Controls */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-sbtp-green-800 flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Map Layers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sbtp-brown-700">Show all locations</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sbtp-brown-700">Transit accessibility</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sbtp-brown-700">Walking distance</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <MapFilters />
              
              {/* Legend */}
              <UnifiedMapLegend locationCounts={locationCounts} isLoading={loading} />
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapComponent />
          
          {/* Map Overlay Controls */}
          <div className={`absolute ${isMobile ? 'top-4 right-4' : 'top-20 right-4'} flex flex-col gap-2`}>
            <Button size="sm" variant="outline" className="bg-white shadow-md">
              <Settings className="h-4 w-4" />
            </Button>
            {!isMobile && (
              <Button size="sm" variant="outline" className="bg-white shadow-md">
                <Filter className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className={`absolute bottom-4 ${isMobile ? 'left-4 right-4' : 'left-4 right-20'}`}>
            <div className="bg-white rounded-lg shadow-lg border border-sbtp-green-200 p-4">
              <div className={`flex items-center ${isMobile ? 'justify-center gap-2' : 'justify-between'}`}>
                <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
                  <Button className={`bg-sbtp-green-600 hover:bg-sbtp-green-700 text-white ${isMobile ? 'text-sm px-3' : ''}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {isMobile ? 'Add' : 'Add Location'}
                  </Button>
                  <Button variant="outline" className={`border-sbtp-green-300 text-sbtp-green-700 ${isMobile ? 'text-sm px-3' : ''}`}>
                    {isMobile ? 'Report' : 'Report Issue'}
                  </Button>
                </div>
                {!isMobile && (
                  <div className="text-sm text-sbtp-brown-500">
                    Last updated: Today
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
