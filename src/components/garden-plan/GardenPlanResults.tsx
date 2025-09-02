import React, { useState, useRef } from 'react';
import NotificationPreferences from './NotificationPreferences';
import IntelligentGardenPlotVisualizer from './components/IntelligentGardenPlotVisualizer';
import PlanCustomizer from './components/PlanCustomizer';
import MultiYearPlanning from './components/MultiYearPlanning';
import WeatherBasedNotifications from './components/WeatherBasedNotifications';
import PDFExport from './components/PDFExport';
import AILearningNotice from './components/AILearningNotice';
import PlantRecommendations from './components/PlantRecommendations';
import EnhancedGardenLayout from './components/EnhancedGardenLayout';
import PlantingCalendarComponent from './components/PlantingCalendar';
import CareInstructions from './components/CareInstructions';
import ExpertTips from './components/ExpertTips';
import FeedbackModal from './components/FeedbackModal';
import AIVisualGardenPlan from './components/AIVisualGardenPlan';
import DragDropGardenLayout from './components/DragDropGardenLayout';
import PlantDiseaseIdentifier from './components/PlantDiseaseIdentifier';
import SeasonalRecommendations from './components/SeasonalRecommendations';
import { GardenPlanFormData } from './types';

interface PlantRecommendation {
  name: string;
  variety: string;
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
  formData?: GardenPlanFormData;
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
  const [currentPlantRecommendations, setCurrentPlantRecommendations] = useState(plantRecommendations);
  const [currentGardenLayout, setCurrentGardenLayout] = useState(gardenLayout);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    // In real app, save to database
  };

  const handlePlanUpdate = (updatedPlan: { plantRecommendations: PlantRecommendation[], gardenLayout: GardenLayout[] }) => {
    setCurrentPlantRecommendations(updatedPlan.plantRecommendations);
    setCurrentGardenLayout(updatedPlan.gardenLayout);
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
          <div className="space-y-6">
            <NotificationPreferences onPreferencesUpdate={(prefs) => console.log('Preferences:', prefs)} />
            <WeatherBasedNotifications />
          </div>
        )}

        <PlanCustomizer 
          plantRecommendations={currentPlantRecommendations}
          gardenLayout={currentGardenLayout}
          onPlanUpdate={handlePlanUpdate}
        />

        <PlantRecommendations 
          plantRecommendations={currentPlantRecommendations}
          onShareExperience={setSelectedPlantFeedback}
        />

        <AIVisualGardenPlan 
          gardenLayout={currentGardenLayout}
          plantRecommendations={currentPlantRecommendations}
          formData={formData}
          uploadedImage={formData?.gardenImage}
        />

        <DragDropGardenLayout 
          plantRecommendations={currentPlantRecommendations}
          gardenSize={{ width: 6, height: 4 }}
          onLayoutUpdate={(layout) => console.log('Garden layout updated:', layout)}
        />

        <SeasonalRecommendations 
          formData={formData}
          onPlantSelect={(plants) => console.log('Seasonal plants selected:', plants)}
        />

        {formData && (
          <IntelligentGardenPlotVisualizer 
            gardenLayout={currentGardenLayout}
            spaceType={formData.spaceType}
            spaceSize={formData.spaceSize}
            locationDescription={formData.space_description || formData.city}
          />
        )}

        <EnhancedGardenLayout gardenLayout={currentGardenLayout} />

        <MultiYearPlanning 
          gardenSections={currentGardenLayout}
        />

        <PlantingCalendarComponent plantingCalendar={plantingCalendar} />

        <CareInstructions careInstructions={careInstructions} />

        <ExpertTips expertTips={expertTips} />

        <PlantDiseaseIdentifier />
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