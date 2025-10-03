import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sprout, Sun, Home, User, ShieldCheck, Droplets, Clock } from "lucide-react";

interface GardenQuestionsProps {
  onQuestionsComplete: (answers: {
    spaceType: string;
    spaceSize: string;
    sunlight: string;
    experience_level: string;
    soil_contaminated: string;
    soil_type: string;
    rainfall: string;
    season: string[];
    time_commitment: string;
  }) => void;
}

const GardenQuestions: React.FC<GardenQuestionsProps> = ({ onQuestionsComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    spaceType: '',
    spaceSize: '',
    sunlight: '',
    experience_level: '',
    soil_contaminated: '',
    soil_type: '',
    rainfall: '',
    season: [] as string[],
    time_commitment: ''
  });

  const questions = [
    {
      id: 'spaceType',
      icon: <Sprout className="h-8 w-8 text-sbtp-green-600" />,
      title: 'What type of garden are you planting?',
      description: 'Tell us about the style and growing method you want to use',
      options: [
        { value: 'container', label: 'Container Garden (pots, planters)' },
        { value: 'raised-bed', label: 'Raised Bed Garden' },
        { value: 'in-ground', label: 'Traditional In-Ground Garden' },
        { value: 'vertical', label: 'Vertical Garden (wall-mounted)' },
        { value: 'indoor', label: 'Indoor Garden (windowsill, grow lights)' },
        { value: 'rooftop', label: 'Rooftop Garden' },
        { value: 'hydroponic', label: 'Hydroponic' }
      ]
    },
    {
      id: 'spaceSize',
      icon: <Home className="h-8 w-8 text-sbtp-green-600" />,
      title: 'How much space do you have?',
      description: 'Help us understand the size of your growing area',
      options: [
        { value: 'small', label: 'Small (windowsill, few containers)' },
        { value: 'medium', label: 'Medium (balcony, small patio)' },
        { value: 'large', label: 'Large (backyard, rooftop)' },
        { value: 'very-large', label: 'Very Large (community garden plot)' }
      ]
    },
    {
      id: 'sunlight',
      icon: <Sun className="h-8 w-8 text-sbtp-green-600" />,
      title: 'How much sunlight does your space get?',
      description: 'Sunlight exposure is crucial for plant selection',
      options: [
        { value: 'full-sun', label: 'Full Sun (6+ hours direct sunlight)' },
        { value: 'partial-sun', label: 'Partial Sun (4-6 hours direct sunlight)' },
        { value: 'partial-shade', label: 'Partial Shade (2-4 hours direct sunlight)' },
        { value: 'shade', label: 'Shade (less than 2 hours direct sunlight)' },
        { value: 'artificial', label: 'Artificial Light Only (grow lights)' }
      ]
    },
    {
      id: 'soil_contaminated',
      icon: <ShieldCheck className="h-8 w-8 text-sbtp-green-600" />,
      title: 'Is your soil potentially contaminated?',
      description: 'Urban soil can contain lead or other contaminants',
      options: [
        { value: 'no', label: 'No - My soil is safe' },
        { value: 'yes', label: 'Yes - I need container/raised bed solutions' },
        { value: 'unknown', label: "I'm not sure" }
      ]
    },
    {
      id: 'soil_type',
      icon: <Sprout className="h-8 w-8 text-sbtp-green-600" />,
      title: 'What type of soil do you have?',
      description: 'Soil type affects drainage and plant selection',
      options: [
        { value: 'sandy', label: 'Sandy (drains quickly)' },
        { value: 'clay', label: 'Clay (heavy, drains slowly)' },
        { value: 'loamy', label: 'Loamy (balanced, ideal)' },
        { value: 'potting-mix', label: 'Potting Mix (container garden)' },
        { value: 'unknown', label: "I don't know" }
      ]
    },
    {
      id: 'rainfall',
      icon: <Droplets className="h-8 w-8 text-sbtp-green-600" />,
      title: 'How much rainfall does your area get?',
      description: 'This helps determine watering needs',
      options: [
        { value: 'low', label: 'Low (dry climate)' },
        { value: 'moderate', label: 'Moderate (regular rain)' },
        { value: 'high', label: 'High (rainy climate)' },
        { value: 'indoor', label: 'Indoor/No natural rainfall' }
      ]
    },
    {
      id: 'season',
      icon: <Sun className="h-8 w-8 text-sbtp-green-600" />,
      title: 'Which seasons do you want to grow in?',
      description: 'Select all seasons you plan to garden (you can choose multiple)',
      options: [
        { value: 'spring', label: 'Spring (March-May)' },
        { value: 'summer', label: 'Summer (June-August)' },
        { value: 'fall', label: 'Fall (September-November)' },
        { value: 'winter', label: 'Winter (December-February)' }
      ],
      multiSelect: true
    },
    {
      id: 'time_commitment',
      icon: <Clock className="h-8 w-8 text-sbtp-green-600" />,
      title: 'How much time can you dedicate?',
      description: 'We\'ll match plants to your schedule',
      options: [
        { value: 'minimal', label: 'Minimal (check weekly)' },
        { value: 'moderate', label: 'Moderate (few times per week)' },
        { value: 'dedicated', label: 'Dedicated (daily care)' }
      ]
    },
    {
      id: 'experience_level',
      icon: <User className="h-8 w-8 text-sbtp-green-600" />,
      title: 'What is your gardening experience level?',
      description: 'We\'ll tailor our recommendations to your skill level',
      options: [
        { value: 'beginner', label: 'Beginner (never grown anything before)' },
        { value: 'novice', label: 'Novice (grown a few plants)' },
        { value: 'intermediate', label: 'Intermediate (successful garden seasons)' },
        { value: 'advanced', label: 'Advanced (experienced gardener)' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleMultiSelectChange = (value: string) => {
    setAnswers(prev => {
      const currentValues = prev.season as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        season: newValues
      };
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onQuestionsComplete(answers);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const currentAnswer = answers[currentQuestion.id as keyof typeof answers];
  const isMultiSelect = currentQuestion.multiSelect;
  const hasAnswer = isMultiSelect ? (answers.season as string[]).length > 0 : !!currentAnswer;

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-sbtp-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {currentQuestion.icon}
        </div>
        <div className="flex justify-center mb-4">
          <div className="text-sm text-sbtp-brown-500">
            Step {currentStep + 1} of {questions.length}
          </div>
        </div>
        <CardTitle className="text-sbtp-green-700">{currentQuestion.title}</CardTitle>
        <CardDescription className="text-sbtp-brown-500">
          {currentQuestion.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isMultiSelect ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.value}
                  checked={(answers.season as string[]).includes(option.value)}
                  onCheckedChange={() => handleMultiSelectChange(option.value)}
                />
                <Label 
                  htmlFor={option.value} 
                  className="cursor-pointer flex-1 p-3 rounded-lg border border-gray-200 hover:bg-sbtp-green-50 transition-colors"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={currentAnswer as string} onValueChange={handleAnswerChange}>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="cursor-pointer flex-1 p-3 rounded-lg border border-gray-200 hover:bg-sbtp-green-50 transition-colors"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex-1 bg-sbtp-green-500 hover:bg-sbtp-green-600"
          >
            {isLastStep ? 'Continue' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenQuestions;