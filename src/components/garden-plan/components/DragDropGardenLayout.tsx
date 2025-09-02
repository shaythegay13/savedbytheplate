import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RotateCcw, Save } from 'lucide-react';
import { PlantRecommendation } from '../types';

interface PlantSquare {
  id: string;
  plant: PlantRecommendation | null;
  x: number;
  y: number;
  companionStatus?: 'good' | 'bad' | 'neutral';
}

interface DragDropGardenLayoutProps {
  plantRecommendations: PlantRecommendation[];
  gardenSize: { width: number; height: number };
  onLayoutUpdate?: (layout: PlantSquare[]) => void;
}

// Companion planting data
const companionPlants: Record<string, { good: string[]; bad: string[] }> = {
  'tomato': {
    good: ['basil', 'parsley', 'oregano', 'marigold', 'carrot', 'pepper'],
    bad: ['corn', 'fennel', 'walnut', 'brassica']
  },
  'basil': {
    good: ['tomato', 'pepper', 'oregano', 'parsley'],
    bad: ['rue', 'sage']
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
    good: ['tomato', 'pepper', 'carrot', 'lettuce', 'brassica'],
    bad: ['bean', 'pea', 'asparagus']
  },
  'bean': {
    good: ['corn', 'squash', 'radish', 'carrot'],
    bad: ['onion', 'garlic', 'fennel']
  },
  'corn': {
    good: ['bean', 'squash', 'cucumber', 'radish'],
    bad: ['tomato', 'celery']
  },
  'cucumber': {
    good: ['bean', 'corn', 'radish', 'marigold'],
    bad: ['herb', 'aromatic']
  },
  'radish': {
    good: ['carrot', 'spinach', 'lettuce', 'cucumber'],
    bad: ['hysop']
  }
};

const DragDropGardenLayout: React.FC<DragDropGardenLayoutProps> = ({
  plantRecommendations,
  gardenSize,
  onLayoutUpdate
}) => {
  const [gardenGrid, setGardenGrid] = useState<PlantSquare[]>(() => {
    const grid: PlantSquare[] = [];
    for (let y = 0; y < gardenSize.height; y++) {
      for (let x = 0; x < gardenSize.width; x++) {
        grid.push({
          id: `${x}-${y}`,
          plant: null,
          x,
          y,
          companionStatus: 'neutral'
        });
      }
    }
    return grid;
  });

  const [draggedPlant, setDraggedPlant] = useState<PlantRecommendation | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const getCompanionStatus = (plant: PlantRecommendation, x: number, y: number): 'good' | 'bad' | 'neutral' => {
    const plantName = plant.name.toLowerCase();
    const companions = companionPlants[plantName];
    
    if (!companions) return 'neutral';

    // Check adjacent squares
    const adjacentSquares = [
      { x: x - 1, y }, { x: x + 1, y },
      { x, y: y - 1 }, { x, y: y + 1 }
    ];

    for (const adjacent of adjacentSquares) {
      const adjacentSquare = gardenGrid.find(square => 
        square.x === adjacent.x && square.y === adjacent.y
      );
      
      if (adjacentSquare?.plant) {
        const adjacentPlantName = adjacentSquare.plant.name.toLowerCase();
        if (companions.bad.some(bad => adjacentPlantName.includes(bad))) {
          return 'bad';
        }
        if (companions.good.some(good => adjacentPlantName.includes(good))) {
          return 'good';
        }
      }
    }

    return 'neutral';
  };

  const updateCompanionStatus = (grid: PlantSquare[]): PlantSquare[] => {
    return grid.map(square => {
      if (square.plant) {
        const companionStatus = getCompanionStatus(square.plant, square.x, square.y);
        return {
          ...square,
          companionStatus
        };
      }
      return square;
    });
  };

  const handleDragStart = (plant: PlantRecommendation) => {
    setDraggedPlant(plant);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSquare: PlantSquare) => {
    e.preventDefault();
    if (!draggedPlant) return;

    const newGrid = gardenGrid.map(square => 
      square.id === targetSquare.id 
        ? { ...square, plant: draggedPlant }
        : square
    );

    const updatedGrid = updateCompanionStatus(newGrid);
    setGardenGrid(updatedGrid);
    setDraggedPlant(null);
    onLayoutUpdate?.(updatedGrid);
  };

  const removeFromSquare = (squareId: string) => {
    const newGrid = gardenGrid.map(square => 
      square.id === squareId 
        ? { ...square, plant: null, companionStatus: 'neutral' as const }
        : square
    );
    
    const updatedGrid = updateCompanionStatus(newGrid);
    setGardenGrid(updatedGrid);
    onLayoutUpdate?.(updatedGrid);
  };

  const clearLayout = () => {
    const clearedGrid = gardenGrid.map(square => ({
      ...square,
      plant: null,
      companionStatus: 'neutral' as const
    }));
    setGardenGrid(clearedGrid);
    onLayoutUpdate?.(clearedGrid);
  };

  const getSquareColor = (square: PlantSquare) => {
    if (!square.plant) return 'bg-slate-50 border-slate-200';
    
    switch (square.companionStatus) {
      case 'good': return 'bg-green-100 border-green-300';
      case 'bad': return 'bg-red-100 border-red-300';
      default: return 'bg-blue-100 border-blue-300';
    }
  };

  const getPlantEmoji = (plantName: string) => {
    const name = plantName.toLowerCase();
    if (name.includes('tomato')) return '🍅';
    if (name.includes('carrot')) return '🥕';
    if (name.includes('lettuce')) return '🥬';
    if (name.includes('pepper')) return '🌶️';
    if (name.includes('basil')) return '🌿';
    if (name.includes('onion')) return '🧅';
    if (name.includes('bean')) return '🫘';
    if (name.includes('corn')) return '🌽';
    if (name.includes('cucumber')) return '🥒';
    if (name.includes('radish')) return '🔴';
    if (name.includes('herb')) return '🌿';
    return '🌱';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-primary">
            Interactive Garden Layout
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearLayout}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            🟢 Good Companions
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-700">
            🔴 Bad Companions
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            🔵 Planted
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plant Palette */}
        <div>
          <h3 className="font-semibold mb-3">Available Plants</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {plantRecommendations.map((plant, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(plant)}
                className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-grab hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg">{getPlantEmoji(plant.name)}</span>
                <span className="text-sm font-medium truncate">{plant.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Garden Grid */}
        <div>
          <h3 className="font-semibold mb-3">Garden Plot ({gardenSize.width} x {gardenSize.height} squares)</h3>
          <div 
            className="grid gap-1 mx-auto bg-slate-100 p-4 rounded-lg"
            style={{ 
              gridTemplateColumns: `repeat(${gardenSize.width}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(gardenSize.width * 80, 640)}px`
            }}
          >
            {gardenGrid.map((square) => (
              <div
                key={square.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                onClick={() => square.plant && removeFromSquare(square.id)}
                className={`
                  aspect-square border-2 rounded-lg flex flex-col items-center justify-center
                  cursor-pointer transition-all duration-200 hover:scale-105
                  ${getSquareColor(square)}
                  ${square.plant ? 'cursor-pointer' : 'cursor-crosshair'}
                `}
                title={
                  square.plant 
                    ? `${square.plant.name} (${square.companionStatus}) - Click to remove`
                    : 'Drop a plant here'
                }
              >
                {square.plant ? (
                  <>
                    <span className="text-lg">{getPlantEmoji(square.plant.name)}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {square.plant.name.split(' ')[0]}
                    </span>
                  </>
                ) : (
                  <Plus className="w-4 h-4 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Companion Planting Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Companion Planting Tips</h4>
          <p className="text-sm text-amber-700">
            Drag plants from the palette above to plan your garden. Green squares indicate good companion plants,
            red squares show incompatible combinations. Click planted squares to remove plants.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DragDropGardenLayout;