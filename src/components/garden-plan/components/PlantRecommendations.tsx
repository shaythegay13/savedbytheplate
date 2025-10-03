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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayPlants.map((plant, index) => (
            <div key={index} className="border border-sbtp-green-200 rounded-lg p-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={plant.name}
                        onChange={(e) => updatePlant(index, 'name', e.target.value)}
                        placeholder="Plant name"
                        className="font-semibold"
                      />
                      <Input
                        value={plant.variety || ''}
                        onChange={(e) => updatePlant(index, 'variety', e.target.value)}
                        placeholder="Variety (optional)"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlant(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={plant.plantingTime}
                      onChange={(e) => updatePlant(index, 'plantingTime', e.target.value)}
                      placeholder="Planting time"
                    />
                    <Input
                      value={plant.harvestTime}
                      onChange={(e) => updatePlant(index, 'harvestTime', e.target.value)}
                      placeholder="Harvest time"
                    />
                    <Input
                      value={plant.spacing}
                      onChange={(e) => updatePlant(index, 'spacing', e.target.value)}
                      placeholder="Spacing"
                    />
                    <Input
                      value={plant.yield}
                      onChange={(e) => updatePlant(index, 'yield', e.target.value)}
                      placeholder="Expected yield"
                    />
                  </div>
                  <Textarea
                    value={plant.careInstructions}
                    onChange={(e) => updatePlant(index, 'careInstructions', e.target.value)}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantRecommendations;