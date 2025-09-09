import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target, Leaf, Droplets, ShieldCheck, Clock } from "lucide-react";

interface GardenGoalsProps {
  onGoalsComplete: (goals: {
    whatToGrow: string[];
    preferences: string[];
    additionalNotes: string;
  }) => void;
}

const GardenGoals: React.FC<GardenGoalsProps> = ({ onGoalsComplete }) => {
  const [whatToGrow, setWhatToGrow] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const growOptions = [
    'Leafy Greens (lettuce, spinach, kale)',
    'Herbs (basil, parsley, cilantro, mint)',
    'Tomatoes',
    'Peppers',
    'Root Vegetables (carrots, radishes, beets)',
    'Microgreens',
    'Onions and Garlic',
    'Beans and Peas',
    'Squash and Cucumbers'
  ];

  const preferenceOptions = [
    { 
      value: 'drought-resistant', 
      label: 'Drought Resistant', 
      icon: <Droplets className="h-4 w-4" />,
      description: 'Plants that need minimal watering'
    },
    { 
      value: 'native-plants', 
      label: 'Native Plants', 
      icon: <Leaf className="h-4 w-4" />,
      description: 'Plants native to the NYC region'
    },
    { 
      value: 'low-maintenance', 
      label: 'Low Maintenance', 
      icon: <Clock className="h-4 w-4" />,
      description: 'Easy care plants for busy schedules'
    },
    { 
      value: 'pest-resistant', 
      label: 'Pest Resistant', 
      icon: <ShieldCheck className="h-4 w-4" />,
      description: 'Plants that naturally resist common pests'
    },
    { 
      value: 'fast-growing', 
      label: 'Fast Growing', 
      icon: <Target className="h-4 w-4" />,
      description: 'Quick results and fast harvests'
    },
    { 
      value: 'year-round', 
      label: 'Year-Round Growing', 
      icon: <Leaf className="h-4 w-4" />,
      description: 'Plants for continuous harvests'
    }
  ];

  const handleGrowChange = (item: string, checked: boolean) => {
    if (checked) {
      setWhatToGrow(prev => [...prev, item]);
    } else {
      setWhatToGrow(prev => prev.filter(i => i !== item));
    }
  };

  const handlePreferenceChange = (item: string, checked: boolean) => {
    if (checked) {
      setPreferences(prev => [...prev, item]);
    } else {
      setPreferences(prev => prev.filter(i => i !== item));
    }
  };

  const handleSubmit = () => {
    onGoalsComplete({
      whatToGrow,
      preferences,
      additionalNotes
    });
  };

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-sbtp-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-sbtp-green-600" />
        </div>
        <CardTitle className="text-sbtp-green-700">What are your garden goals?</CardTitle>
        <CardDescription className="text-sbtp-brown-500">
          Tell us what you want to grow and your preferences so we can create the perfect plan for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* What to Grow Section */}
        <div>
          <h3 className="text-lg font-semibold text-sbtp-green-700 mb-4">What would you like to grow?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {growOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`grow-${option}`}
                  checked={whatToGrow.includes(option)}
                  onCheckedChange={(checked) => handleGrowChange(option, checked as boolean)}
                />
                <Label 
                  htmlFor={`grow-${option}`} 
                  className="cursor-pointer text-sm text-sbtp-brown-600"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="text-lg font-semibold text-sbtp-green-700 mb-4">Any specific preferences?</h3>
          <div className="space-y-3">
            {preferenceOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-sbtp-green-50 transition-colors">
                <Checkbox
                  id={`pref-${option.value}`}
                  checked={preferences.includes(option.value)}
                  onCheckedChange={(checked) => handlePreferenceChange(option.value, checked as boolean)}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={`pref-${option.value}`} 
                    className="cursor-pointer flex items-center gap-2 font-medium text-sbtp-brown-700"
                  >
                    {option.icon}
                    {option.label}
                  </Label>
                  <p className="text-xs text-sbtp-brown-500 mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes" className="text-lg font-semibold text-sbtp-green-700">
            Additional notes or special requirements?
          </Label>
          <p className="text-sm text-sbtp-brown-500 mb-3">
            Tell us about any specific needs, challenges, or goals we should consider.
          </p>
          <Textarea
            id="notes"
            placeholder="e.g., I have pets that might eat plants, I want to attract pollinators, I have limited budget..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={whatToGrow.length === 0}
          className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600"
        >
          Generate My Garden Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default GardenGoals;