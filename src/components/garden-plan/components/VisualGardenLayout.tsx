import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

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

interface GardenCell {
  id: string;
  plant: PlantRecommendation | null;
  x: number;
  y: number;
}

interface VisualGardenLayoutProps {
  plantRecommendations: PlantRecommendation[];
  spaceSize: string;
  onLayoutComplete: (layout: GardenCell[]) => void;
}

const VisualGardenLayout: React.FC<VisualGardenLayoutProps> = ({
  plantRecommendations,
  spaceSize,
  onLayoutComplete
}) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);
  const [gardenGrid, setGardenGrid] = useState<GardenCell[]>(() => {
    const cells: GardenCell[] = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 8; x++) {
        cells.push({
          id: `${x}-${y}`,
          plant: null,
          x,
          y
        });
      }
    }
    return cells;
  });

  const handleCellClick = (cellId: string) => {
    if (!selectedPlant) return;

    setGardenGrid(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, plant: selectedPlant }
        : cell
    ));
  };

  const handleClearCell = (cellId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGardenGrid(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, plant: null }
        : cell
    ));
  };

  const handleComplete = () => {
    onLayoutComplete(gardenGrid);
  };

  const getCompanionColor = (plant1: PlantRecommendation, plant2: PlantRecommendation) => {
    // Simplified companion planting logic
    const companions = {
      'Tomato': ['Basil', 'Marigold', 'Pepper'],
      'Basil': ['Tomato', 'Pepper'],
      'Lettuce': ['Carrot', 'Radish'],
      'Carrot': ['Lettuce', 'Onion'],
      'Cucumber': ['Bean', 'Radish'],
      'Bean': ['Cucumber', 'Corn'],
    };

    const plant1Name = plant1.name.split(' ')[0];
    const plant2Name = plant2.name.split(' ')[0];
    
    if (companions[plant1Name]?.includes(plant2Name)) return 'bg-green-200';
    return 'bg-yellow-100';
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-sbtp-green-800">Design Your Garden Layout</CardTitle>
        <p className="text-sbtp-brown-600">
          Click on a plant below, then click on the garden grid to place it. 
          Green borders indicate good companion plants.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plant Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Plants</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {plantRecommendations.map((plant, index) => (
              <Button
                key={index}
                variant={selectedPlant === plant ? "default" : "outline"}
                className={`h-auto p-3 text-left ${
                  selectedPlant === plant 
                    ? "bg-sbtp-green-500 hover:bg-sbtp-green-600" 
                    : "hover:bg-sbtp-green-50"
                }`}
                onClick={() => setSelectedPlant(plant)}
              >
                <div>
                  <div className="font-medium text-sm">{plant.name}</div>
                  <div className="text-xs opacity-70">{plant.variety}</div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs mt-1 ${
                      plant.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      plant.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {plant.difficulty}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Garden Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Garden Layout ({spaceSize})
          </h3>
          <div className="grid grid-cols-8 gap-1 bg-sbtp-beige p-4 rounded-lg max-w-2xl mx-auto">
            {gardenGrid.map((cell) => {
              // Check for companion plants in adjacent cells
              const adjacentCells = gardenGrid.filter(adjCell => {
                const isAdjacent = Math.abs(adjCell.x - cell.x) <= 1 && 
                                 Math.abs(adjCell.y - cell.y) <= 1 &&
                                 adjCell.id !== cell.id;
                return isAdjacent && adjCell.plant;
              });

              const hasCompanion = cell.plant && adjacentCells.some(adjCell => 
                adjCell.plant && getCompanionColor(cell.plant!, adjCell.plant).includes('green')
              );

              return (
                <div
                  key={cell.id}
                  className={`
                    aspect-square border-2 rounded cursor-pointer flex items-center justify-center text-xs relative
                    ${cell.plant 
                      ? hasCompanion 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-sbtp-green-300 bg-white'
                      : selectedPlant 
                        ? 'border-dashed border-sbtp-green-400 bg-sbtp-green-50 hover:bg-sbtp-green-100' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => handleCellClick(cell.id)}
                >
                  {cell.plant ? (
                    <>
                      <div className="text-center p-1">
                        <div className="font-bold text-[8px] leading-tight">
                          {cell.plant.name.split(' ')[0]}
                        </div>
                        <div className="text-[6px] opacity-70">
                          {cell.plant.variety.split(' ')[0]}
                        </div>
                      </div>
                      <button
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                        onClick={(e) => handleClearCell(cell.id, e)}
                      >
                        <Trash2 size={8} />
                      </button>
                    </>
                  ) : selectedPlant ? (
                    <Plus size={12} className="text-sbtp-green-500" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-sbtp-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sbtp-green-800 mb-2">Tips:</h4>
          <ul className="text-sm text-sbtp-green-700 space-y-1">
            <li>• Green borders indicate beneficial companion plantings</li>
            <li>• Consider plant spacing requirements when placing</li>
            <li>• Taller plants should go on the north side to avoid shading shorter ones</li>
            <li>• Click the red X to remove a plant from a cell</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleComplete}
            className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
          >
            Continue with This Layout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualGardenLayout;