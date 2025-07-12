import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, RotateCcw, History, AlertTriangle, TrendingUp } from "lucide-react";

interface CropRotationPlan {
  year: number;
  season: string;
  section: string;
  previousCrop: string;
  recommendedCrop: string;
  reason: string;
  soilHealth: 'Improved' | 'Maintained' | 'Depleted';
}

interface GardenHistory {
  year: number;
  season: string;
  plants: Array<{
    name: string;
    success: 'High' | 'Medium' | 'Low';
    yield: string;
    issues: string[];
    notes: string;
  }>;
  weatherConditions: string;
  lessons: string[];
}

interface MultiYearPlanningProps {
  currentYear?: number;
  gardenSections: Array<{ section: string; size: string; }>;
}

const MultiYearPlanning: React.FC<MultiYearPlanningProps> = ({ 
  currentYear = new Date().getFullYear(),
  gardenSections 
}) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Mock data - in real app, this would come from database
  const rotationPlans: CropRotationPlan[] = [
    {
      year: currentYear,
      season: 'Spring',
      section: 'Section A',
      previousCrop: 'Tomatoes (Nightshade)',
      recommendedCrop: 'Beans (Legume)',
      reason: 'Nitrogen fixation to restore soil nutrients',
      soilHealth: 'Improved'
    },
    {
      year: currentYear,
      season: 'Fall',
      section: 'Section A',
      previousCrop: 'Beans (Legume)',
      recommendedCrop: 'Leafy Greens (Brassica)',
      reason: 'Utilize nitrogen-rich soil from previous legumes',
      soilHealth: 'Maintained'
    },
    {
      year: currentYear + 1,
      season: 'Spring',
      section: 'Section A',
      previousCrop: 'Leafy Greens (Brassica)',
      recommendedCrop: 'Root Vegetables',
      reason: 'Deep roots help break up soil compaction',
      soilHealth: 'Improved'
    }
  ];

  const gardenHistory: GardenHistory[] = [
    {
      year: currentYear - 1,
      season: 'Spring/Summer',
      plants: [
        {
          name: 'Tomatoes',
          success: 'High',
          yield: '15 lbs',
          issues: ['Slight blight in late season'],
          notes: 'Cherokee Purple variety performed exceptionally well'
        },
        {
          name: 'Basil',
          success: 'High',
          yield: 'Abundant',
          issues: [],
          notes: 'Perfect companion planting with tomatoes'
        }
      ],
      weatherConditions: 'Hot summer with adequate rainfall',
      lessons: ['Companion planting was very effective', 'Need better air circulation for disease prevention']
    }
  ];

  const cropFamilies = {
    'Nightshade': ['Tomatoes', 'Peppers', 'Eggplant', 'Potatoes'],
    'Legume': ['Beans', 'Peas', 'Lentils'],
    'Brassica': ['Cabbage', 'Broccoli', 'Kale', 'Radishes'],
    'Root': ['Carrots', 'Beets', 'Turnips', 'Parsnips'],
    'Allium': ['Onions', 'Garlic', 'Leeks'],
    'Cucurbit': ['Cucumbers', 'Squash', 'Melons', 'Pumpkins']
  };

  const getRotationAdvice = (previousFamily: string) => {
    const rotationMap: Record<string, { next: string[], avoid: string[], reason: string }> = {
      'Nightshade': {
        next: ['Legume', 'Brassica'],
        avoid: ['Nightshade'],
        reason: 'Heavy feeders that deplete soil nutrients, follow with nitrogen-fixing legumes'
      },
      'Legume': {
        next: ['Brassica', 'Root', 'Nightshade'],
        avoid: ['Legume'],
        reason: 'Nitrogen fixers that improve soil, good for any heavy feeder to follow'
      },
      'Brassica': {
        next: ['Root', 'Allium', 'Legume'],
        avoid: ['Brassica'],
        reason: 'Can be prone to clubroot, rotate to prevent soil-borne diseases'
      }
    };
    return rotationMap[previousFamily] || { next: ['Any'], avoid: [], reason: 'General rotation recommended' };
  };

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Calendar className="mr-2" />
          Multi-Year Garden Planning
        </CardTitle>
        <p className="text-sm text-sbtp-brown-600">
          Plan crop rotations and track your garden's performance over multiple years for better soil health and yields.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rotation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rotation" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Crop Rotation
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Garden History
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Future Planning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rotation" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold text-sbtp-green-700">Crop Rotation Schedule</h3>
              <div className="flex gap-2">
                {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>

            <Alert className="border-sbtp-yellow/20 bg-sbtp-yellow/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Rotation Principle:</strong> Never plant the same family in the same location for consecutive years. 
                This prevents soil depletion and reduces pest/disease buildup.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {rotationPlans
                .filter(plan => plan.year === selectedYear)
                .map((plan, index) => (
                <Card key={index} className="border-sbtp-green-100">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-sbtp-green-700">{plan.section}</h4>
                          <Badge variant="outline">{plan.season} {plan.year}</Badge>
                          <Badge variant={plan.soilHealth === 'Improved' ? 'default' : plan.soilHealth === 'Maintained' ? 'secondary' : 'destructive'}>
                            {plan.soilHealth}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-sbtp-brown-600">
                          <p><strong>Previous:</strong> {plan.previousCrop}</p>
                          <p><strong>Recommended:</strong> {plan.recommendedCrop}</p>
                          <p><strong>Reasoning:</strong> {plan.reason}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-sbtp-blue/20 bg-sbtp-blue/5">
              <CardHeader>
                <CardTitle className="text-base text-sbtp-green-700">Crop Family Quick Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(cropFamilies).map(([family, crops]) => (
                    <div key={family} className="space-y-2">
                      <h5 className="font-medium text-sbtp-green-600">{family}</h5>
                      <div className="flex flex-wrap gap-1">
                        {crops.map(crop => (
                          <Badge key={crop} variant="outline" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h3 className="text-lg font-semibold text-sbtp-green-700">Garden Performance History</h3>
            
            {gardenHistory.map((record, index) => (
              <Card key={index} className="border-sbtp-green-100">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4" />
                    {record.season} {record.year}
                  </CardTitle>
                  <p className="text-sm text-sbtp-brown-600">{record.weatherConditions}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium text-sbtp-green-600 mb-2">Plant Performance</h5>
                    <div className="grid gap-3">
                      {record.plants.map((plant, plantIndex) => (
                        <div key={plantIndex} className="border border-sbtp-green-100 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <h6 className="font-medium text-sbtp-brown-700">{plant.name}</h6>
                            <Badge variant={plant.success === 'High' ? 'default' : plant.success === 'Medium' ? 'secondary' : 'destructive'}>
                              {plant.success} Success
                            </Badge>
                          </div>
                          <div className="text-sm text-sbtp-brown-600 space-y-1">
                            <p><strong>Yield:</strong> {plant.yield}</p>
                            {plant.issues.length > 0 && (
                              <p><strong>Issues:</strong> {plant.issues.join(', ')}</p>
                            )}
                            {plant.notes && <p><strong>Notes:</strong> {plant.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sbtp-green-600 mb-2">Key Lessons Learned</h5>
                    <ul className="list-disc list-inside text-sm text-sbtp-brown-600 space-y-1">
                      {record.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex}>{lesson}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full">
              Add This Season's Results
            </Button>
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            <h3 className="text-lg font-semibold text-sbtp-green-700">3-Year Rotation Strategy</h3>
            
            <Alert className="border-sbtp-blue/20 bg-sbtp-blue/5">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Recommendation:</strong> Based on your soil type and previous plantings, 
                we recommend a nitrogen-fixing → heavy feeder → light feeder rotation cycle for optimal soil health.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {gardenSections.map((section, index) => (
                <Card key={index} className="border-sbtp-green-100">
                  <CardHeader>
                    <CardTitle className="text-base">{section.section} - 3-Year Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border border-sbtp-green-200 rounded-lg">
                        <h5 className="font-medium text-sbtp-green-600 mb-2">Year 1 (Current)</h5>
                        <Badge className="mb-2">Legumes</Badge>
                        <p className="text-sm text-sbtp-brown-600">Beans, Peas<br/>Nitrogen fixation</p>
                      </div>
                      <div className="text-center p-4 border border-sbtp-green-200 rounded-lg">
                        <h5 className="font-medium text-sbtp-green-600 mb-2">Year 2</h5>
                        <Badge variant="secondary" className="mb-2">Heavy Feeders</Badge>
                        <p className="text-sm text-sbtp-brown-600">Tomatoes, Squash<br/>Use stored nitrogen</p>
                      </div>
                      <div className="text-center p-4 border border-sbtp-green-200 rounded-lg">
                        <h5 className="font-medium text-sbtp-green-600 mb-2">Year 3</h5>
                        <Badge variant="outline" className="mb-2">Light Feeders</Badge>
                        <p className="text-sm text-sbtp-brown-600">Herbs, Root Veg<br/>Soil restoration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiYearPlanning;