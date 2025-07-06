import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface ExpertTipsProps {
  expertTips: string[];
}

const ExpertTips: React.FC<ExpertTipsProps> = ({ expertTips }) => {
  return (
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
  );
};

export default ExpertTips;