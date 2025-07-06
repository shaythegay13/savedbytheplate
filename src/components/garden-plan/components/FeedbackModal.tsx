import React from 'react';
import { Button } from "@/components/ui/button";
import GardenFeedback from '../GardenFeedback';

interface FeedbackModalProps {
  selectedPlantFeedback: string | null;
  planId?: string;
  onClose: () => void;
  onFeedbackSubmit: (feedback: any) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  selectedPlantFeedback,
  planId,
  onClose,
  onFeedbackSubmit
}) => {
  if (!selectedPlantFeedback) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-sbtp-green-800">
            Share Your Experience
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
        <div className="p-4">
          <GardenFeedback
            plantName={selectedPlantFeedback}
            planId={planId}
            onFeedbackSubmit={(feedback) => {
              console.log('Feedback submitted:', feedback);
              onFeedbackSubmit(feedback);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;