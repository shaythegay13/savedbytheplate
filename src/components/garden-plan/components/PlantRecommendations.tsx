import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

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
}

const PlantRecommendations: React.FC<PlantRecommendationsProps> = ({
  plantRecommendations,
  onShareExperience
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Leaf className="mr-2" />
          Recommended Plants for Your Space
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plantRecommendations.map((plant, index) => (
            <div key={index} className="border border-sbtp-green-200 rounded-lg p-4">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantRecommendations;