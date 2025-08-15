import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sprout, Sun, Home, User } from "lucide-react";

interface GardenQuestionsProps {
  onQuestionsComplete: (answers: {
    gardenType: string;
    spaceSize: string;
    sunlight: string;
    experience: string;
  }) => void;
}

const GardenQuestions: React.FC<GardenQuestionsProps> = ({ onQuestionsComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    gardenType: '',
    spaceSize: '',
    sunlight: '',
    experience: ''
  });

  const questions = [
    {
      id: 'gardenType',
      icon: <Sprout className="h-8 w-8 text-sbtp-green-600" />,
      title: 'What type of garden are you planting?',
      description: 'Tell us about the style of garden you want to create',
      options: [
        { value: 'container', label: 'Container Garden (pots, planters)' },
        { value: 'raised-bed', label: 'Raised Bed Garden' },
        { value: 'in-ground', label: 'In-Ground Garden' },
        { value: 'vertical', label: 'Vertical Garden (wall-mounted)' },
        { value: 'indoor', label: 'Indoor Garden (windowsill, grow lights)' },
        { value: 'rooftop', label: 'Rooftop Garden' }
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
      id: 'experience',
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
        <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
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
            disabled={!currentAnswer}
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