import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, MapPin, Users } from "lucide-react";

interface FridgeData {
  name: string;
  address: string;
  organization: string;
  contact: string;
  latitude?: number;
  longitude?: number;
}

interface ResearchResult {
  fridges: FridgeData[];
  totalFound: number;
  byBorough: Record<string, number>;
  sources: string[];
}

export const FridgeResearchTool = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
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
      const queries = [
        "List all currently active community fridges in New York City 2024 with exact addresses",
        "NYC community fridges Brooklyn Bronx Manhattan Queens active 2024 locations",
        "mutual aid community fridges New York City current operating addresses",
        "community fridge networks NYC 2024 Bed-Stuy Crown Heights Bushwick active",
        "NYC community refrigerators food access 2024 Washington Heights Harlem active"
      ];

      const allFridges: FridgeData[] = [];
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
                content: 'You are a comprehensive researcher. Provide specific, accurate information about community fridges including exact names, addresses, organizations, and contact information. Format as JSON array with objects containing: name, address, organization, contact.'
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
          
          // Parse response to extract fridge data
          const parsedFridges = parseResearchResponse(content);
          allFridges.push(...parsedFridges);
        }

        queryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
      }

      // Process and deduplicate results
      const uniqueFridges = deduplicateFridges(allFridges);
      const byBorough = countByBorough(uniqueFridges);

      setResearchResult({
        fridges: uniqueFridges,
        totalFound: uniqueFridges.length,
        byBorough,
        sources: ['Perplexity AI Research', 'Current Web Data', 'Community Networks']
      });

      setProgress(100);

      toast({
        title: "Research Complete",
        description: `Found ${uniqueFridges.length} active community fridges`,
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

  const parseResearchResponse = (content: string): FridgeData[] => {
    const fridges: FridgeData[] = [];
    
    // Try to extract JSON first
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item.name && item.address);
        }
      }
    } catch (e) {
      // Fall back to text parsing
    }

    // Text parsing fallback
    const lines = content.split('\n');
    let currentFridge: Partial<FridgeData> = {};

    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) {
        if (currentFridge.name && currentFridge.address) {
          fridges.push(currentFridge as FridgeData);
        }
        currentFridge = {};
        continue;
      }

      // Look for fridge names
      if (cleanLine.match(/^\d+\.|\*|\-/) && (cleanLine.toLowerCase().includes('fridge') || cleanLine.toLowerCase().includes('community'))) {
        if (currentFridge.name && currentFridge.address) {
          fridges.push(currentFridge as FridgeData);
        }
        currentFridge = { name: cleanLine.replace(/^\d+\.|\*|\-/, '').trim() };
      }
      // Look for addresses
      else if (cleanLine.match(/\d+.*(?:street|st|avenue|ave|road|rd|drive|dr|place|pl|blvd|boulevard)/i)) {
        currentFridge.address = cleanLine;
      }
      // Look for contact info
      else if (cleanLine.includes('@') || cleanLine.toLowerCase().includes('instagram')) {
        currentFridge.contact = cleanLine;
      }
      // Look for organization
      else if (cleanLine.toLowerCase().includes('mutual aid') || cleanLine.toLowerCase().includes('network')) {
        currentFridge.organization = cleanLine;
      }
    }

    // Add the last fridge if valid
    if (currentFridge.name && currentFridge.address) {
      fridges.push(currentFridge as FridgeData);
    }

    return fridges;
  };

  const deduplicateFridges = (fridges: FridgeData[]): FridgeData[] => {
    const seen = new Set<string>();
    return fridges.filter(fridge => {
      const key = `${fridge.name.toLowerCase()}_${fridge.address.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const countByBorough = (fridges: FridgeData[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    
    fridges.forEach(fridge => {
      const address = fridge.address.toLowerCase();
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
      // Parse manual data (expecting JSON format)
      const parsedData = JSON.parse(manualData);
      if (Array.isArray(parsedData)) {
        const byBorough = countByBorough(parsedData);
        setResearchResult({
          fridges: parsedData,
          totalFound: parsedData.length,
          byBorough,
          sources: ['Manual Input']
        });
        
        toast({
          title: "Data Loaded",
          description: `Loaded ${parsedData.length} community fridges from manual input`,
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

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Community Fridge Research Tool
          </CardTitle>
          <CardDescription>
            Research and collect comprehensive data on active NYC community fridges using AI and manual sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  Conducting comprehensive research across multiple sources...
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
              placeholder={`Enter JSON data for community fridges:
[
  {
    "name": "Example Community Fridge",
    "address": "123 Main St, Brooklyn, NY 11201", 
    "organization": "Local Mutual Aid",
    "contact": "@example_fridge"
  }
]`}
              value={manualData}
              onChange={(e) => setManualData(e.target.value)}
              rows={6}
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
              <Users className="h-5 w-5" />
              Research Results
            </CardTitle>
            <CardDescription>
              Comprehensive community fridge data collected from multiple sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{researchResult.totalFound}</div>
                <div className="text-sm text-muted-foreground">Total Fridges Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Object.keys(researchResult.byBorough).length}</div>
                <div className="text-sm text-muted-foreground">Boroughs Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{researchResult.sources.length}</div>
                <div className="text-sm text-muted-foreground">Data Sources</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Distribution by Borough</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(researchResult.byBorough).map(([borough, count]) => (
                  <Badge key={borough} variant="secondary">
                    {borough}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {researchResult.sources.map((source, index) => (
                  <Badge key={index} variant="outline">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Sample Fridges Found</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {researchResult.fridges.slice(0, 10).map((fridge, index) => (
                  <div key={index} className="text-sm border rounded p-2">
                    <div className="font-medium">{fridge.name}</div>
                    <div className="text-muted-foreground">{fridge.address}</div>
                    {fridge.contact && (
                      <div className="text-xs text-primary">{fridge.contact}</div>
                    )}
                  </div>
                ))}
                {researchResult.fridges.length > 10 && (
                  <div className="text-sm text-muted-foreground text-center">
                    ...and {researchResult.fridges.length - 10} more
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={() => {
                // Export data as JSON
                const dataStr = JSON.stringify(researchResult.fridges, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'community_fridges_research.json';
                link.click();
              }}
              className="w-full"
            >
              Export Research Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};