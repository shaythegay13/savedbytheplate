import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface EnhancedGardenLayoutProps {
  gardenLayout: GardenLayout[];
}

const EnhancedGardenLayout: React.FC<EnhancedGardenLayoutProps> = ({ gardenLayout }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sbtp-green-50 to-sbtp-green-100">
        <CardTitle className="flex items-center text-sbtp-green-800">
          <MapPin className="mr-2" />
          Detailed Garden Layout & Planting Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gardenLayout.map((section, index) => (
            <div key={index} className="bg-gradient-to-br from-sbtp-green-50 to-white border border-sbtp-green-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-sbtp-green-700">{section.section}</h3>
                <Badge variant="outline" className="bg-sbtp-green-100 text-sbtp-green-700">
                  {section.size}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sbtp-brown-700 mb-2">Recommended Plants:</h4>
                  <div className="flex flex-wrap gap-2">
                    {section.plants.map((plant, plantIndex) => (
                      <Badge 
                        key={plantIndex} 
                        variant="secondary" 
                        className="bg-sbtp-yellow/20 text-sbtp-brown-700 hover:bg-sbtp-yellow/30"
                      >
                        🌱 {plant}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {section.notes && (
                  <div className="bg-sbtp-blue-50 border-l-4 border-sbtp-blue-300 p-3 rounded-r">
                    <p className="text-sm text-sbtp-blue-800">
                      <strong>💡 Pro Tip:</strong> {section.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedGardenLayout;