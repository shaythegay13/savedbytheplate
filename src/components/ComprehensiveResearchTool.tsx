import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, MapPin, Users, Search, Download } from "lucide-react";

type LocationType = 
  | 'community_gardens' 
  | 'farms' 
  | 'farmers_markets' 
  | 'urban_farms' 
  | 'community_fridges' 
  | 'food_banks' 
  | 'local_businesses'
  | 'all';

interface LocationData {
  name: string;
  address: string;
  type: string;
  organization?: string;
  contact?: string;
  hours?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  additionalInfo?: string;
}

interface ResearchResult {
  locations: LocationData[];
  totalFound: number;
  byType: Record<string, number>;
  byBorough: Record<string, number>;
  sources: string[];
}

const LOCATION_TYPES = {
  community_gardens: 'Community Gardens',
  farms: 'Farms & Agricultural Sites',
  farmers_markets: 'Farmers Markets',
  urban_farms: 'Urban Farms',
  community_fridges: 'Community Fridges',
  food_banks: 'Food Banks & Pantries',
  local_businesses: 'Local Source Businesses',
  all: 'All Food Access Points'
};

const generateQueries = (locationType: LocationType): string[] => {
  const baseQueries = {
    community_gardens: [
      "List all active community gardens in New York City 2024 with exact addresses",
      "NYC community gardens Brooklyn Manhattan Queens Bronx active locations 2024",
      "GreenThumb community gardens New York City current operating addresses",
      "NYC neighborhood community gardens active December 2024 with contact info"
    ],
    farms: [
      "List all active farms and agricultural sites in New York City 2024 with addresses",
      "NYC urban agriculture farms Brooklyn Queens Bronx active 2024",
      "New York City farming operations rooftop farms community supported agriculture",
      "NYC agricultural sites community farms active December 2024"
    ],
    farmers_markets: [
      "List all active farmers markets in New York City 2024 with exact locations and schedules",
      "NYC farmers markets Brooklyn Manhattan Queens Bronx active winter 2024",
      "GrowNYC farmers markets New York City current operating locations",
      "NYC neighborhood farmers markets active December 2024 hours contact"
    ],
    urban_farms: [
      "List all urban farms and rooftop farms in New York City 2024 with addresses",
      "NYC urban agriculture rooftop farms vertical farms active 2024",
      "New York City hydroponic farms indoor growing facilities",
      "NYC urban farming operations community supported agriculture 2024"
    ],
    community_fridges: [
      "List all currently active community fridges in New York City 2024 with exact addresses",
      "NYC community fridges Brooklyn Bronx Manhattan Queens active 2024 locations",
      "mutual aid community fridges New York City current operating addresses",
      "community fridge networks NYC 2024 Bed-Stuy Crown Heights Bushwick active"
    ],
    food_banks: [
      "List all active food banks and food pantries in New York City 2024 with addresses",
      "NYC food pantries food banks Brooklyn Queens Manhattan Bronx active 2024",
      "New York City food assistance programs emergency food providers",
      "NYC food distribution sites active December 2024 hours contact info"
    ],
    local_businesses: [
      "List restaurants and businesses in NYC that source locally from farms 2024",
      "NYC restaurants farm-to-table local sourcing Brooklyn Manhattan Queens",
      "New York City grocery stores markets local food sourcing partnerships",
      "NYC businesses supporting local agriculture community supported agriculture"
    ],
    all: [
      "Comprehensive list of all food access points in New York City 2024: community gardens, farms, farmers markets, food banks, community fridges",
      "NYC food security infrastructure: gardens, farms, markets, pantries, fridges with addresses 2024",
      "New York City food system locations: urban agriculture, food assistance, community food access",
      "NYC sustainable food network: local farms, community resources, food access points 2024"
    ]
  };

  return baseQueries[locationType] || baseQueries.all;
};

export const ComprehensiveResearchTool = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [selectedType, setSelectedType] = useState<LocationType>('all');
  const [isResearching, setIsResearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [manualData, setManualData] = useState('');

  const handlePerplexityResearch = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to conduct research",
        variant: "destructive",
      });
      return;
    }

    setIsResearching(true);
    setProgress(0);
    setResearchResult(null);

    try {
      const queries = generateQueries(selectedType);
      const allLocations: LocationData[] = [];
      let queryCount = 0;

      for (const query of queries) {
        setProgress((queryCount / queries.length) * 100);
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [
              {
                role: 'system',
                content: `You are a comprehensive researcher for NYC food access points. Provide specific, accurate information including exact names, addresses, organizations, contact information, hours, and websites. Format as JSON array with objects containing: name, address, type, organization, contact, hours, website, additionalInfo. Focus on currently active locations in 2024.`
              },
              {
                role: 'user',
                content: query
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            max_tokens: 2000,
            return_images: false,
            return_related_questions: false,
            search_recency_filter: 'month'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          
          const parsedLocations = parseResearchResponse(content, selectedType);
          allLocations.push(...parsedLocations);
        }

        queryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
      }

      // Process and deduplicate results
      const uniqueLocations = deduplicateLocations(allLocations);
      const byType = countByType(uniqueLocations);
      const byBorough = countByBorough(uniqueLocations);

      setResearchResult({
        locations: uniqueLocations,
        totalFound: uniqueLocations.length,
        byType,
        byBorough,
        sources: ['Perplexity AI Research', 'Current Web Data', 'Community Networks', 'Municipal Databases']
      });

      setProgress(100);

      toast({
        title: "Research Complete",
        description: `Found ${uniqueLocations.length} active ${LOCATION_TYPES[selectedType].toLowerCase()}`,
      });

    } catch (error) {
      console.error('Research error:', error);
      toast({
        title: "Research Failed",
        description: "Failed to conduct research. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsResearching(false);
    }
  };

  const parseResearchResponse = (content: string, type: LocationType): LocationData[] => {
    const locations: LocationData[] = [];
    
    // Try to extract JSON first
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item.name && item.address).map(item => ({
            ...item,
            type: item.type || inferType(item.name, type)
          }));
        }
      }
    } catch (e) {
      // Fall back to text parsing
    }

    // Text parsing fallback
    const lines = content.split('\n');
    let currentLocation: Partial<LocationData> = {};

    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) {
        if (currentLocation.name && currentLocation.address) {
          locations.push({
            ...currentLocation,
            type: currentLocation.type || inferType(currentLocation.name || '', type)
          } as LocationData);
        }
        currentLocation = {};
        continue;
      }

      // Look for location names
      if (cleanLine.match(/^\d+\.|\*|\-/) || cleanLine.match(/^[A-Z][^.]*$/)) {
        if (currentLocation.name && currentLocation.address) {
          locations.push({
            ...currentLocation,
            type: currentLocation.type || inferType(currentLocation.name || '', type)
          } as LocationData);
        }
        currentLocation = { 
          name: cleanLine.replace(/^\d+\.|\*|\-/, '').trim(),
          type: inferType(cleanLine, type)
        };
      }
      // Look for addresses
      else if (cleanLine.match(/\d+.*(?:street|st|avenue|ave|road|rd|drive|dr|place|pl|blvd|boulevard)/i)) {
        currentLocation.address = cleanLine;
      }
      // Look for contact info
      else if (cleanLine.includes('@') || cleanLine.toLowerCase().includes('instagram') || cleanLine.toLowerCase().includes('phone')) {
        currentLocation.contact = cleanLine;
      }
      // Look for hours
      else if (cleanLine.toLowerCase().includes('hours') || cleanLine.match(/\d+\s*(?:am|pm)/i)) {
        currentLocation.hours = cleanLine;
      }
      // Look for websites
      else if (cleanLine.toLowerCase().includes('http') || cleanLine.includes('.com') || cleanLine.includes('.org')) {
        currentLocation.website = cleanLine;
      }
      // Look for organization
      else if (cleanLine.toLowerCase().includes('network') || cleanLine.toLowerCase().includes('organization')) {
        currentLocation.organization = cleanLine;
      }
    }

    // Add the last location if valid
    if (currentLocation.name && currentLocation.address) {
      locations.push({
        ...currentLocation,
        type: currentLocation.type || inferType(currentLocation.name || '', type)
      } as LocationData);
    }

    return locations;
  };

  const inferType = (name: string, selectedType: LocationType): string => {
    const nameLower = name.toLowerCase();
    
    if (selectedType !== 'all') {
      return LOCATION_TYPES[selectedType];
    }

    // Infer type from name
    if (nameLower.includes('garden')) return 'Community Garden';
    if (nameLower.includes('farm')) return 'Farm';
    if (nameLower.includes('market')) return 'Farmers Market';
    if (nameLower.includes('fridge') || nameLower.includes('refrigerator')) return 'Community Fridge';
    if (nameLower.includes('food bank') || nameLower.includes('pantry')) return 'Food Bank';
    if (nameLower.includes('restaurant') || nameLower.includes('cafe')) return 'Local Business';
    
    return 'Food Access Point';
  };

  const deduplicateLocations = (locations: LocationData[]): LocationData[] => {
    const seen = new Set<string>();
    return locations.filter(location => {
      const key = `${location.name.toLowerCase()}_${location.address.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const countByType = (locations: LocationData[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    locations.forEach(location => {
      counts[location.type] = (counts[location.type] || 0) + 1;
    });
    return counts;
  };

  const countByBorough = (locations: LocationData[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    
    locations.forEach(location => {
      const address = location.address.toLowerCase();
      let borough = 'Other';
      
      if (address.includes('brooklyn')) borough = 'Brooklyn';
      else if (address.includes('bronx')) borough = 'Bronx';
      else if (address.includes('manhattan') || address.includes('new york, ny')) borough = 'Manhattan';
      else if (address.includes('queens')) borough = 'Queens';
      else if (address.includes('staten island')) borough = 'Staten Island';
      
      counts[borough] = (counts[borough] || 0) + 1;
    });
    
    return counts;
  };

  const handleManualSubmit = () => {
    try {
      const parsedData = JSON.parse(manualData);
      if (Array.isArray(parsedData)) {
        const byType = countByType(parsedData);
        const byBorough = countByBorough(parsedData);
        setResearchResult({
          locations: parsedData,
          totalFound: parsedData.length,
          byType,
          byBorough,
          sources: ['Manual Input']
        });
        
        toast({
          title: "Data Loaded",
          description: `Loaded ${parsedData.length} locations from manual input`,
        });
      }
    } catch (error) {
      toast({
        title: "Invalid Data",
        description: "Please enter valid JSON data",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    if (!researchResult) return;
    
    const dataStr = JSON.stringify(researchResult.locations, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nyc_food_access_research_${selectedType}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Comprehensive Food Access Research Tool
          </CardTitle>
          <CardDescription>
            Research and collect comprehensive data on NYC's food access infrastructure using AI-powered web research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Research Type Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Research Target</h3>
            <Select value={selectedType} onValueChange={(value: LocationType) => setSelectedType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select what to research" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOCATION_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Perplexity Research Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">AI-Powered Research</h3>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handlePerplexityResearch}
                disabled={isResearching || !apiKey.trim()}
                className="whitespace-nowrap"
              >
                {isResearching ? "Researching..." : "Start Research"}
              </Button>
            </div>
            
            {isResearching && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">
                  Researching {LOCATION_TYPES[selectedType].toLowerCase()} across multiple sources...
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Get your free Perplexity API key at <a href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer" className="text-primary underline">perplexity.ai</a></span>
            </div>
          </div>

          {/* Manual Data Entry Section */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold">Manual Data Entry</h3>
            <Textarea
              placeholder={`Enter JSON data for locations:
[
  {
    "name": "Example Community Garden",
    "address": "123 Main St, Brooklyn, NY 11201", 
    "type": "Community Garden",
    "organization": "Local Gardeners Network",
    "contact": "@example_garden",
    "hours": "Daily 8am-6pm",
    "website": "example.org"
  }
]`}
              value={manualData}
              onChange={(e) => setManualData(e.target.value)}
              rows={8}
            />
            <Button onClick={handleManualSubmit} variant="outline">
              Load Manual Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {researchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Research Results
            </CardTitle>
            <CardDescription>
              Comprehensive food access data collected from multiple sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{researchResult.totalFound}</div>
                <div className="text-sm text-muted-foreground">Total Locations Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Object.keys(researchResult.byType).length}</div>
                <div className="text-sm text-muted-foreground">Location Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Object.keys(researchResult.byBorough).length}</div>
                <div className="text-sm text-muted-foreground">Boroughs Covered</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Distribution by Type</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(researchResult.byType).map(([type, count]) => (
                  <Badge key={type} variant="secondary">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Distribution by Borough</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(researchResult.byBorough).map(([borough, count]) => (
                  <Badge key={borough} variant="outline">
                    {borough}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Sample Locations Found</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {researchResult.locations.slice(0, 15).map((location, index) => (
                  <div key={index} className="text-sm border rounded p-3">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-muted-foreground">{location.address}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{location.type}</Badge>
                      {location.hours && <Badge variant="secondary" className="text-xs">{location.hours}</Badge>}
                    </div>
                    {location.contact && (
                      <div className="text-xs text-primary mt-1">{location.contact}</div>
                    )}
                  </div>
                ))}
                {researchResult.locations.length > 15 && (
                  <div className="text-sm text-muted-foreground text-center">
                    ...and {researchResult.locations.length - 15} more
                  </div>
                )}
              </div>
            </div>

            <Button onClick={exportData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Research Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};