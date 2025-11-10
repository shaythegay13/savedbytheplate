import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Search, Menu, Info, AlertTriangle } from 'lucide-react';
import ForagingMapComponent from "@/components/map/ForagingMapComponent";
import { mockForagingLocations, foragingColors } from "@/data/mockForagingData";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const ForagingTest = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['herb', 'berry', 'fruit', 'green', 'nut']));
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const toggleFilter = (type: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveFilters(newFilters);
  };

  const filterCounts = {
    herb: mockForagingLocations.filter(l => l.type === 'herb').length,
    berry: mockForagingLocations.filter(l => l.type === 'berry').length,
    fruit: mockForagingLocations.filter(l => l.type === 'fruit').length,
    green: mockForagingLocations.filter(l => l.type === 'green').length,
    nut: mockForagingLocations.filter(l => l.type === 'nut').length,
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-800 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Urban Foraging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-green-700">
            Discover edible wild plants growing in your neighborhood. Urban foraging connects you with nature and free, nutritious food.
          </p>
          <div className="bg-white/60 p-3 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Safety First:
            </p>
            <ul className="text-xs text-green-700 space-y-1 ml-4 list-disc">
              <li>Always positively identify plants before consuming</li>
              <li>Avoid areas treated with pesticides or near roads</li>
              <li>Start with common, easy-to-identify plants</li>
              <li>Never forage mushrooms without expert guidance</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search foraging locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 text-sm bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Info className="h-5 w-5" />
            Available Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-700">
              {mockForagingLocations.length}
            </div>
            <div className="text-xs text-muted-foreground">Foraging Locations</div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Filter by Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(foragingColors).map(([type, color]) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                activeFilters.has(type) 
                  ? 'bg-accent' 
                  : 'bg-muted/50 opacity-50'
              } hover:bg-accent/80`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium text-sm capitalize text-foreground">{type}s</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {filterCounts[type as keyof typeof filterCounts]}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Test Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <p className="text-xs text-amber-800">
            <strong>🧪 Test Page:</strong> This is a prototype for UI/UX testing. Data is mock and for demonstration purposes only.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 border-b border-green-700">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
                    <div className="p-4">
                      <SidebarContent />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <div className="min-w-0 flex-1">
                <h1 className={`${isMobile ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'} font-bold text-white mb-1 sm:mb-2 truncate flex items-center gap-2`}>
                  <Leaf className="h-6 w-6" />
                  Foraging Map
                </h1>
                <p className="text-green-100 text-xs sm:text-sm md:text-base">
                  {mockForagingLocations.length} wild edible plants available for urban foraging
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className="bg-amber-500 text-white border-amber-600">
                PROTOTYPE
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Map Layout */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-background border-r border-border overflow-y-auto">
            <div className="p-4">
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <ForagingMapComponent 
            locations={mockForagingLocations}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ForagingTest;
