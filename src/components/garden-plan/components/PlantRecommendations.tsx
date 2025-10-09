import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Edit2, Save, X } from "lucide-react";

interface PlantRecommendation {
  name: string;
  variety?: string;
  plantingTime: string;
  harvestTime: string;
  spacing: string;
  careInstructions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  yield: string;
}

interface PlantRecommendationsProps {
  plantRecommendations: PlantRecommendation[];
  onShareExperience: (plantName: string) => void;
  onPlanUpdate?: (updatedPlants: PlantRecommendation[]) => void;
}

const PlantRecommendations: React.FC<PlantRecommendationsProps> = ({
  plantRecommendations,
  onShareExperience,
  onPlanUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlants, setEditedPlants] = useState(plantRecommendations);

  const handleSaveChanges = () => {
    if (onPlanUpdate) {
      onPlanUpdate(editedPlants);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPlants(plantRecommendations);
    setIsEditing(false);
  };

  const updatePlant = (index: number, field: keyof PlantRecommendation, value: string) => {
    setEditedPlants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePlant = (index: number) => {
    setEditedPlants(prev => prev.filter((_, i) => i !== index));
  };

  const displayPlants = isEditing ? editedPlants : plantRecommendations;

  // Categorize plants - check lowercase name for accurate categorization
  const fruitKeywords = ['strawberr', 'raspberr', 'blueberr', 'tomato', 'melon', 'cucumber'];
  const flowerHerbKeywords = ['marigold', 'sunflower', 'zinnia', 'petunia', 'rose', 'lavender', 'cosmos', 'basil', 'parsley', 'cilantro', 'mint', 'thyme', 'oregano', 'chive'];
  const veggieKeywords = ['pepper', 'carrot', 'lettuce', 'spinach', 'broccoli', 'radish', 'kale'];
  
  const fruits = displayPlants.filter(p => {
    const lowerName = p.name.toLowerCase();
    return fruitKeywords.some(keyword => lowerName.includes(keyword));
  });
  
  const flowers = displayPlants.filter(p => {
    const lowerName = p.name.toLowerCase();
    return flowerHerbKeywords.some(keyword => lowerName.includes(keyword));
  });
  
  const veggies = displayPlants.filter(p => 
    !fruits.includes(p) && !flowers.includes(p)
  );

  const renderPlantSection = (title: string, plants: PlantRecommendation[], emoji: string) => {
    if (plants.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-sbtp-green-700 flex items-center gap-2 mb-4">
          <span className="text-3xl">{emoji}</span>
          {title}
        </h3>
        <div className="space-y-3">
          {plants.map((plant, index) => {
            const globalIndex = displayPlants.indexOf(plant);
            return (
              <div key={globalIndex} className="border border-sbtp-green-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={plant.name}
                          onChange={(e) => updatePlant(globalIndex, 'name', e.target.value)}
                          placeholder="Plant name"
                          className="font-semibold"
                        />
                        <Input
                          value={plant.variety || ''}
                          onChange={(e) => updatePlant(globalIndex, 'variety', e.target.value)}
                          placeholder="Variety (optional)"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlant(globalIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={plant.plantingTime}
                        onChange={(e) => updatePlant(globalIndex, 'plantingTime', e.target.value)}
                        placeholder="Planting time"
                      />
                      <Input
                        value={plant.harvestTime}
                        onChange={(e) => updatePlant(globalIndex, 'harvestTime', e.target.value)}
                        placeholder="Harvest time"
                      />
                      <Input
                        value={plant.spacing}
                        onChange={(e) => updatePlant(globalIndex, 'spacing', e.target.value)}
                        placeholder="Spacing"
                      />
                      <Input
                        value={plant.yield}
                        onChange={(e) => updatePlant(globalIndex, 'yield', e.target.value)}
                        placeholder="Expected yield"
                      />
                    </div>
                    <Textarea
                      value={plant.careInstructions}
                      onChange={(e) => updatePlant(globalIndex, 'careInstructions', e.target.value)}
                      placeholder="Care instructions"
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sbtp-green-700">
                        {plant.name}
                        {plant.variety && <span className="text-sm text-sbtp-brown-500"> ({plant.variety})</span>}
                      </h3>
                      <div className="flex space-x-2">
                        <Badge variant={plant.difficulty === 'Easy' ? 'default' : plant.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                          {plant.difficulty}
                        </Badge>
                        {(plant as any).aiInsights && (
                          <Badge variant="outline" className="bg-sbtp-blue-50 border-sbtp-blue-200 text-sbtp-blue-700">
                            AI: {(plant as any).aiInsights.successRate}% success
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Plant:</strong> {plant.plantingTime}</p>
                      <p><strong>Harvest:</strong> {plant.harvestTime}</p>
                      <p><strong>Spacing:</strong> {plant.spacing}</p>
                      <p><strong>Expected Yield:</strong> {plant.yield}</p>
                      <p><strong>Care:</strong> {plant.careInstructions}</p>
                      {(plant as any).aiInsights && (plant as any).aiInsights.commonIssues.length > 0 && (
                        <p><strong>Common Issues:</strong> {(plant as any).aiInsights.commonIssues.join(', ')}</p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-sbtp-green-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onShareExperience(plant.name)}
                        className="text-sbtp-green-700 border-sbtp-green-300 hover:bg-sbtp-green-50"
                      >
                        Share Experience with {plant.name}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Leaf className="mr-2" />
            Recommended Plants for Your Space
          </CardTitle>
          {onPlanUpdate && (
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Plan
                </Button>
              ) : (
                <>
                  <Button onClick={handleSaveChanges} variant="default" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border-2 border-red-200">
            {renderPlantSection('Fruits', fruits, '🍓')}
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
            {renderPlantSection('Vegetables', veggies, '🥬')}
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
            {renderPlantSection('Flowers & Herbs', flowers, '🌸')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantRecommendations;