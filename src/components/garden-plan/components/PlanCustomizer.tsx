import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit3, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface GardenSection {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface PlanCustomizerProps {
  plantRecommendations: PlantRecommendation[];
  gardenLayout: GardenSection[];
  onPlanUpdate: (updatedPlan: { plantRecommendations: PlantRecommendation[], gardenLayout: GardenSection[] }) => void;
}

const PlanCustomizer: React.FC<PlanCustomizerProps> = ({ 
  plantRecommendations, 
  gardenLayout, 
  onPlanUpdate 
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlants, setEditedPlants] = useState<PlantRecommendation[]>(plantRecommendations);
  const [editedLayout, setEditedLayout] = useState<GardenSection[]>(gardenLayout);
  const [newPlant, setNewPlant] = useState<Partial<PlantRecommendation>>({});
  const [showAddPlant, setShowAddPlant] = useState(false);

  const handleSaveChanges = () => {
    onPlanUpdate({ 
      plantRecommendations: editedPlants, 
      gardenLayout: editedLayout 
    });
    setIsEditing(false);
    toast({
      title: "Plan Updated",
      description: "Your garden plan has been successfully customized.",
    });
  };

  const handleCancelEdit = () => {
    setEditedPlants(plantRecommendations);
    setEditedLayout(gardenLayout);
    setIsEditing(false);
    setShowAddPlant(false);
  };

  const removePlant = (index: number) => {
    setEditedPlants(prev => prev.filter((_, i) => i !== index));
  };

  const addNewPlant = () => {
    if (newPlant.name && newPlant.plantingTime && newPlant.harvestTime) {
      const plant: PlantRecommendation = {
        name: newPlant.name || '',
        variety: newPlant.variety || '',
        plantingTime: newPlant.plantingTime || '',
        harvestTime: newPlant.harvestTime || '',
        spacing: newPlant.spacing || '12 inches',
        careInstructions: newPlant.careInstructions || 'Regular watering and full sun',
        difficulty: newPlant.difficulty || 'Medium',
        yield: newPlant.yield || 'Moderate'
      };
      setEditedPlants(prev => [...prev, plant]);
      setNewPlant({});
      setShowAddPlant(false);
      toast({
        title: "Plant Added",
        description: `${plant.name} has been added to your garden plan.`,
      });
    }
  };

  const updatePlant = (index: number, field: keyof PlantRecommendation, value: string) => {
    setEditedPlants(prev => prev.map((plant, i) => 
      i === index ? { ...plant, [field]: value } : plant
    ));
  };

  const updateSection = (index: number, field: keyof GardenSection, value: string | string[]) => {
    setEditedLayout(prev => prev.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ));
  };

  const addNewSection = () => {
    const newSection: GardenSection = {
      section: 'New Section',
      plants: [],
      size: '4x4 feet',
      notes: 'Custom section'
    };
    setEditedLayout(prev => [...prev, newSection]);
  };

  const removeSection = (index: number) => {
    setEditedLayout(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sbtp-green-800">
          <div className="flex items-center">
            <Edit3 className="mr-2" />
            Customize Your Garden Plan
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit} size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit Plan
              </Button>
            )}
          </div>
        </CardTitle>
        <p className="text-sm text-sbtp-brown-600">
          Modify, add, or remove plants and sections to personalize your AI-generated garden plan.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plant Recommendations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sbtp-green-700">Plant Recommendations</h3>
            {isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddPlant(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Plant
              </Button>
            )}
          </div>

          {showAddPlant && (
            <Card className="mb-4 border-dashed border-sbtp-green-300">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Plant name"
                    value={newPlant.name || ''}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Variety (optional)"
                    value={newPlant.variety || ''}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, variety: e.target.value }))}
                  />
                  <Input
                    placeholder="Planting time"
                    value={newPlant.plantingTime || ''}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, plantingTime: e.target.value }))}
                  />
                  <Input
                    placeholder="Harvest time"
                    value={newPlant.harvestTime || ''}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, harvestTime: e.target.value }))}
                  />
                  <Select onValueChange={(value) => setNewPlant(prev => ({ ...prev, difficulty: value as 'Easy' | 'Medium' | 'Hard' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Expected yield"
                    value={newPlant.yield || ''}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, yield: e.target.value }))}
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={addNewPlant} size="sm">Add Plant</Button>
                  <Button variant="outline" onClick={() => setShowAddPlant(false)} size="sm">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {editedPlants.map((plant, index) => (
              <Card key={index} className="border-sbtp-green-100">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={plant.name}
                            onChange={(e) => updatePlant(index, 'name', e.target.value)}
                            placeholder="Plant name"
                          />
                          <Input
                            value={plant.variety}
                            onChange={(e) => updatePlant(index, 'variety', e.target.value)}
                            placeholder="Variety"
                          />
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
                          <Select 
                            value={plant.difficulty} 
                            onValueChange={(value) => updatePlant(index, 'difficulty', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={plant.yield}
                            onChange={(e) => updatePlant(index, 'yield', e.target.value)}
                            placeholder="Expected yield"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sbtp-green-700">
                              {plant.name} {plant.variety && `(${plant.variety})`}
                            </h4>
                            <Badge variant={plant.difficulty === 'Easy' ? 'default' : plant.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                              {plant.difficulty}
                            </Badge>
                          </div>
                          <div className="text-sm text-sbtp-brown-600 space-y-1">
                            <p><strong>Plant:</strong> {plant.plantingTime}</p>
                            <p><strong>Harvest:</strong> {plant.harvestTime}</p>
                            <p><strong>Spacing:</strong> {plant.spacing}</p>
                            <p><strong>Expected Yield:</strong> {plant.yield}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePlant(index)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Garden Layout Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sbtp-green-700">Garden Layout</h3>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addNewSection}>
                <Plus className="w-4 h-4 mr-1" />
                Add Section
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {editedLayout.map((section, index) => (
              <Card key={index} className="border-sbtp-green-100">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-4">
                          <Input
                            value={section.section}
                            onChange={(e) => updateSection(index, 'section', e.target.value)}
                            placeholder="Section name"
                          />
                          <Input
                            value={section.size}
                            onChange={(e) => updateSection(index, 'size', e.target.value)}
                            placeholder="Section size"
                          />
                          <Textarea
                            value={section.plants.join(', ')}
                            onChange={(e) => updateSection(index, 'plants', e.target.value.split(', ').filter(p => p.trim()))}
                            placeholder="Plants (comma-separated)"
                          />
                          <Textarea
                            value={section.notes}
                            onChange={(e) => updateSection(index, 'notes', e.target.value)}
                            placeholder="Notes"
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-sbtp-green-700 mb-2">{section.section}</h4>
                          <div className="text-sm text-sbtp-brown-600 space-y-1">
                            <p><strong>Size:</strong> {section.size}</p>
                            <p><strong>Plants:</strong> {section.plants.join(', ')}</p>
                            <p><strong>Notes:</strong> {section.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSection(index)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCustomizer;