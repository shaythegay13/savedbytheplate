import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Bell } from "lucide-react";

interface AILearningNoticeProps {
  showNotifications: boolean;
  onToggleNotifications: () => void;
}

const AILearningNotice: React.FC<AILearningNoticeProps> = ({ 
  showNotifications, 
  onToggleNotifications 
}) => {
  return (
    <Card className="border-sbtp-blue-200 bg-sbtp-blue/5">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <BarChart3 className="h-5 w-5 text-sbtp-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sbtp-blue-800 mb-1">🤖 AI-Enhanced Garden Plan</h3>
            <p className="text-sm text-sbtp-blue-700 mb-3">
              This plan is powered by our learning AI that improves with every garden success and failure shared by our community. 
              Your feedback will help make future recommendations even better!
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleNotifications}
                className="border-sbtp-blue-300 text-sbtp-blue-700 hover:bg-sbtp-blue-50"
              >
                <Bell className="h-4 w-4 mr-1" />
                {showNotifications ? 'Hide' : 'Setup'} Smart Notifications
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AILearningNotice;