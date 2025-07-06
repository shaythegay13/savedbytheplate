import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface CareInstructionsProps {
  careInstructions: string;
}

const CareInstructions: React.FC<CareInstructionsProps> = ({ careInstructions }) => {
  return (
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
  );
};

export default CareInstructions;