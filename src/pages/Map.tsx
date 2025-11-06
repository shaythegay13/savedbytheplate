
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Filter, MoreVertical, Share, Heart, Eye, Layers, Settings, Menu, MessageSquarePlus, Database } from 'lucide-react';
import CSVImportButton from "@/components/admin/CSVImportButton";
import MapComponent from "@/components/map/MapComponent";
import MapImprovementForm from "@/components/map/MapImprovementForm";
import AddLocationForm from "@/components/map/AddLocationForm";
import UnifiedMapLegend from "@/components/map/UnifiedMapLegend";
import { fetchEnhancedMapData, categorizeLocations } from "@/services/enhancedMapDataService";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const Map = () => {
  const [locationCounts, setLocationCounts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [improvementFormOpen, setImprovementFormOpen] = useState(false);
  const [addLocationFormOpen, setAddLocationFormOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['garden', 'market', 'fridge', 'foodbank', 'farm', 'urbanfarm', 'business', 'csa']));
  const [showOpenNow, setShowOpenNow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  // Fetch data to get location counts for the legend
  useEffect(() => {
    const loadCounts = async () => {
      try {
        setLoading(true);
        
        // Build filters object
        const filters = {
          search: searchQuery || undefined,
          types: activeFilters.size > 0 ? Array.from(activeFilters) : undefined,
        };
        
        const locations = await fetchEnhancedMapData(filters);
        const categorized = categorizeLocations(locations);
        
        console.log('📊 Location counts calculated:', {
          gardens: categorized.gardens.length,
          markets: categorized.markets.length,
          fridges: categorized.fridges.length,
          foodbanks: categorized.foodbanks.length,
          farms: categorized.farms.length,
          urbanfarms: categorized.urbanfarms.length,
          businesses: categorized.businesses.length
        });
        
        setLocationCounts({
          gardens: categorized.gardens.length,
          markets: categorized.markets.length,
          fridges: categorized.fridges.length,
          foodbanks: categorized.foodbanks.length,
          farms: categorized.farms.length,
          urbanfarms: categorized.urbanfarms.length,
          businesses: categorized.businesses.length,
          csas: categorized.csas?.length || 0
        });
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading location counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
    
    // Reload counts every 30 seconds to catch any new data
    const interval = setInterval(loadCounts, 30000);
    
    return () => clearInterval(interval);
  }, [searchQuery, activeFilters]);
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
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-sbtp-green-200 rounded-lg focus:ring-2 focus:ring-sbtp-green-300 focus:border-sbtp-green-300 text-sm"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Open Now Filter */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="open-now-mobile" className="text-sbtp-brown-700">Only Show Open Now</Label>
                            <Switch 
                              id="open-now-mobile" 
                              checked={showOpenNow} 
                              onCheckedChange={setShowOpenNow}
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

              {/* Legend */}
              <UnifiedMapLegend 
                locationCounts={locationCounts} 
                isLoading={loading}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
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
      <div className="flex h-[calc(100vh-200px)]">
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-sbtp-green-200 rounded-lg focus:ring-2 focus:ring-sbtp-green-300 focus:border-sbtp-green-300 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Open Now Filter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="open-now-desktop" className="text-sbtp-brown-700">Only Show Open Now</Label>
                    <Switch 
                      id="open-now-desktop" 
                      checked={showOpenNow} 
                      onCheckedChange={setShowOpenNow}
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

              {/* Legend */}
              <UnifiedMapLegend 
                locationCounts={locationCounts} 
                isLoading={loading}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />

              {/* CSV Import (Admin Feature) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CSVImportButton />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapComponent activeFilters={activeFilters} showOpenNow={showOpenNow} />

          {/* Action Buttons - Top Left */}
          <div className="absolute top-4 left-4 flex gap-3">
            <Button 
              onClick={() => setAddLocationFormOpen(true)}
              className="bg-sbtp-green-600 hover:bg-sbtp-green-700 text-white shadow-lg"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Add Location
            </Button>
            <Button 
              variant="outline"
              onClick={() => setImprovementFormOpen(true)}
              className="bg-white border-sbtp-green-300 text-sbtp-green-700 shadow-lg hover:bg-sbtp-green-50"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Suggestion Box
            </Button>
          </div>
        </div>
      </div>

      {/* Map Improvement Form Modal */}
      <MapImprovementForm 
        open={improvementFormOpen} 
        onOpenChange={setImprovementFormOpen} 
      />

      {/* Add Location Form Modal */}
      <AddLocationForm 
        open={addLocationFormOpen} 
        onOpenChange={setAddLocationFormOpen} 
      />
    </div>
  );
};

export default Map;
