import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface PlantingCalendar {
  month: string;
  activities: string[];
}

interface PlantingCalendarProps {
  plantingCalendar: PlantingCalendar[];
}

const PlantingCalendarComponent: React.FC<PlantingCalendarProps> = ({ plantingCalendar }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Calendar className="mr-2" />
          Your Personalized Planting Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plantingCalendar.map((month, index) => (
            <div key={index} className="border border-sbtp-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-sbtp-green-700 mb-3">{month.month}</h3>
              <ul className="space-y-1">
                {month.activities.map((activity, activityIndex) => (
                  <li key={activityIndex} className="text-sm text-sbtp-brown-700 flex items-start">
                    <span className="w-2 h-2 bg-sbtp-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantingCalendarComponent;