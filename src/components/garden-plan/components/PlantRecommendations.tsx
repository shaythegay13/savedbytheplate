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
  const basePlants = Array.isArray(plantRecommendations) ? plantRecommendations : [];
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlants, setEditedPlants] = useState<PlantRecommendation[]>(basePlants);
  const handleSaveChanges = () => {
    if (onPlanUpdate) {
      onPlanUpdate(editedPlants);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPlants(basePlants);
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

  const displayPlants = (isEditing ? editedPlants : basePlants) ?? [];

  // Categorize plants into 7 types
  const herbKeywords = ['basil', 'parsley', 'cilantro', 'mint', 'thyme', 'oregano', 'chive', 'rosemary', 'sage', 'dill', 'tarragon'];
  const leafyGreenKeywords = ['lettuce', 'spinach', 'kale', 'chard', 'arugula', 'collard', 'mustard green'];
  const vegetableKeywords = ['pepper', 'carrot', 'broccoli', 'radish', 'cabbage', 'cauliflower', 'eggplant', 'squash', 'zucchini', 'onion', 'garlic', 'potato', 'beet'];
  const legumeKeywords = ['bean', 'pea', 'lentil', 'chickpea', 'soybean'];
  const fruitKeywords = ['strawberr', 'raspberr', 'blueberr', 'tomato', 'melon', 'cucumber', 'apple', 'pear', 'peach', 'plum'];
  const grainKeywords = ['wheat', 'corn', 'oat', 'barley', 'rice', 'quinoa', 'amaranth'];
  const nutKeywords = ['peanut', 'almond', 'walnut', 'pecan', 'hazelnut', 'chestnut'];
  
  const categorizePlant = (plant: PlantRecommendation) => {
    const lowerName = plant.name.toLowerCase();
    if (herbKeywords.some(k => lowerName.includes(k))) return 'herbs';
    if (leafyGreenKeywords.some(k => lowerName.includes(k))) return 'leafy';
    if (legumeKeywords.some(k => lowerName.includes(k))) return 'legumes';
    if (grainKeywords.some(k => lowerName.includes(k))) return 'grains';
    if (nutKeywords.some(k => lowerName.includes(k))) return 'nuts';
    if (fruitKeywords.some(k => lowerName.includes(k))) return 'fruits';
    return 'vegetables';
  };

  const herbs = displayPlants.filter(p => categorizePlant(p) === 'herbs');
  const leafyGreens = displayPlants.filter(p => categorizePlant(p) === 'leafy');
  const vegetables = displayPlants.filter(p => categorizePlant(p) === 'vegetables');
  const legumes = displayPlants.filter(p => categorizePlant(p) === 'legumes');
  const fruits = displayPlants.filter(p => categorizePlant(p) === 'fruits');
  const grains = displayPlants.filter(p => categorizePlant(p) === 'grains');
  const nuts = displayPlants.filter(p => categorizePlant(p) === 'nuts');

  const categories = [
    { title: 'Multiple Herbs', plants: herbs, emoji: '🌿', color: 'from-green-50 to-emerald-50 border-green-200' },
    { title: 'Leafy Greens', plants: leafyGreens, emoji: '🥬', color: 'from-lime-50 to-green-50 border-lime-200' },
    { title: 'Vegetables', plants: vegetables, emoji: '🥕', color: 'from-orange-50 to-amber-50 border-orange-200' },
    { title: 'Legumes', plants: legumes, emoji: '🫘', color: 'from-amber-50 to-yellow-50 border-amber-200' },
    { title: 'Fruits', plants: fruits, emoji: '🍓', color: 'from-red-50 to-pink-50 border-red-200' },
    { title: 'Grains', plants: grains, emoji: '🌾', color: 'from-yellow-50 to-orange-50 border-yellow-200' },
    { title: 'Nuts', plants: nuts, emoji: '🥜', color: 'from-brown-50 to-amber-50 border-brown-200' }
  ].filter(cat => cat.plants.length > 0);

  const renderPlantCard = (plant: PlantRecommendation, globalIndex: number) => {
    return (
      <div key={globalIndex} className="border border-sbtp-green-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 space-y-2 min-w-0">
                <Input
                  value={plant.name}
                  onChange={(e) => updatePlant(globalIndex, 'name', e.target.value)}
                  placeholder="Plant name"
                  className="font-semibold text-sm"
                />
                <Input
                  value={plant.variety || ''}
                  onChange={(e) => updatePlant(globalIndex, 'variety', e.target.value)}
                  placeholder="Variety (optional)"
                  className="text-xs"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePlant(globalIndex)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={plant.plantingTime}
                onChange={(e) => updatePlant(globalIndex, 'plantingTime', e.target.value)}
                placeholder="Planting time"
                className="text-xs"
              />
              <Input
                value={plant.harvestTime}
                onChange={(e) => updatePlant(globalIndex, 'harvestTime', e.target.value)}
                placeholder="Harvest time"
                className="text-xs"
              />
              <Input
                value={plant.spacing}
                onChange={(e) => updatePlant(globalIndex, 'spacing', e.target.value)}
                placeholder="Spacing"
                className="text-xs"
              />
              <Input
                value={plant.yield}
                onChange={(e) => updatePlant(globalIndex, 'yield', e.target.value)}
                placeholder="Expected yield"
                className="text-xs"
              />
            </div>
            <Textarea
              value={plant.careInstructions}
              onChange={(e) => updatePlant(globalIndex, 'careInstructions', e.target.value)}
              placeholder="Care instructions"
              rows={2}
              className="text-xs"
            />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="font-semibold text-sbtp-green-700 text-sm line-clamp-2 flex-1 min-w-0">
                {plant.name}
                {plant.variety && <span className="text-xs text-sbtp-brown-500 block"> ({plant.variety})</span>}
              </h3>
              <Badge 
                variant={plant.difficulty === 'Easy' ? 'default' : plant.difficulty === 'Medium' ? 'secondary' : 'destructive'}
                className="text-xs shrink-0"
              >
                {plant.difficulty}
              </Badge>
            </div>
            <div className="space-y-1 text-xs flex-1">
              <p className="truncate"><strong>Plant:</strong> {plant.plantingTime}</p>
              <p className="truncate"><strong>Harvest:</strong> {plant.harvestTime}</p>
              <p className="truncate"><strong>Spacing:</strong> {plant.spacing}</p>
              <p className="truncate"><strong>Yield:</strong> {plant.yield}</p>
              <p className="line-clamp-2"><strong>Care:</strong> {plant.careInstructions}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-sbtp-green-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShareExperience(plant.name)}
                className="text-sbtp-green-700 border-sbtp-green-300 hover:bg-sbtp-green-50 w-full text-xs h-8"
              >
                Share Experience
              </Button>
            </div>
          </>
        )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.title} className={`bg-gradient-to-br ${category.color} rounded-lg p-4 border-2 flex flex-col`}>
              <h3 className="text-lg font-bold text-sbtp-green-700 flex items-center gap-2 mb-3">
                <span className="text-2xl">{category.emoji}</span>
                <span className="truncate">{category.title}</span>
              </h3>
              <div className="space-y-2 flex-1">
                {category.plants.map((plant) => {
                  const globalIndex = displayPlants.indexOf(plant);
                  return renderPlantCard(plant, globalIndex);
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantRecommendations;