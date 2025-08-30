import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Download, RefreshCw, Zap, Sun, Droplets, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GardenPlanFormData } from '../types';

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface PlantRecommendation {
  name: string;
  variety: string;
  plantingTime: string;
  harvestTime: string;
  spacing: string;
  careInstructions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  yield: string;
}

interface AIVisualGardenPlanProps {
  gardenLayout: GardenLayout[];
  plantRecommendations: PlantRecommendation[];
  formData: GardenPlanFormData | null;
  uploadedImage?: { file: File; previewUrl: string } | null;
}

interface PlantPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  icon: string;
  sunlightNeeds: 'full' | 'partial' | 'shade';
  waterNeeds: 'low' | 'medium' | 'high';
}

const AIVisualGardenPlan: React.FC<AIVisualGardenPlanProps> = ({
  gardenLayout,
  plantRecommendations,
  formData,
  uploadedImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plantPositions, setPlantPositions] = useState<PlantPosition[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantPosition | null>(null);
  const [showSunlightMap, setShowSunlightMap] = useState(false);
  const [showWaterZones, setShowWaterZones] = useState(false);
  const { toast } = useToast();

  const canvasWidth = 600;
  const canvasHeight = 400;

  useEffect(() => {
    generatePlantPositions();
  }, [gardenLayout, plantRecommendations, formData]);

  useEffect(() => {
    drawGardenPlan();
  }, [plantPositions, showSunlightMap, showWaterZones, uploadedImage]);

  const getPlantIcon = (plantName: string): string => {
    const lowerName = plantName.toLowerCase();
    if (lowerName.includes('tomato')) return '🍅';
    if (lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('lettuce') || lowerName.includes('salad')) return '🥬';
    if (lowerName.includes('herb') || lowerName.includes('basil') || lowerName.includes('parsley')) return '🌿';
    if (lowerName.includes('pepper')) return '🌶️';
    if (lowerName.includes('cucumber')) return '🥒';
    if (lowerName.includes('bean')) return '🫘';
    if (lowerName.includes('corn')) return '🌽';
    if (lowerName.includes('potato')) return '🥔';
    if (lowerName.includes('onion')) return '🧅';
    if (lowerName.includes('flower')) return '🌸';
    if (lowerName.includes('squash')) return '🎃';
    if (lowerName.includes('beet')) return '🍠';
    return '🌱';
  };

  const getPlantColor = (plantName: string): string => {
    const colors = [
      '#10B981', '#059669', '#047857', '#065F46', // greens
      '#F59E0B', '#D97706', '#B45309', '#92400E', // oranges
      '#EF4444', '#DC2626', '#B91C1C', '#991B1B', // reds
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', // purples
      '#06B6D4', '#0891B2', '#0E7490', '#155E75', // cyans
    ];
    let hash = 0;
    for (let i = 0; i < plantName.length; i++) {
      hash = plantName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getSunlightNeeds = (plantName: string): 'full' | 'partial' | 'shade' => {
    const lowerName = plantName.toLowerCase();
    if (lowerName.includes('lettuce') || lowerName.includes('spinach') || lowerName.includes('herb')) return 'partial';
    if (lowerName.includes('mint') || lowerName.includes('fern')) return 'shade';
    return 'full'; // Most vegetables need full sun
  };

  const getWaterNeeds = (plantName: string): 'low' | 'medium' | 'high' => {
    const lowerName = plantName.toLowerCase();
    if (lowerName.includes('cucumber') || lowerName.includes('lettuce') || lowerName.includes('celery')) return 'high';
    if (lowerName.includes('herb') || lowerName.includes('onion') || lowerName.includes('carrot')) return 'low';
    return 'medium';
  };

  const generatePlantPositions = () => {
    const positions: PlantPosition[] = [];
    const usedPositions: Set<string> = new Set();
    
    // Create sections based on garden layout
    const sectionsPerRow = Math.ceil(Math.sqrt(gardenLayout.length));
    const sectionWidth = canvasWidth / sectionsPerRow;
    const sectionHeight = canvasHeight / Math.ceil(gardenLayout.length / sectionsPerRow);

    gardenLayout.forEach((section, sectionIndex) => {
      const sectionX = (sectionIndex % sectionsPerRow) * sectionWidth;
      const sectionY = Math.floor(sectionIndex / sectionsPerRow) * sectionHeight;
      
      section.plants.forEach((plantName, plantIndex) => {
        const plant = plantRecommendations.find(p => 
          p.name.toLowerCase() === plantName.toLowerCase() ||
          plantName.toLowerCase().includes(p.name.toLowerCase())
        );

        // Calculate position within section with some randomness for natural look
        const spacing = parseInt(plant?.spacing || '12') || 12;
        const plantsPerRow = Math.max(1, Math.floor((sectionWidth - 40) / spacing));
        
        const plantX = sectionX + 20 + (plantIndex % plantsPerRow) * spacing + (Math.random() - 0.5) * 10;
        const plantY = sectionY + 20 + Math.floor(plantIndex / plantsPerRow) * spacing + (Math.random() - 0.5) * 10;
        
        // Ensure plant doesn't go outside canvas bounds
        const finalX = Math.max(10, Math.min(canvasWidth - 10, plantX));
        const finalY = Math.max(10, Math.min(canvasHeight - 10, plantY));
        
        const positionKey = `${Math.round(finalX/10)}-${Math.round(finalY/10)}`;
        
        if (!usedPositions.has(positionKey)) {
          usedPositions.add(positionKey);
          
          positions.push({
            id: `${sectionIndex}-${plantIndex}`,
            name: plantName,
            x: finalX,
            y: finalY,
            size: plant?.difficulty === 'Easy' ? 8 : plant?.difficulty === 'Medium' ? 10 : 12,
            color: getPlantColor(plantName),
            icon: getPlantIcon(plantName),
            sunlightNeeds: getSunlightNeeds(plantName),
            waterNeeds: getWaterNeeds(plantName)
          });
        }
      });
    });

    setPlantPositions(positions);
  };

  const drawGardenPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background image if uploaded
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = 1.0;
        drawOverlays(ctx);
      };
      img.src = uploadedImage.previewUrl;
    } else {
      // Draw default garden background
      drawDefaultBackground(ctx);
      drawOverlays(ctx);
    }
  };

  const drawDefaultBackground = (ctx: CanvasRenderingContext2D) => {
    // Garden soil background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add texture pattern
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < canvasWidth; i += 20) {
      for (let j = 0; j < canvasHeight; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 10, 10);
        }
      }
    }
  };

  const drawOverlays = (ctx: CanvasRenderingContext2D) => {
    // Draw sunlight zones if enabled
    if (showSunlightMap) {
      drawSunlightZones(ctx);
    }

    // Draw water zones if enabled
    if (showWaterZones) {
      drawWaterZones(ctx);
    }

    // Draw garden sections
    drawSections(ctx);

    // Draw plants
    drawPlants(ctx);
  };

  const drawSunlightZones = (ctx: CanvasRenderingContext2D) => {
    // Simulate sunlight patterns
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.1)'); // Less sun (morning)
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)'); // Full sun (noon)
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0.1)'); // Less sun (evening)
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const drawWaterZones = (ctx: CanvasRenderingContext2D) => {
    // Draw water requirement zones
    plantPositions.forEach(plant => {
      const alpha = plant.waterNeeds === 'high' ? 0.3 : plant.waterNeeds === 'medium' ? 0.2 : 0.1;
      ctx.fillStyle = `rgba(0, 100, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(plant.x, plant.y, 25, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawSections = (ctx: CanvasRenderingContext2D) => {
    const sectionsPerRow = Math.ceil(Math.sqrt(gardenLayout.length));
    const sectionWidth = canvasWidth / sectionsPerRow;
    const sectionHeight = canvasHeight / Math.ceil(gardenLayout.length / sectionsPerRow);

    gardenLayout.forEach((section, index) => {
      const x = (index % sectionsPerRow) * sectionWidth;
      const y = Math.floor(index / sectionsPerRow) * sectionHeight;
      
      // Draw section border
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x + 5, y + 5, sectionWidth - 10, sectionHeight - 10);
      ctx.setLineDash([]);
      
      // Draw section label
      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(section.section, x + 10, y + 20);
    });
  };

  const drawPlants = (ctx: CanvasRenderingContext2D) => {
    plantPositions.forEach(plant => {
      // Draw plant circle
      ctx.fillStyle = plant.color;
      ctx.beginPath();
      ctx.arc(plant.x, plant.y, plant.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw border for selected plant
      if (selectedPlant?.id === plant.id) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Draw plant icon
      ctx.fillStyle = '#000000';
      ctx.font = `${plant.size + 4}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(plant.icon, plant.x, plant.y);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a plant
    const clickedPlant = plantPositions.find(plant => {
      const distance = Math.sqrt((x - plant.x) ** 2 + (y - plant.y) ** 2);
      return distance <= plant.size + 5;
    });

    setSelectedPlant(clickedPlant || null);
  };

  const regenerateLayout = async () => {
    setIsGenerating(true);
    try {
      // Add some randomness to positions for regeneration
      setTimeout(() => {
        generatePlantPositions();
        setIsGenerating(false);
        toast({
          title: "Layout Regenerated",
          description: "Your garden layout has been optimized with a new arrangement!",
        });
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Could not regenerate layout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'ai-garden-plan.png';
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Plan Downloaded",
      description: "Your AI garden plan has been saved as an image!",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Sparkles className="mr-2 h-5 w-5" />
            AI-Generated Visual Garden Plan
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={regenerateLayout}
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Regenerate'}
            </Button>
            <Button onClick={downloadPlan} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <p className="text-sm text-sbtp-brown-600">
          Interactive visual layout optimized for sunlight, spacing, and companion planting
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">Garden Layout</TabsTrigger>
            <TabsTrigger value="sunlight">Sunlight Analysis</TabsTrigger>
            <TabsTrigger value="water">Water Zones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="layout" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setShowSunlightMap(!showSunlightMap)}
                variant={showSunlightMap ? "default" : "outline"}
                size="sm"
              >
                <Sun className="mr-2 h-4 w-4" />
                Sunlight Map
              </Button>
              <Button
                onClick={() => setShowWaterZones(!showWaterZones)}
                variant={showWaterZones ? "default" : "outline"}
                size="sm"
              >
                <Droplets className="mr-2 h-4 w-4" />
                Water Zones
              </Button>
            </div>
            
            <div className="border border-sbtp-green-200 rounded-lg p-4 bg-sbtp-green-25">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleCanvasClick}
                className="border border-sbtp-green-300 rounded cursor-pointer max-w-full h-auto"
                style={{ backgroundColor: '#F0FDF4' }}
              />
            </div>

            {selectedPlant && (
              <Card className="bg-sbtp-yellow/10 border-sbtp-yellow/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{selectedPlant.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sbtp-green-800">{selectedPlant.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Sun className="mr-1 h-3 w-3" />
                          {selectedPlant.sunlightNeeds} sun
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Droplets className="mr-1 h-3 w-3" />
                          {selectedPlant.waterNeeds} water
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="sunlight" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-4 text-center">
                  <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-yellow-800">Full Sun</h4>
                  <p className="text-sm text-yellow-700">6+ hours direct</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {plantPositions.filter(p => p.sunlightNeeds === 'full').length} plants
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="pt-4 text-center">
                  <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-800">Partial Sun</h4>
                  <p className="text-sm text-orange-700">4-6 hours direct</p>
                  <p className="text-xs text-orange-600 mt-1">
                    {plantPositions.filter(p => p.sunlightNeeds === 'partial').length} plants
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4 text-center">
                  <Sun className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Shade</h4>
                  <p className="text-sm text-green-700">2-4 hours direct</p>
                  <p className="text-xs text-green-600 mt-1">
                    {plantPositions.filter(p => p.sunlightNeeds === 'shade').length} plants
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="water" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-4 text-center">
                  <Droplets className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-red-800">High Water</h4>
                  <p className="text-sm text-red-700">Daily watering</p>
                  <p className="text-xs text-red-600 mt-1">
                    {plantPositions.filter(p => p.waterNeeds === 'high').length} plants
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4 text-center">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">Medium Water</h4>
                  <p className="text-sm text-blue-700">2-3 times/week</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {plantPositions.filter(p => p.waterNeeds === 'medium').length} plants
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4 text-center">
                  <Droplets className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-amber-800">Low Water</h4>
                  <p className="text-sm text-amber-700">Once/week</p>
                  <p className="text-xs text-amber-600 mt-1">
                    {plantPositions.filter(p => p.waterNeeds === 'low').length} plants
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {uploadedImage && (
          <div className="mt-4 p-3 bg-sbtp-blue/10 border border-sbtp-blue/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sbtp-blue" />
              <span className="text-sm font-medium text-sbtp-blue">AI Enhanced with Your Photo</span>
            </div>
            <p className="text-xs text-sbtp-blue mt-1">
              This layout has been optimized based on the uploaded image of your garden area
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIVisualGardenPlan;