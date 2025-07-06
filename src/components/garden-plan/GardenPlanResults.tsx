import React, { useState, useRef } from 'react';
import NotificationPreferences from './NotificationPreferences';
import GardenPlotVisualizer from './GardenPlotVisualizer';
import LocationBasedMap from './components/LocationBasedMap';
import PDFExport from './components/PDFExport';
import AILearningNotice from './components/AILearningNotice';
import PlantRecommendations from './components/PlantRecommendations';
import EnhancedGardenLayout from './components/EnhancedGardenLayout';
import PlantingCalendarComponent from './components/PlantingCalendar';
import CareInstructions from './components/CareInstructions';
import ExpertTips from './components/ExpertTips';
import FeedbackModal from './components/FeedbackModal';

interface PlantRecommendation {
  name: string;
  variety?: string;
  plantingTime: string;
  harvestTime: string;
  spacing: string;
  careInstructions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  yield: string;
}

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface PlantingCalendar {
  month: string;
  activities: string[];
}

interface GardenPlanResultsProps {
  plantRecommendations: PlantRecommendation[];
  gardenLayout: GardenLayout[];
  plantingCalendar: PlantingCalendar[];
  careInstructions: string;
  expertTips: string[];
  planId?: string;
  formData?: {
    spaceType: string;
    spaceSize: string;
    sunlight: string;
    hardiness_zone: string;
    goals: string;
    space_description?: string;
  };
}

const GardenPlanResults: React.FC<GardenPlanResultsProps> = ({
  plantRecommendations,
  gardenLayout,
  plantingCalendar,
  careInstructions,
  expertTips,
  planId,
  formData
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlantFeedback, setSelectedPlantFeedback] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    // In real app, save to database
  };

  return (
    <div className="space-y-8">
      <PDFExport contentRef={contentRef} />

      <div ref={contentRef} className="space-y-8">
        <AILearningNotice 
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
        />

        {showNotifications && (
          <NotificationPreferences onPreferencesUpdate={(prefs) => console.log('Preferences:', prefs)} />
        )}

        <PlantRecommendations 
          plantRecommendations={plantRecommendations}
          onShareExperience={setSelectedPlantFeedback}
        />

        <LocationBasedMap 
          gardenLayout={gardenLayout}
          locationDescription={formData?.space_description || "Your Garden Location"}
        />

        {formData && (
          <GardenPlotVisualizer 
            gardenLayout={gardenLayout}
            spaceType={formData.spaceType}
            spaceSize={formData.spaceSize}
          />
        )}

        <EnhancedGardenLayout gardenLayout={gardenLayout} />

        <PlantingCalendarComponent plantingCalendar={plantingCalendar} />

        <CareInstructions careInstructions={careInstructions} />

        <ExpertTips expertTips={expertTips} />
      </div>

      <FeedbackModal
        selectedPlantFeedback={selectedPlantFeedback}
        planId={planId}
        onClose={() => setSelectedPlantFeedback(null)}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default GardenPlanResults;