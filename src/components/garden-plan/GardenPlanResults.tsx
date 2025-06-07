
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Leaf, MapPin, Lightbulb, MessageCircle } from "lucide-react";

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

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface PlantingCalendar {
  month: string;
  activities: string[];
}

interface GardenPlanResultsProps {
  plantRecommendations: PlantRecommendation[];
  gardenLayout: GardenLayout[];
  plantingCalendar: PlantingCalendar[];
  careInstructions: string;
  expertTips: string[];
}

const GardenPlanResults: React.FC<GardenPlanResultsProps> = ({
  plantRecommendations,
  gardenLayout,
  plantingCalendar,
  careInstructions,
  expertTips
}) => {
  return (
    <div className="space-y-8">
      {/* Plant Recommendations */}
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
                  <Badge variant={plant.difficulty === 'Easy' ? 'default' : plant.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                    {plant.difficulty}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Plant:</strong> {plant.plantingTime}</p>
                  <p><strong>Harvest:</strong> {plant.harvestTime}</p>
                  <p><strong>Spacing:</strong> {plant.spacing}</p>
                  <p><strong>Expected Yield:</strong> {plant.yield}</p>
                  <p><strong>Care:</strong> {plant.careInstructions}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Garden Layout Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <MapPin className="mr-2" />
            Your Custom Garden Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gardenLayout.map((section, index) => (
              <div key={index} className="bg-sbtp-green-50 border border-sbtp-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-sbtp-green-700 mb-2">{section.section}</h3>
                <p className="text-sm text-sbtp-brown-600 mb-2">Size: {section.size}</p>
                <div className="space-y-1">
                  {section.plants.map((plant, plantIndex) => (
                    <Badge key={plantIndex} variant="outline" className="mr-1 mb-1">
                      {plant}
                    </Badge>
                  ))}
                </div>
                {section.notes && (
                  <p className="text-xs text-sbtp-brown-500 mt-2">{section.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customized Planting Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Calendar className="mr-2" />
            Your Personalized Planting Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plantingCalendar.map((month, index) => (
              <div key={index} className="border border-sbtp-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-sbtp-green-700 mb-3">{month.month}</h3>
                <ul className="space-y-1">
                  {month.activities.map((activity, activityIndex) => (
                    <li key={activityIndex} className="text-sm text-sbtp-brown-700 flex items-start">
                      <span className="w-2 h-2 bg-sbtp-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tailored Care Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Lightbulb className="mr-2" />
            Care Instructions Tailored to Your Garden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-sbtp-brown-700">{careInstructions}</div>
          </div>
        </CardContent>
      </Card>

      {/* Expert Tips & Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <MessageCircle className="mr-2" />
            Expert Tips & Troubleshooting Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expertTips.map((tip, index) => (
              <div key={index} className="bg-sbtp-yellow/10 border-l-4 border-sbtp-yellow p-4 rounded-r-lg">
                <p className="text-sbtp-brown-700">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GardenPlanResults;
