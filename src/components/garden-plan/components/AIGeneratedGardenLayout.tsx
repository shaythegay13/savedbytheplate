import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Download, RefreshCw, Sun, Droplets, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GardenPlanFormData } from '../types';

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
  companions: string[];
  incompatible: string[];
}

interface CompanionPlantingData {
  plant_positions?: Array<{
    plant_name: string;
    x: number;
    y: number;
    companions: string[];
    incompatible: string[];
  }>;
}

interface AIGeneratedGardenLayoutProps {
  plantRecommendations: PlantRecommendation[];
  formData: GardenPlanFormData | null;
  uploadedImage?: { file: File; previewUrl: string } | null;
  companionPlantingData?: CompanionPlantingData;
}

// Companion planting database
const companionPlants: Record<string, { good: string[]; bad: string[] }> = {
  'tomato': {
    good: ['basil', 'parsley', 'oregano', 'marigold', 'carrot', 'pepper'],
    bad: ['corn', 'fennel', 'walnut', 'brassica', 'kale', 'broccoli']
  },
  'basil': {
    good: ['tomato', 'pepper', 'oregano', 'parsley'],
    bad: ['rue', 'sage', 'thyme']
  },
  'carrot': {
    good: ['tomato', 'chive', 'onion', 'leek', 'rosemary', 'sage'],
    bad: ['dill', 'parsnip']
  },
  'lettuce': {
    good: ['carrot', 'radish', 'strawberry', 'chive', 'garlic'],
    bad: ['broccoli', 'parsley']
  },
  'pepper': {
    good: ['tomato', 'basil', 'oregano', 'parsley', 'onion'],
    bad: ['fennel', 'kohlrabi']
  },
  'onion': {
    good: ['tomato', 'pepper', 'carrot', 'lettuce', 'brassica', 'broccoli'],
    bad: ['bean', 'pea', 'asparagus']
  },
  'bean': {
    good: ['corn', 'squash', 'radish', 'carrot', 'cucumber'],
    bad: ['onion', 'garlic', 'fennel']
  },
  'corn': {
    good: ['bean', 'squash', 'cucumber', 'radish'],
    bad: ['tomato', 'celery']
  },
  'cucumber': {
    good: ['bean', 'corn', 'radish', 'marigold', 'nasturtium'],
    bad: ['herb', 'aromatic', 'sage']
  },
  'radish': {
    good: ['carrot', 'spinach', 'lettuce', 'cucumber', 'bean'],
    bad: ['hysop']
  },
  'spinach': {
    good: ['strawberry', 'pea', 'radish', 'bean'],
    bad: []
  },
  'kale': {
    good: ['onion', 'nasturtium', 'potato'],
    bad: ['tomato', 'pepper', 'strawberry']
  },
  'broccoli': {
    good: ['onion', 'nasturtium', 'thyme', 'rosemary'],
    bad: ['tomato', 'lettuce', 'strawberry']
  },
  'zucchini': {
    good: ['corn', 'bean', 'radish', 'nasturtium'],
    bad: ['potato']
  },
  'strawberry': {
    good: ['spinach', 'lettuce', 'thyme', 'borage'],
    bad: ['brassica', 'broccoli', 'kale']
  },
  'marigold': {
    good: ['tomato', 'bean', 'cucumber', 'squash'],
    bad: []
  },
  'nasturtium': {
    good: ['cucumber', 'squash', 'radish', 'broccoli', 'kale'],
    bad: []
  },
  'sunflower': {
    good: ['cucumber', 'squash'],
    bad: ['potato']
  },
  'oregano': {
    good: ['tomato', 'pepper', 'basil'],
    bad: []
  },
  'thyme': {
    good: ['strawberry', 'broccoli', 'kale'],
    bad: ['basil']
  }
};

