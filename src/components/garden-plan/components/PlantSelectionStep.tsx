import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Clock, Sun, Droplets } from "lucide-react";

interface PlantRecommendation {
  name: string;
  variety: string;
  plantingTime: string;
  harvestTime: string;
  spacing: string;
  careInstructions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  yield: string;
  sunlight?: string;
  water?: string;
  companions?: string[];
}

interface PlantSelectionStepProps {
  availablePlants: PlantRecommendation[];
  season: string;
  experience: string;
  onPlantsSelected: (plants: PlantRecommendation[]) => void;
}

const PlantSelectionStep: React.FC<PlantSelectionStepProps> = ({
  availablePlants,
  season,
  experience,
  onPlantsSelected
}) => {
  const [selectedPlants, setSelectedPlants] = useState<PlantRecommendation[]>([]);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const handlePlantToggle = (plant: PlantRecommendation) => {
    setSelectedPlants(prev => {
      const isSelected = prev.some(p => p.name === plant.name);
      if (isSelected) {
        return prev.filter(p => p.name !== plant.name);
      } else {
        return [...prev, plant];
      }
    });
  };

  const isPlantSelected = (plant: PlantRecommendation) => {
    return selectedPlants.some(p => p.name === plant.name);
  };

  const filteredPlants = availablePlants.filter(plant => {
    if (filter === 'all') return true;
    return plant.difficulty.toLowerCase() === filter;
  });

  const getRecommendedPlants = () => {
    if (experience === 'beginner' && filter === 'all') {
      // For beginners, show easy plants first, but still allow them to see all
      return [...filteredPlants.filter(p => p.difficulty === 'Easy'), ...filteredPlants.filter(p => p.difficulty !== 'Easy')];
    }
    return filteredPlants;
  };

  const recommendedPlants = getRecommendedPlants();

  const handleContinue = () => {
    if (selectedPlants.length === 0) return;
    onPlantsSelected(selectedPlants);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-sbtp-green-800">Choose Your Plants</CardTitle>
        <p className="text-sbtp-brown-600">
          Select the plants you'd like to grow this {season}. We've pre-selected recommendations based on your experience level.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Plants ({availablePlants.length})
          </Button>
          <Button
            variant={filter === 'easy' ? 'default' : 'outline'}
            onClick={() => setFilter('easy')}
            size="sm"
          >
            Easy ({availablePlants.filter(p => p.difficulty === 'Easy').length})
          </Button>
          <Button
            variant={filter === 'medium' ? 'default' : 'outline'}
            onClick={() => setFilter('medium')}
            size="sm"
          >
            Medium ({availablePlants.filter(p => p.difficulty === 'Medium').length})
          </Button>
          <Button
            variant={filter === 'hard' ? 'default' : 'outline'}
            onClick={() => setFilter('hard')}
            size="sm"
          >
            Hard ({availablePlants.filter(p => p.difficulty === 'Hard').length})
          </Button>
        </div>

        {/* Experience-based recommendations */}
        {experience === 'beginner' && filter === 'all' && (
          <Alert>
            <Leaf className="h-4 w-4" />
            <AlertDescription>
              As a beginner, we've arranged easy-to-grow plants first, but you can still explore all difficulty levels using the filters above.
            </AlertDescription>
          </Alert>
        )}

        {/* Selected Plants Summary */}
        {selectedPlants.length > 0 && (
          <div className="bg-sbtp-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sbtp-green-800 mb-2">
              Selected Plants ({selectedPlants.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedPlants.map((plant, index) => (
                <Badge key={index} variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-800">
                  {plant.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Plant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedPlants.map((plant, index) => {
            const isSelected = isPlantSelected(plant);
            
            return (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-sbtp-green-500 bg-sbtp-green-50' 
                    : 'hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => handlePlantToggle(plant)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sbtp-green-800">{plant.name}</h4>
                      <p className="text-sm text-sbtp-brown-600">{plant.variety}</p>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handlePlantToggle(plant)}
                      className="ml-2"
                    />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-sbtp-brown-600">
                      <Clock size={12} />
                      <span>Plant: {plant.plantingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sbtp-brown-600">
                      <Leaf size={12} />
                      <span>Harvest: {plant.harvestTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sbtp-brown-600">
                      <span>Spacing: {plant.spacing}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary"
                      className={getDifficultyColor(plant.difficulty)}
                    >
                      {plant.difficulty}
                    </Badge>
                    <span className="text-xs text-sbtp-brown-500">{plant.yield}</span>
                  </div>

                  {plant.companions && plant.companions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-sbtp-green-600">
                        Companions: {plant.companions.join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleContinue}
            disabled={selectedPlants.length === 0}
            className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
          >
            Continue with Selected Plants ({selectedPlants.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantSelectionStep;