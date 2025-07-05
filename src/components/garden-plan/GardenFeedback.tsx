import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Star, TrendingUp, MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GardenFeedbackProps {
  plantName: string;
  planId?: string;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  plantName: string;
  successRating: number;
  yieldRating: number;
  growthIssues: string;
  harvestNotes: string;
  wouldPlantAgain: boolean;
  seasonPlanted: string;
  actualHarvestTime: string;
}

const GardenFeedback: React.FC<GardenFeedbackProps> = ({
  plantName,
  planId,
  onFeedbackSubmit
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackData>({
    plantName,
    successRating: 0,
    yieldRating: 0,
    growthIssues: '',
    harvestNotes: '',
    wouldPlantAgain: false,
    seasonPlanted: '',
    actualHarvestTime: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingChange = (type: 'success' | 'yield', rating: number) => {
    setFeedback(prev => ({
      ...prev,
      [type === 'success' ? 'successRating' : 'yieldRating']: rating
    }));
  };

  const handleSubmit = async () => {
    if (feedback.successRating === 0 || feedback.yieldRating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide both success and yield ratings.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app, this would call an API to save feedback
      onFeedbackSubmit?.(feedback);
      setIsSubmitted(true);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you! Your feedback helps improve our AI recommendations for everyone.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-sbtp-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-sbtp-green-600" />
            <h3 className="text-lg font-semibold text-sbtp-green-800">
              Feedback Submitted!
            </h3>
            <p className="text-sbtp-brown-600">
              Your experience with {plantName} has been recorded and will help improve future recommendations.
            </p>
            <div className="bg-sbtp-yellow/10 border border-sbtp-yellow/20 rounded-lg p-4">
              <p className="text-sm text-sbtp-brown-700">
                🤖 Our AI is now learning from your experience to provide better recommendations to other gardeners with similar conditions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <MessageCircle className="mr-2" />
          How did your {plantName} perform?
        </CardTitle>
        <p className="text-sm text-sbtp-brown-600">
          Help our AI learn by sharing your garden experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Rating */}
        <div>
          <Label className="text-sbtp-brown-700 mb-2 block">
            Overall Success Rating
          </Label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingChange('success', star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= feedback.successRating
                      ? 'text-sbtp-yellow fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-sbtp-brown-500 mt-1">
            1 = Failed to grow, 5 = Excellent success
          </p>
        </div>

        {/* Yield Rating */}
        <div>
          <Label className="text-sbtp-brown-700 mb-2 block">
            Yield Rating
          </Label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingChange('yield', star)}
                className="focus:outline-none"
              >
                <TrendingUp
                  className={`h-6 w-6 ${
                    star <= feedback.yieldRating
                      ? 'text-sbtp-green-600 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-sbtp-brown-500 mt-1">
            1 = Very low yield, 5 = Abundant harvest
          </p>
        </div>

        {/* Season Planted */}
        <div>
          <Label htmlFor="season" className="text-sbtp-brown-700">
            When did you plant?
          </Label>
          <select
            id="season"
            value={feedback.seasonPlanted}
            onChange={(e) => setFeedback(prev => ({ ...prev, seasonPlanted: e.target.value }))}
            className="mt-1 w-full px-3 py-2 border border-sbtp-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sbtp-green-500"
          >
            <option value="">Select season</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>

        {/* Growth Issues */}
        <div>
          <Label htmlFor="issues" className="text-sbtp-brown-700">
            Any growth issues or challenges?
          </Label>
          <Textarea
            id="issues"
            placeholder="Describe any pests, diseases, or other challenges you encountered..."
            value={feedback.growthIssues}
            onChange={(e) => setFeedback(prev => ({ ...prev, growthIssues: e.target.value }))}
            className="mt-1"
          />
        </div>

        {/* Harvest Notes */}
        <div>
          <Label htmlFor="harvest" className="text-sbtp-brown-700">
            Harvest notes
          </Label>
          <Textarea
            id="harvest"
            placeholder="How was the harvest? Quality, quantity, timing..."
            value={feedback.harvestNotes}
            onChange={(e) => setFeedback(prev => ({ ...prev, harvestNotes: e.target.value }))}
            className="mt-1"
          />
        </div>

        {/* Would Plant Again */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="plant-again"
            checked={feedback.wouldPlantAgain}
            onChange={(e) => setFeedback(prev => ({ ...prev, wouldPlantAgain: e.target.checked }))}
            className="h-4 w-4 text-sbtp-green-600 rounded"
          />
          <Label htmlFor="plant-again" className="text-sbtp-brown-700">
            I would plant this again
          </Label>
        </div>

        <div className="bg-sbtp-blue/10 border border-sbtp-blue/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-sbtp-brown-700 mb-2">🌱 Help Our Community Grow</h4>
          <p className="text-xs text-sbtp-brown-600">
            Your feedback trains our AI to give better recommendations to gardeners with similar conditions, 
            climate, and experience levels. Every data point makes our suggestions smarter!
          </p>
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full bg-sbtp-green-600 hover:bg-sbtp-green-700"
          disabled={feedback.successRating === 0 || feedback.yieldRating === 0}
        >
          Submit Feedback & Help Our AI Learn
        </Button>
      </CardContent>
    </Card>
  );
};

export default GardenFeedback;