const AIGeneratedGardenLayout: React.FC<AIGeneratedGardenLayoutProps> = ({
  plantRecommendations,
  formData,
  uploadedImage,
  companionPlantingData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plantPositions, setPlantPositions] = useState<PlantPosition[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantPosition | null>(null);
  const [showCompanions, setShowCompanions] = useState(true);
  const [draggedPlant, setDraggedPlant] = useState<PlantPosition | null>(null);
  const { toast } = useToast();

  const canvasWidth = 600;
  const canvasHeight = 400;

  useEffect(() => {
    generatePlantPositions();
  }, [plantRecommendations, formData, companionPlantingData]);

  useEffect(() => {
    drawGardenPlan();
  }, [plantPositions, showCompanions, uploadedImage]);

  const getPlantIcon = (plantName: string): string => {
    const lowerName = plantName.toLowerCase();
    if (lowerName.includes('tomato')) return '🍅';
    if (lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('lettuce') || lowerName.includes('salad')) return '🥬';
    if (lowerName.includes('herb') || lowerName.includes('basil') || lowerName.includes('parsley') || lowerName.includes('oregano') || lowerName.includes('thyme')) return '🌿';
    if (lowerName.includes('pepper')) return '🌶️';
    if (lowerName.includes('cucumber')) return '🥒';
    if (lowerName.includes('bean')) return '🫘';
    if (lowerName.includes('corn')) return '🌽';
    if (lowerName.includes('potato')) return '🥔';
    if (lowerName.includes('onion')) return '🧅';
    if (lowerName.includes('flower') || lowerName.includes('marigold') || lowerName.includes('zinnia') || lowerName.includes('cosmos')) return '🌸';
    if (lowerName.includes('squash') || lowerName.includes('zucchini')) return '🎃';
    if (lowerName.includes('beet')) return '🍠';
    if (lowerName.includes('radish')) return '🔴';
    if (lowerName.includes('spinach') || lowerName.includes('kale')) return '🥬';
    if (lowerName.includes('strawberry') || lowerName.includes('blueberry')) return '🍓';
    if (lowerName.includes('sunflower')) return '🌻';
    if (lowerName.includes('nasturtium')) return '🌺';
    return '🌱';
  };

  const getPlantColor = (plantName: string): string => {
    const colors = [
      '#10B981', '#059669', '#047857', '#065F46',
      '#F59E0B', '#D97706', '#B45309', '#92400E',
      '#EF4444', '#DC2626', '#B91C1C', '#991B1B',
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6',
      '#06B6D4', '#0891B2', '#0E7490', '#155E75',
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
    return 'full';
  };

  const getWaterNeeds = (plantName: string): 'low' | 'medium' | 'high' => {
    const lowerName = plantName.toLowerCase();
    if (lowerName.includes('cucumber') || lowerName.includes('lettuce') || lowerName.includes('celery')) return 'high';
    if (lowerName.includes('herb') || lowerName.includes('onion') || lowerName.includes('carrot') || lowerName.includes('thyme')) return 'low';
    return 'medium';
  };

  const getCompanionInfo = (plantName: string): { good: string[]; bad: string[] } => {
    const lowerName = plantName.toLowerCase();
    for (const [key, value] of Object.entries(companionPlants)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }
    return { good: [], bad: [] };
  };

  const generatePlantPositions = () => {
    const positions: PlantPosition[] = [];
    
    // Use backend data if available
    if (companionPlantingData?.plant_positions && companionPlantingData.plant_positions.length > 0) {
      companionPlantingData.plant_positions.forEach((pos, index) => {
        const plant = plantRecommendations.find(p => 
          p.name.toLowerCase().includes(pos.plant_name.toLowerCase()) ||
          pos.plant_name.toLowerCase().includes(p.name.toLowerCase())
        );

        positions.push({
          id: `ai-${index}`,
          name: pos.plant_name,
          x: pos.x * canvasWidth,
          y: pos.y * canvasHeight,
          size: plant?.difficulty === 'Easy' ? 8 : plant?.difficulty === 'Medium' ? 10 : 12,
          color: getPlantColor(pos.plant_name),
          icon: getPlantIcon(pos.plant_name),
          sunlightNeeds: getSunlightNeeds(pos.plant_name),
          waterNeeds: getWaterNeeds(pos.plant_name),
          companions: pos.companions || [],
          incompatible: pos.incompatible || []
        });
      });
    } else {
      // Fallback: generate positions using companion planting logic
      const usedPositions: Set<string> = new Set();
      const gridSize = Math.ceil(Math.sqrt(plantRecommendations.length));
      const cellWidth = canvasWidth / gridSize;
      const cellHeight = canvasHeight / gridSize;

      plantRecommendations.forEach((plant, index) => {
        const companionInfo = getCompanionInfo(plant.name);
        const gridX = index % gridSize;
        const gridY = Math.floor(index / gridSize);
        
        // Calculate position with spacing based on companion planting
        const baseX = gridX * cellWidth + cellWidth / 2;
        const baseY = gridY * cellHeight + cellHeight / 2;
        
        // Add some variation for natural look
        const x = Math.max(20, Math.min(canvasWidth - 20, baseX + (Math.random() - 0.5) * 30));
        const y = Math.max(20, Math.min(canvasHeight - 20, baseY + (Math.random() - 0.5) * 30));
        
        positions.push({
          id: `plant-${index}`,
          name: plant.name,
          x,
          y,
          size: plant.difficulty === 'Easy' ? 8 : plant.difficulty === 'Medium' ? 10 : 12,
          color: getPlantColor(plant.name),
          icon: getPlantIcon(plant.name),
          sunlightNeeds: getSunlightNeeds(plant.name),
          waterNeeds: getWaterNeeds(plant.name),
          companions: companionInfo.good,
          incompatible: companionInfo.bad
        });
      });
    }

    setPlantPositions(positions);
  };

  const drawGardenPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        drawPlantsAndConnections(ctx);
      };
      img.src = uploadedImage.previewUrl;
    } else {
      drawDefaultBackground(ctx);
      drawPlantsAndConnections(ctx);
    }
  };

  const drawDefaultBackground = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#2D5016');
    gradient.addColorStop(0.5, '#3A5F23');
    gradient.addColorStop(1, '#2D5016');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Grass texture
    ctx.fillStyle = '#4A7C3A';
    for (let i = 0; i < canvasWidth; i += 30) {
      for (let j = 0; j < canvasHeight; j += 30) {
        if (Math.random() > 0.7) {
          ctx.beginPath();
          ctx.arc(i + Math.random() * 30, j + Math.random() * 30, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };

  const drawPlantsAndConnections = (ctx: CanvasRenderingContext2D) => {
    // Draw companion planting connections first
    if (showCompanions) {
      plantPositions.forEach((plant, index) => {
        plantPositions.forEach((otherPlant, otherIndex) => {
          if (index >= otherIndex) return;
          
          const distance = Math.sqrt(
            Math.pow(plant.x - otherPlant.x, 2) + Math.pow(plant.y - otherPlant.y, 2)
          );
          
          // Only draw connections for nearby plants
          if (distance < 100) {
            const plantNameLower = plant.name.toLowerCase();
            const otherNameLower = otherPlant.name.toLowerCase();
            
            const isGoodCompanion = plant.companions.some(c => otherNameLower.includes(c)) ||
                                   otherPlant.companions.some(c => plantNameLower.includes(c));
            const isBadCompanion = plant.incompatible.some(i => otherNameLower.includes(i)) ||
                                  otherPlant.incompatible.some(i => plantNameLower.includes(i));
            
            if (isGoodCompanion) {
              ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
              ctx.lineWidth = 2;
              ctx.setLineDash([]);
              ctx.beginPath();
              ctx.moveTo(plant.x, plant.y);
              ctx.lineTo(otherPlant.x, otherPlant.y);
              ctx.stroke();
            } else if (isBadCompanion) {
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(plant.x, plant.y);
              ctx.lineTo(otherPlant.x, otherPlant.y);
              ctx.stroke();
            }
          }
        });
      });
    }

    // Draw plants
    plantPositions.forEach(plant => {
      // Background circle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(plant.x, plant.y, plant.size + 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Plant circle
      ctx.fillStyle = plant.color;
      ctx.beginPath();
      ctx.arc(plant.x, plant.y, plant.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = selectedPlant?.id === plant.id ? '#FFD700' : 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = selectedPlant?.id === plant.id ? 4 : 2;
      ctx.setLineDash([]);
      ctx.stroke();
      
      // Icon with shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.font = `${plant.size + 4}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(plant.icon, plant.x + 1, plant.y + 1);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(plant.icon, plant.x, plant.y);
      
      // Label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      const labelWidth = ctx.measureText(plant.name.split(' ')[0]).width + 8;
      ctx.fillRect(plant.x - labelWidth/2, plant.y + plant.size + 8, labelWidth, 14);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(plant.name.split(' ')[0], plant.x, plant.y + plant.size + 18);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedPlant = plantPositions.find(plant => {
      const distance = Math.sqrt((x - plant.x) ** 2 + (y - plant.y) ** 2);
      return distance <= plant.size + 5;
    });

    setSelectedPlant(clickedPlant || null);
  };

  const downloadPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'ai-garden-layout.png';
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Layout Downloaded",
      description: "Your AI-generated garden layout has been saved!",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Sparkles className="mr-2 h-5 w-5" />
            AI-Generated Garden Layout
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCompanions(!showCompanions)}
              variant={showCompanions ? "default" : "outline"}
              size="sm"
            >
              <Info className="mr-2 h-4 w-4" />
              Companions
            </Button>
            <Button onClick={downloadPlan} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <p className="text-sm text-sbtp-brown-600">
          AI-optimized plant placement with companion planting recommendations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
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

        <div className="flex gap-2 flex-wrap text-xs">
          <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
            <span className="mr-1">━</span> Good Companions
          </Badge>
          <Badge variant="outline" className="bg-red-100 border-red-300 text-red-700">
            <span className="mr-1">╌╌╌</span> Incompatible
          </Badge>
        </div>

        {selectedPlant && (
          <Card className="bg-sbtp-yellow/10 border-sbtp-yellow/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{selectedPlant.icon}</span>
                <div className="flex-1">
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
              {selectedPlant.companions.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-green-700">Good Companions:</p>
                  <p className="text-sm text-green-600">{selectedPlant.companions.join(', ')}</p>
                </div>
              )}
              {selectedPlant.incompatible.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700">Keep Away From:</p>
                  <p className="text-sm text-red-600">{selectedPlant.incompatible.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Info className="mr-2 h-4 w-4" />
            About This Layout
          </h4>
          <p className="text-sm text-blue-700">
            This AI-generated layout optimizes plant placement based on companion planting principles, 
            sunlight requirements, and spacing needs. Green lines show beneficial plant partnerships, 
            while red dashed lines indicate plants that should be kept apart. Click on any plant to see 
            detailed companion information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIGeneratedGardenLayout;
