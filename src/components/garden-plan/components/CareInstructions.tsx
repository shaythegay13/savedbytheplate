import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface CareInstructionsProps {
  careInstructions: string;
}

interface CombinedInstructionsProps {
  careInstructions: string;
  expertTips: string[];
}

const CareInstructions: React.FC<CareInstructionsProps> = ({ careInstructions }) => {
  return (
    <Card className="border-4 border-red-500 shadow-xl">
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center text-red-800">
          <Lightbulb className="mr-2 h-6 w-6" />
          ⚠️ Essential Care Instructions - Read Carefully!
        </CardTitle>
        <p className="text-sm text-red-600 font-medium mt-2">
          Following these instructions is crucial for your garden's success
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line text-sbtp-brown-700 text-base leading-relaxed">{careInstructions}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareInstructions;