import { GardenPlanFormData, GardenPlan } from './types';

export const generateMockPlan = (formData: GardenPlanFormData): GardenPlan => {
  // Define plant categories based on user preferences
  const vegetables = [
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

  const fruits = [
    {
      name: "Strawberries",
      variety: "Ever-bearing",
      plantingTime: "Early spring or fall",
      harvestTime: "60-90 days from planting",
      spacing: "12-18 inches apart",
      careInstructions: "Mulch around plants to retain moisture and suppress weeds. Remove runners for larger berries.",
      difficulty: "Easy" as const,
      yield: "1-2 cups per plant per season"
    },
    {
      name: "Blueberries",
      variety: "Lowbush",
      plantingTime: "Early spring or fall",
      harvestTime: "2-3 years from planting (perennial)",
      spacing: "4-6 feet apart",
      careInstructions: "Requires acidic soil (pH 4.5-5.5). Water regularly and mulch well.",
      difficulty: "Medium" as const,
      yield: "5-10 lbs per mature bush"
    },
    {
      name: "Dwarf Apple Tree",
      variety: "Honeycrisp",
      plantingTime: "Early spring or fall",
      harvestTime: "2-4 years from planting",
      spacing: "8-10 feet apart",
      careInstructions: "Prune annually in late winter. Requires cross-pollination for best fruit set.",
      difficulty: "Hard" as const,
      yield: "50-100 apples per tree"
    }
  ];

  const flowers = [
    {
      name: "Marigolds",
      variety: "French Marigold",
      plantingTime: "After last frost",
      harvestTime: "Continuous blooms until frost",
      spacing: "6-12 inches apart",
      careInstructions: "Deadhead regularly for continuous blooms. Very drought tolerant once established.",
      difficulty: "Easy" as const,
      yield: "Continuous colorful blooms"
    },
    {
      name: "Zinnias",
      variety: "State Fair Mix",
      plantingTime: "After soil warms to 60°F",
      harvestTime: "Blooms 60-70 days from seed",
      spacing: "6-12 inches apart",
      careInstructions: "Deadhead for more blooms. Excellent cut flowers. Heat and drought tolerant.",
      difficulty: "Easy" as const,
      yield: "Abundant cut flowers"
    },
    {
      name: "Sunflowers",
      variety: "Mammoth",
      plantingTime: "After last frost",
      harvestTime: "80-120 days from seed",
      spacing: "12-24 inches apart",
      careInstructions: "Provide support for tall varieties. Deep watering encourages strong root system.",
      difficulty: "Easy" as const,
      yield: "Large flower heads with edible seeds"
    }
  ];

  const herbs = [
    {
      name: "Basil",
      variety: "Genovese",
      plantingTime: "After soil warms to 60°F",
      harvestTime: "Continuous harvest after 60 days",
      spacing: "12 inches apart",
      careInstructions: "Pinch flowers to encourage leaf growth. Water at base of plant.",
      difficulty: "Easy" as const,
      yield: "1-2 cups fresh leaves per week"
    }
  ];

  // Filter plants based on user preferences
  let plantRecommendations: any[] = [];
  const preferences = formData.preferred_plants.toLowerCase();
  
  if (preferences.includes('vegetable') || preferences.includes('veggies')) {
    plantRecommendations.push(...vegetables);
  }
  if (preferences.includes('fruit')) {
    plantRecommendations.push(...fruits);
  }
  if (preferences.includes('flower')) {
    plantRecommendations.push(...flowers);
  }
  if (preferences.includes('herb')) {
    plantRecommendations.push(...herbs);
  }
  
  // If no specific preferences or if empty, include a mix
  if (plantRecommendations.length === 0) {
    plantRecommendations = [...vegetables.slice(0, 2), ...fruits.slice(0, 1), ...flowers.slice(0, 1)];
  }

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

  const careInstructions = `Based on your ${formData.spaceType} with ${formData.sunlight} exposure, here are your specific care instructions:

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