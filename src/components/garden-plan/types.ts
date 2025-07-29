export interface GardenPlanFormData {
  spaceType: string;
  spaceSize: string;
  sunlight: string;
  soil_contaminated: string;
  soil_type: string;
  growing_options: string;
  rainfall: string;
  season: string;
  experience_level: string;
  goals: string;
  space_description: string;
  preferred_plants: string;
  time_commitment: string;
  structures?: string[]; // Garden structures like greenhouse, cold frames, etc.
}

export interface PlantRecommendation {
  name: string;
  variety: string;
  plantingTime: string;
  harvestTime: string;
  spacing: string;
  careInstructions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  yield: string;
}

export interface GardenSection {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

export interface PlantingActivity {
  month: string;
  activities: string[];
}

export interface GardenPlan {
  plantRecommendations: PlantRecommendation[];
  gardenLayout: GardenSection[];
  plantingCalendar: PlantingActivity[];
  careInstructions: string;
  expertTips: string[];
  planId?: string;
}