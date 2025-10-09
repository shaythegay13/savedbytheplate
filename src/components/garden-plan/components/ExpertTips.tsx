import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Lightbulb } from "lucide-react";

interface ExpertTipsProps {
  expertTips: string[];
  careInstructions?: string;
}

const ExpertTips: React.FC<ExpertTipsProps> = ({ expertTips, careInstructions }) => {
  return (
    <Card className="border-4 border-red-500 shadow-xl">
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center text-red-800">
          <MessageCircle className="mr-2 h-6 w-6" />
          ⚠️ Essential Care Instructions & Expert Tips
        </CardTitle>
        <p className="text-sm text-red-600 font-medium mt-2">
          Following these instructions is crucial for your garden's success
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {careInstructions && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Core Care Instructions
            </h3>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-sbtp-brown-700 text-base leading-relaxed">{careInstructions}</div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="font-semibold text-sbtp-green-800 mb-4">Expert Tips & Troubleshooting</h3>
          <div className="space-y-3">
            {expertTips.map((tip, index) => (
              <div key={index} className="bg-sbtp-yellow/10 border-l-4 border-sbtp-yellow p-4 rounded-r-lg hover:bg-sbtp-yellow/20 transition-colors">
                <p className="text-sbtp-brown-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertTips;