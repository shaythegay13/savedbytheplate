
import React, { useState } from 'react';
import GardenPlanForm from './GardenPlanForm';
import GardenPlanResults from './GardenPlanResults';

interface GardenPlanFormData {
  spaceType: string;
  spaceSize: string;
  sunlight: string;
  hardiness_zone: string;
  soil_type: string;
  rainfall: string;
  season: string;
  experience_level: string;
  goals: string;
  space_description: string;
  preferred_plants: string;
  time_commitment: string;
}

const GardenPlanGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gardenPlan, setGardenPlan] = useState<any>(null);

  const generateGardenPlan = (formData: GardenPlanFormData) => {
    setIsLoading(true);
    
    // Simulate API call - in a real app, this would call an AI service
    setTimeout(() => {
      const mockPlan = generateMockPlan(formData);
      setGardenPlan(mockPlan);
      setIsLoading(false);
    }, 3000);
  };

  const generateMockPlan = (formData: GardenPlanFormData) => {
    // This would be replaced with actual AI-generated content
    const plantRecommendations = [
      {
        name: "Cherry Tomatoes",
        variety: "Sweet 100",
        plantingTime: "After last frost (typically March-April)",
        harvestTime: "60-70 days from planting",
        spacing: "18-24 inches apart",
        careInstructions: "Water deeply 2-3 times per week. Provide support with stakes or cages.",
        difficulty: "Easy" as const,
        yield: "5-10 lbs per plant"
      },
      {
        name: "Lettuce",
        variety: "Buttercrunch",
        plantingTime: "Early spring or fall",
        harvestTime: "45-60 days from seed",
        spacing: "6-8 inches apart",
        careInstructions: "Keep soil consistently moist. Harvest outer leaves first.",
        difficulty: "Easy" as const,
        yield: "1-2 heads per plant"
      },
      {
        name: "Basil",
        variety: "Genovese",
        plantingTime: "After soil warms to 60°F",
        harvestTime: "Continuous harvest after 60 days",
        spacing: "12 inches apart",
        careInstructions: "Pinch flowers to encourage leaf growth. Water at base of plant.",
        difficulty: "Easy" as const,
        yield: "1-2 cups fresh leaves per week"
      },
      {
        name: "Bell Peppers",
        variety: "California Wonder",
        plantingTime: "2 weeks after last frost",
        harvestTime: "70-80 days from planting",
        spacing: "18-24 inches apart",
        careInstructions: "Consistent watering and full sun. May need support when fruiting.",
        difficulty: "Medium" as const,
        yield: "6-8 peppers per plant"
      }
    ];

    const gardenLayout = [
      {
        section: "Sunny Corner (Section A)",
        plants: ["Cherry Tomatoes", "Bell Peppers"],
        size: "4x4 feet",
        notes: "Gets 6+ hours of direct sunlight"
      },
      {
        section: "Herb Garden (Section B)",
        plants: ["Basil", "Oregano", "Thyme"],
        size: "2x3 feet",
        notes: "Easy access for cooking"
      },
      {
        section: "Quick Greens (Section C)",
        plants: ["Lettuce", "Spinach", "Arugula"],
        size: "2x4 feet",
        notes: "Can be succession planted every 2 weeks"
      }
    ];

    const plantingCalendar = [
      {
        month: "March",
        activities: [
          "Start tomato and pepper seeds indoors",
          "Direct sow lettuce and spinach",
          "Prepare soil with compost"
        ]
      },
      {
        month: "April",
        activities: [
          "Transplant seedlings after hardening off",
          "Plant basil after last frost",
          "Begin regular watering schedule"
        ]
      },
      {
        month: "May",
        activities: [
          "Monitor for pests and diseases",
          "Begin harvesting lettuce leaves",
          "Install tomato supports"
        ]
      },
      {
        month: "June",
        activities: [
          "Start harvesting herbs",
          "Side-dress heavy feeders with compost",
          "Begin succession planting of greens"
        ]
      }
    ];

    const careInstructions = `Based on your ${formData.spaceType} with ${formData.sunlight} exposure in hardiness zone ${formData.hardiness_zone}, here are your specific care instructions:

WATERING:
- Water deeply but less frequently to encourage root development
- For ${formData.soil_type} soil, adjust watering frequency accordingly
- Use drip irrigation or soaker hoses if possible to minimize disease

SOIL CARE:
- Add 2-3 inches of compost annually
- Test soil pH annually (most vegetables prefer 6.0-7.0)
- Consider raised beds if drainage is poor

SEASONAL MAINTENANCE:
- ${formData.season} specific care includes monitoring for seasonal pests
- Adjust watering based on ${formData.rainfall} rainfall patterns
- Plan for frost protection if needed in your zone

PLANT HEALTH:
- Inspect plants weekly for pests and diseases
- Remove diseased foliage immediately
- Rotate crops annually to prevent soil depletion`;

    const expertTips = [
      "For beginners: Start small and expand gradually. It's better to have a thriving small garden than a struggling large one.",
      "Succession planting: Plant lettuce and greens every 2 weeks for continuous harvest throughout the growing season.",
      "Companion planting: Plant basil near tomatoes to improve flavor and help deter pests naturally.",
      "Water timing: Water early morning to reduce evaporation and prevent fungal diseases that thrive in humid evening conditions.",
      "Soil improvement: Add compost regularly rather than fertilizer - it improves soil structure and provides slow-release nutrients.",
      "Pest management: Encourage beneficial insects by planting flowers like marigolds and zinnias among your vegetables."
    ];

    return {
      plantRecommendations,
      gardenLayout,
      plantingCalendar,
      careInstructions,
      expertTips
    };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sbtp-green-500 mb-4"></div>
        <h3 className="text-xl font-semibold text-sbtp-green-800 mb-2">Generating Your Custom Garden Plan</h3>
        <p className="text-sbtp-brown-600 text-center max-w-md">
          We're analyzing your space, climate, and preferences to create a personalized gardening plan just for you...
        </p>
      </div>
    );
  }

  if (gardenPlan) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sbtp-green-800 mb-2">Your Personalized Garden Plan</h2>
          <p className="text-sbtp-brown-600">Here's everything you need to create a thriving garden in your space</p>
        </div>
        <GardenPlanResults {...gardenPlan} />
      </div>
    );
  }

  return <GardenPlanForm onSubmit={generateGardenPlan} isLoading={isLoading} />;
};

export default GardenPlanGenerator;
