import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Camera, Image as ImageIcon, Sparkles, MapPin, Info } from "lucide-react";
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
  companions?: string[];
}

interface PlantPlacement {
  id: string;
  plant: PlantRecommendation;
  x: number;
  y: number;
}

interface AIGardenPhotoPlannerProps {
  plantRecommendations: PlantRecommendation[];
  onLayoutComplete: (placements: PlantPlacement[], uploadedImage?: { file: File; previewUrl: string }) => void;
}

const AIGardenPhotoPlanner: React.FC<AIGardenPhotoPlannerProps> = ({
  plantRecommendations,
  onLayoutComplete
}) => {
  const [uploadedImage, setUploadedImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);
  const [plantPlacements, setPlantPlacements] = useState<PlantPlacement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingAISuggestions, setIsGeneratingAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage({ file, previewUrl });
    
    toast({
      title: "Garden Photo Uploaded",
      description: "Your garden photo has been uploaded successfully! Now select plants to place them.",
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedPlant || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const placement: PlantPlacement = {
      id: `plant-${Date.now()}`,
      plant: selectedPlant,
      x,
      y
    };

    setPlantPlacements(prev => [...prev, placement]);
    
    toast({
      title: "Plant Placed",
      description: `${selectedPlant.name} has been placed in your garden!`,
    });
  };

  const removePlant = (plantId: string) => {
    setPlantPlacements(prev => prev.filter(p => p.id !== plantId));
  };

  const generateAISuggestions = async () => {
    if (!uploadedImage || plantPlacements.length === 0) return;

    setIsGeneratingAISuggestions(true);
    
    try {
      // Simulate AI analysis (in real implementation, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions = [
        "Consider spacing your tomatoes at least 18 inches apart for optimal growth",
        "Lettuce plants should be placed in partially shaded areas during summer months",
        "Place taller plants like tomatoes on the north side to avoid shading shorter plants",
        "Consider companion planting: basil near tomatoes can improve flavor and pest control",
        "Ensure adequate space between plant rows (24-36 inches) for maintenance access"
      ];
      
      setAISuggestions(suggestions.slice(0, 3)); // Show top 3 suggestions
      
      toast({
        title: "AI Analysis Complete",
        description: "Garden placement suggestions generated based on your layout!",
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Unable to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAISuggestions(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getPlantEmoji = (plantName: string): string => {
    const name = plantName.toLowerCase();
    if (name.includes('tomato')) return '🍅';
    if (name.includes('lettuce')) return '🥬';
    if (name.includes('basil')) return '🌿';
    if (name.includes('pepper')) return '🌶️';
    if (name.includes('carrot')) return '🥕';
    if (name.includes('cucumber')) return '🥒';
    if (name.includes('bean')) return '🫘';
    if (name.includes('corn')) return '🌽';
    return '🌱';
  };

  const handleComplete = () => {
    onLayoutComplete(plantPlacements, uploadedImage || undefined);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-sbtp-green-800 flex items-center gap-2">
          <Camera className="h-6 w-6" />
          AI Garden Photo Planner
        </CardTitle>
        <p className="text-sbtp-brown-600">
          Upload a photo of your garden space and place plants exactly where you want them. Get AI suggestions for optimal placement.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadedImage ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-sbtp-green-500 bg-sbtp-green-50'
                : 'border-sbtp-green-300 bg-sbtp-green-25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-sbtp-green-100 rounded-full">
                <Upload className="h-8 w-8 text-sbtp-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-sbtp-green-800">
                  Upload Garden Photo
                </h3>
                <p className="text-sm text-sbtp-brown-600">
                  Drag and drop a photo of your garden space, or click to browse
                </p>
                <p className="text-xs text-sbtp-brown-500">
                  Supports JPG, PNG, WebP • Max 10MB
                </p>
              </div>

              <Button
                onClick={triggerFileInput}
                className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
                type="button"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Choose Photo
              </Button>
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plant Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Select a Plant to Place</h3>
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
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getPlantEmoji(plant.name)}</span>
                        <div className="font-medium text-sm">{plant.name}</div>
                      </div>
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

            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {selectedPlant 
                  ? `Click anywhere on your garden photo to place ${selectedPlant.name}. Click on existing plant markers to remove them.`
                  : "Select a plant above, then click on your garden photo to place it where you want it to grow."
                }
              </AlertDescription>
            </Alert>

            {/* Garden Photo with Plant Placements */}
            <div className="relative">
              <div
                ref={imageContainerRef}
                className="relative w-full h-96 rounded-lg overflow-hidden border border-sbtp-green-200 cursor-crosshair"
                onClick={handleImageClick}
              >
                <img
                  src={uploadedImage.previewUrl}
                  alt="Garden space"
                  className="w-full h-full object-cover"
                />
                
                {/* Plant placement markers */}
                {plantPlacements.map((placement) => (
                  <div
                    key={placement.id}
                    className="absolute w-10 h-10 bg-sbtp-green-500 border-3 border-white rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: `${placement.x}%`,
                      top: `${placement.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlant(placement.id);
                    }}
                    title={`${placement.plant.name} - Click to remove`}
                  >
                    {getPlantEmoji(placement.plant.name)}
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => setUploadedImage(null)}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Plant Summary */}
            {plantPlacements.length > 0 && (
              <div className="bg-sbtp-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sbtp-green-800">
                    Plants Placed ({plantPlacements.length})
                  </h4>
                  <Button
                    onClick={generateAISuggestions}
                    disabled={isGeneratingAISuggestions}
                    size="sm"
                    className="bg-sbtp-blue hover:bg-sbtp-blue/90"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGeneratingAISuggestions ? "Analyzing..." : "Get AI Suggestions"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plantPlacements.map((placement) => (
                    <Badge key={placement.id} variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-800">
                      {getPlantEmoji(placement.plant.name)} {placement.plant.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="bg-sbtp-blue/10 border border-sbtp-blue/20 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-blue mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Garden Placement Suggestions
                </h4>
                <ul className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-sbtp-blue flex items-start gap-2">
                      <span className="text-sbtp-blue/60">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-sbtp-brown-600">
            {uploadedImage ? "Click plants to remove them" : "Upload a photo to get started"}
          </div>
          <Button 
            onClick={handleComplete}
            disabled={!uploadedImage}
            className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
          >
            Continue with Garden Plan ({plantPlacements.length} plants placed)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIGardenPhotoPlanner;