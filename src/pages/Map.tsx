
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Search, Filter, MoreVertical, Share, Heart, Eye, Layers, Settings, Menu, MessageSquarePlus, Database, ChevronDown, BarChart3 } from 'lucide-react';
import CSVImportButton from "@/components/admin/CSVImportButton";
import MapComponent from "@/components/map/MapComponent";
import MapImprovementForm from "@/components/map/MapImprovementForm";
import AddLocationForm from "@/components/map/AddLocationForm";
import UnifiedMapLegend from "@/components/map/UnifiedMapLegend";
import { fetchEnhancedMapData, categorizeLocations } from "@/services/enhancedMapDataService";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

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

  // Swipe gesture to close sidebar
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: closeSidebar,
    threshold: 50,
    velocityThreshold: 0.2,
  });

  // Fetch data to get location counts for the legend with debouncing
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

    // Debounce search query changes
    const timeoutId = setTimeout(() => {
      loadCounts();
    }, searchQuery ? 500 : 0);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeFilters]);
  return (
    <div className="min-h-screen bg-background">
      <title>NYC Food Map — Find Local Food Resources Near You | Saved by the Plate</title>
      <meta name="description" content="Interactive map of community gardens, farmers markets, food banks, community fridges, and urban farms across New York City." />
      <link rel="canonical" href="https://www.savedbytheplate.org/local-food/map" />
      <meta property="og:title" content="NYC Food Map | Saved by the Plate" />
      <meta property="og:url" content="https://www.savedbytheplate.org/local-food/map" />
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
                  <SheetContent 
                    side="left" 
                    className="w-[85vw] max-w-sm p-0 overflow-y-auto"
                    onTouchStart={swipeHandlers.onTouchStart}
                    onTouchEnd={swipeHandlers.onTouchEnd}
                  >
                    {/* Swipe indicator */}
                    <div className="flex justify-center pt-2 pb-1">
                      <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                    
                    <SheetHeader className="px-4 pb-4 border-b bg-sbtp-green-50">
                      <SheetTitle className="text-sbtp-green-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Filter className="h-5 w-5" />
                          Map Controls
                        </div>
                        <span className="text-xs font-normal text-muted-foreground">Swipe left to close</span>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <div className="p-4 space-y-4">
                      {/* Search - Always visible */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sbtp-brown-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Search locations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-sbtp-green-200 rounded-lg focus:ring-2 focus:ring-sbtp-green-300 focus:border-sbtp-green-300 text-base"
                        />
                      </div>

                      {/* Open Now Filter - Touch friendly */}
                      <button
                        onClick={() => setShowOpenNow(!showOpenNow)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                          showOpenNow 
                            ? 'bg-sbtp-green-50 border-sbtp-green-300' 
                            : 'bg-background border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-sbtp-green-600" />
                          <span className="font-medium text-sbtp-brown-700">Only Show Open Now</span>
                        </div>
                        <Switch 
                          id="open-now-mobile" 
                          checked={showOpenNow} 
                          onCheckedChange={setShowOpenNow}
                        />
                      </button>

                      {/* Quick Stats - Collapsible */}
                      <Collapsible defaultOpen={false}>
                        <Card>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                              <CardTitle className="text-base text-sbtp-green-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="h-5 w-5" />
                                  Quick Overview
                                </div>
                                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                              </CardTitle>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0 pb-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-4 bg-sbtp-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-sbtp-green-700">
                                    {!loading && locationCounts ? locationCounts.gardens + locationCounts.farms + locationCounts.urbanfarms : '...'}
                                  </div>
                                  <div className="text-sm text-sbtp-brown-500">Growing Spaces</div>
                                </div>
                                <div className="text-center p-4 bg-sbtp-yellow/20 rounded-lg">
                                  <div className="text-2xl font-bold text-sbtp-brown-700">
                                    {!loading && locationCounts ? locationCounts.markets : '...'}
                                  </div>
                                  <div className="text-sm text-sbtp-brown-500">Markets</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-700">
                                    {!loading && locationCounts ? locationCounts.fridges : '...'}
                                  </div>
                                  <div className="text-sm text-sbtp-brown-500">Free Fridges</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-700">
                                    {!loading && locationCounts ? locationCounts.foodbanks : '...'}
                                  </div>
                                  <div className="text-sm text-sbtp-brown-500">Food Banks</div>
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>

                      {/* Legend - Already collapsible */}
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
      <div className={`flex ${isMobile ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-180px)]'}`}>
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
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapComponent activeFilters={activeFilters} showOpenNow={showOpenNow} />

          {/* Action Buttons - Top Left */}
          <div className={`absolute top-3 left-3 flex ${isMobile ? 'flex-col gap-2' : 'gap-3'}`}>
            <Button 
              onClick={() => setAddLocationFormOpen(true)}
              size={isMobile ? 'sm' : 'default'}
              className="bg-sbtp-green-600 hover:bg-sbtp-green-700 text-white shadow-lg"
            >
              <MapPin className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Add Location</span>}
            </Button>
            <Button 
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              onClick={() => setImprovementFormOpen(true)}
              className="bg-white border-sbtp-green-300 text-sbtp-green-700 shadow-lg hover:bg-sbtp-green-50"
            >
              <MessageSquarePlus className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Suggestion Box</span>}
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
