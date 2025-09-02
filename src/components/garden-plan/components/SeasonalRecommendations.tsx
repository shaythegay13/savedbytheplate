import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Thermometer, Droplets } from 'lucide-react';
import { GardenPlanFormData } from '../types';

interface SeasonalPlant {
  name: string;
  variety: string;
  plantingWindow: string;
  harvestTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  climateNotes: string;
  spacing: string;
  emoji: string;
}

interface SeasonalRecommendationsProps {
  formData?: GardenPlanFormData;
  onPlantSelect?: (plants: SeasonalPlant[]) => void;
}

const SeasonalRecommendations: React.FC<SeasonalRecommendationsProps> = ({
  formData,
  onPlantSelect
}) => {
  const [currentSeason, setCurrentSeason] = useState<string>('spring');
  const [selectedPlants, setSelectedPlants] = useState<SeasonalPlant[]>([]);
  const [location, setLocation] = useState(formData?.city || 'Your Area');

  // Seasonal plant recommendations by season
  const seasonalPlants: Record<string, SeasonalPlant[]> = {
    spring: [
      {
        name: 'Lettuce',
        variety: 'Buttercrunch',
        plantingWindow: 'March - May',
        harvestTime: '45-65 days',
        difficulty: 'Easy',
        climateNotes: 'Cool weather crop, bolt in heat',
        spacing: '4-6 inches apart',
        emoji: '🥬'
      },
      {
        name: 'Radish',
        variety: 'Cherry Belle',
        plantingWindow: 'March - May',
        harvestTime: '20-30 days',
        difficulty: 'Easy',
        climateNotes: 'Fast growing, cool season',
        spacing: '1-2 inches apart',
        emoji: '🔴'
      },
      {
        name: 'Spinach',
        variety: 'Space',
        plantingWindow: 'March - April',
        harvestTime: '40-50 days',
        difficulty: 'Easy',
        climateNotes: 'Cool weather preferred',
        spacing: '3-4 inches apart',
        emoji: '🌿'
      },
      {
        name: 'Peas',
        variety: 'Sugar Snap',
        plantingWindow: 'March - April',
        harvestTime: '60-70 days',
        difficulty: 'Medium',
        climateNotes: 'Cool weather, provide support',
        spacing: '2-3 inches apart',
        emoji: '🟢'
      },
      {
        name: 'Carrot',
        variety: 'Nantes',
        plantingWindow: 'April - May',
        harvestTime: '70-80 days',
        difficulty: 'Medium',
        climateNotes: 'Cool weather, loose soil needed',
        spacing: '2-3 inches apart',
        emoji: '🥕'
      }
    ],
    summer: [
      {
        name: 'Tomato',
        variety: 'Cherokee Purple',
        plantingWindow: 'May - June',
        harvestTime: '75-85 days',
        difficulty: 'Medium',
        climateNotes: 'Warm weather, needs support',
        spacing: '18-24 inches apart',
        emoji: '🍅'
      },
      {
        name: 'Pepper',
        variety: 'Bell Pepper',
        plantingWindow: 'May - June',
        harvestTime: '70-80 days',
        difficulty: 'Medium',
        climateNotes: 'Warm weather lover',
        spacing: '12-18 inches apart',
        emoji: '🌶️'
      },
      {
        name: 'Basil',
        variety: 'Genovese',
        plantingWindow: 'May - July',
        harvestTime: '60-90 days',
        difficulty: 'Easy',
        climateNotes: 'Warm weather, pinch flowers',
        spacing: '6-12 inches apart',
        emoji: '🌿'
      },
      {
        name: 'Cucumber',
        variety: 'Marketmore',
        plantingWindow: 'May - June',
        harvestTime: '50-65 days',
        difficulty: 'Easy',
        climateNotes: 'Warm weather, needs water',
        spacing: '12-18 inches apart',
        emoji: '🥒'
      },
      {
        name: 'Zucchini',
        variety: 'Black Beauty',
        plantingWindow: 'May - June',
        harvestTime: '50-60 days',
        difficulty: 'Easy',
        climateNotes: 'Warm weather, prolific producer',
        spacing: '24-36 inches apart',
        emoji: '🥒'
      }
    ],
    fall: [
      {
        name: 'Kale',
        variety: 'Winterbor',
        plantingWindow: 'August - September',
        harvestTime: '55-75 days',
        difficulty: 'Easy',
        climateNotes: 'Cool weather, frost tolerant',
        spacing: '8-12 inches apart',
        emoji: '🥬'
      },
      {
        name: 'Broccoli',
        variety: 'Green Comet',
        plantingWindow: 'July - August',
        harvestTime: '70-85 days',
        difficulty: 'Medium',
        climateNotes: 'Cool weather preferred',
        spacing: '12-18 inches apart',
        emoji: '🥦'
      },
      {
        name: 'Brussels Sprouts',
        variety: 'Long Island',
        plantingWindow: 'July - August',
        harvestTime: '90-110 days',
        difficulty: 'Hard',
        climateNotes: 'Cool weather, long season',
        spacing: '18-24 inches apart',
        emoji: '🥬'
      },
      {
        name: 'Turnip',
        variety: 'Purple Top',
        plantingWindow: 'August - September',
        harvestTime: '50-60 days',
        difficulty: 'Easy',
        climateNotes: 'Cool weather preferred',
        spacing: '4-6 inches apart',
        emoji: '🔴'
      }
    ],
    winter: [
      {
        name: 'Garlic',
        variety: 'Hardneck',
        plantingWindow: 'October - November',
        harvestTime: '240-270 days',
        difficulty: 'Easy',
        climateNotes: 'Plant before freeze, harvest summer',
        spacing: '4-6 inches apart',
        emoji: '🧄'
      },
      {
        name: 'Mache',
        variety: 'Corn Salad',
        plantingWindow: 'September - October',
        harvestTime: '60-75 days',
        difficulty: 'Medium',
        climateNotes: 'Cold hardy, slow growing',
        spacing: '3-4 inches apart',
        emoji: '🥬'
      },
      {
        name: 'Winter Onion',
        variety: 'Evergreen Hardy',
        plantingWindow: 'September - October',
        harvestTime: '200-240 days',
        difficulty: 'Easy',
        climateNotes: 'Hardy, overwinter crop',
        spacing: '4-6 inches apart',
        emoji: '🧅'
      }
    ]
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  useEffect(() => {
    setCurrentSeason(getCurrentSeason());
  }, []);

  const togglePlantSelection = (plant: SeasonalPlant) => {
    const newSelection = selectedPlants.includes(plant)
      ? selectedPlants.filter(p => p !== plant)
      : [...selectedPlants, plant];
    
    setSelectedPlants(newSelection);
    onPlantSelect?.(newSelection);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderPlantCard = (plant: SeasonalPlant) => (
    <Card 
      key={plant.name}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedPlants.includes(plant) ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={() => togglePlantSelection(plant)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{plant.emoji}</span>
            <div>
              <h4 className="font-semibold text-slate-800">{plant.name}</h4>
              <p className="text-sm text-slate-600">{plant.variety}</p>
            </div>
          </div>
          <Badge className={getDifficultyColor(plant.difficulty)}>
            {plant.difficulty}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Plant: {plant.plantingWindow}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Thermometer className="w-4 h-4" />
            <span>Harvest: {plant.harvestTime}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{plant.spacing}</span>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 mt-2 italic">{plant.climateNotes}</p>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Seasonal Planting Guide
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
          </div>
          {selectedPlants.length > 0 && (
            <Badge variant="outline">
              {selectedPlants.length} selected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentSeason} onValueChange={setCurrentSeason}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="spring">🌱 Spring</TabsTrigger>
            <TabsTrigger value="summer">☀️ Summer</TabsTrigger>
            <TabsTrigger value="fall">🍂 Fall</TabsTrigger>
            <TabsTrigger value="winter">❄️ Winter</TabsTrigger>
          </TabsList>
          
          {Object.entries(seasonalPlants).map(([season, plants]) => (
            <TabsContent key={season} value={season} className="mt-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-1">
                    {season.charAt(0).toUpperCase() + season.slice(1)} Planting Tips
                  </h4>
                  <p className="text-sm text-blue-700">
                    {season === 'spring' && 'Start cool-season crops early. Watch for last frost dates.'}
                    {season === 'summer' && 'Plant heat-loving crops after soil warms. Provide adequate water.'}
                    {season === 'fall' && 'Perfect time for cool-season crops. Many taste better after light frost.'}
                    {season === 'winter' && 'Focus on cold-hardy varieties and season extension techniques.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plants.map(renderPlantCard)}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {selectedPlants.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Selected Plants for Your Garden</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPlants.map((plant) => (
                <Badge key={plant.name} variant="outline" className="bg-green-100 text-green-800">
                  {plant.emoji} {plant.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonalRecommendations;