import { GardenPlanFormData, GardenPlan } from './types';

export const generateMockPlan = (formData: GardenPlanFormData): GardenPlan => {
  // Define comprehensive plant categories with more options
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
    },
    {
      name: "Spinach",
      variety: "Space",
      plantingTime: "Early spring or fall",
      harvestTime: "40-50 days from seed",
      spacing: "4-6 inches apart",
      careInstructions: "Cool weather crop. Bolt-resistant varieties for summer growing.",
      difficulty: "Easy" as const,
      yield: "4-6 oz per plant"
    },
    {
      name: "Radishes",
      variety: "Cherry Belle",
      plantingTime: "Early spring through fall",
      harvestTime: "25-30 days from seed",
      spacing: "2 inches apart",
      careInstructions: "Fast-growing. Keep soil moist but not waterlogged.",
      difficulty: "Easy" as const,
      yield: "20-30 radishes per sq ft"
    },
    {
      name: "Carrots",
      variety: "Nantes",
      plantingTime: "Early spring through summer",
      harvestTime: "70-80 days from seed",
      spacing: "2-3 inches apart",
      careInstructions: "Requires loose, deep soil. Thin seedlings for proper development.",
      difficulty: "Medium" as const,
      yield: "1-2 lbs per sq ft"
    },
    {
      name: "Green Beans",
      variety: "Blue Lake Bush",
      plantingTime: "After soil warms to 60°F",
      harvestTime: "50-60 days from seed",
      spacing: "4-6 inches apart",
      careInstructions: "Don't over-water. Pick frequently to encourage production.",
      difficulty: "Easy" as const,
      yield: "½ lb per plant"
    },
    {
      name: "Kale",
      variety: "Lacinato",
      plantingTime: "Early spring or late summer",
      harvestTime: "55-75 days from seed",
      spacing: "12-18 inches apart",
      careInstructions: "Cold-hardy. Harvest outer leaves first. Sweetens after frost.",
      difficulty: "Easy" as const,
      yield: "1-2 lbs per plant"
    },
    {
      name: "Zucchini",
      variety: "Black Beauty",
      plantingTime: "After last frost",
      harvestTime: "50-60 days from seed",
      spacing: "36 inches apart",
      careInstructions: "Needs plenty of space. Harvest when 6-8 inches long.",
      difficulty: "Easy" as const,
      yield: "6-10 lbs per plant"
    },
    {
      name: "Broccoli",
      variety: "Calabrese",
      plantingTime: "Early spring or late summer",
      harvestTime: "60-90 days from seed",
      spacing: "18-24 inches apart",
      careInstructions: "Cool weather crop. Harvest central head first, then side shoots.",
      difficulty: "Medium" as const,
      yield: "1-2 lbs per plant"
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
    },
    {
      name: "Raspberries",
      variety: "Heritage",
      plantingTime: "Early spring or fall",
      harvestTime: "July and September (everbearing)",
      spacing: "18-24 inches apart",
      careInstructions: "Support with trellis. Prune spent canes in winter.",
      difficulty: "Medium" as const,
      yield: "1-2 cups per plant"
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
    },
    {
      name: "Cosmos",
      variety: "Sensation Mix",
      plantingTime: "After last frost",
      harvestTime: "Blooms 70-80 days from seed",
      spacing: "12-18 inches apart",
      careInstructions: "Drought tolerant once established. Self-seeds readily.",
      difficulty: "Easy" as const,
      yield: "Continuous delicate blooms"
    },
    {
      name: "Nasturtiums",
      variety: "Alaska Mix",
      plantingTime: "After last frost",
      harvestTime: "Continuous blooms and edible flowers",
      spacing: "8-12 inches apart",
      careInstructions: "Edible flowers and leaves. Poor soil produces more flowers.",
      difficulty: "Easy" as const,
      yield: "Edible flowers and peppery leaves"
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
    },
    {
      name: "Cilantro",
      variety: "Slow Bolt",
      plantingTime: "Early spring or fall",
      harvestTime: "Continuous harvest after 40 days",
      spacing: "4-6 inches apart",
      careInstructions: "Cool weather herb. Succession plant every 2 weeks.",
      difficulty: "Easy" as const,
      yield: "Multiple harvests per plant"
    },
    {
      name: "Oregano",
      variety: "Greek",
      plantingTime: "Spring after frost danger",
      harvestTime: "Continuous harvest (perennial)",
      spacing: "12 inches apart",
      careInstructions: "Drought tolerant once established. Divide every 3 years.",
      difficulty: "Easy" as const,
      yield: "Fresh herbs all season"
    },
    {
      name: "Thyme",
      variety: "Common",
      plantingTime: "Spring after frost danger",
      harvestTime: "Continuous harvest (perennial)",
      spacing: "8-12 inches apart",
      careInstructions: "Very drought tolerant. Trim after flowering.",
      difficulty: "Easy" as const,
      yield: "Small amounts, very flavorful"
    },
    {
      name: "Parsley",
      variety: "Flat-leaf",
      plantingTime: "Early spring",
      harvestTime: "Continuous harvest (biennial)",
      spacing: "6-8 inches apart",
      careInstructions: "Prefers consistent moisture. Cut outer stems first.",
      difficulty: "Easy" as const,
      yield: "Multiple harvests per plant"
    },
    {
      name: "Chives",
      variety: "Common",
      plantingTime: "Early spring",
      harvestTime: "Continuous harvest (perennial)",
      spacing: "6 inches apart",
      careInstructions: "Very low maintenance. Divide clumps every 3 years.",
      difficulty: "Easy" as const,
      yield: "Continuous mild onion flavor"
    }
  ];

  // Create more diverse plant selection logic with randomization
  const getAllPlants = () => [...vegetables, ...fruits, ...flowers, ...herbs];
  const allPlants = getAllPlants();
  
  // Shuffle array to provide variety
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter plants based on user preferences and experience level
  let plantRecommendations: any[] = [];
  const preferences = formData.preferred_plants?.toLowerCase() || '';
  const experience = formData.experience_level?.toLowerCase() || 'beginner';
  
  // Determine base selection based on experience
  let minPlants = 15;
  let maxPlants = 20;
  
  if (experience === 'beginner') {
    // Beginners get more easy plants
    const easyPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Easy'));
    const mediumPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Medium'));
    plantRecommendations = [...easyPlants.slice(0, 12), ...mediumPlants.slice(0, 5)];
  } else if (experience === 'intermediate') {
    // Intermediate gets balanced mix
    const easyPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Easy'));
    const mediumPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Medium'));
    const hardPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Hard'));
    plantRecommendations = [...easyPlants.slice(0, 8), ...mediumPlants.slice(0, 7), ...hardPlants.slice(0, 2)];
  } else {
    // Advanced gets more challenging plants
    const easyPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Easy'));
    const mediumPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Medium'));
    const hardPlants = shuffleArray(allPlants.filter(p => p.difficulty === 'Hard'));
    plantRecommendations = [...easyPlants.slice(0, 5), ...mediumPlants.slice(0, 8), ...hardPlants.slice(0, 4)];
  }
  
  // If specific preferences mentioned, adjust selection
  if (preferences.includes('vegetable') || preferences.includes('veggies')) {
    const shuffledVeg = shuffleArray(vegetables);
    plantRecommendations = [...shuffledVeg, ...shuffleArray([...fruits, ...herbs, ...flowers]).slice(0, 8)];
  } else if (preferences.includes('fruit')) {
    const shuffledFruit = shuffleArray(fruits);
    plantRecommendations = [...shuffledFruit, ...shuffleArray([...vegetables, ...herbs, ...flowers]).slice(0, 13)];
  } else if (preferences.includes('flower')) {
    const shuffledFlowers = shuffleArray(flowers);
    plantRecommendations = [...shuffledFlowers, ...shuffleArray([...vegetables, ...herbs, ...fruits]).slice(0, 12)];
  } else if (preferences.includes('herb')) {
    const shuffledHerbs = shuffleArray(herbs);
    plantRecommendations = [...shuffledHerbs, ...shuffleArray([...vegetables, ...flowers, ...fruits]).slice(0, 11)];
  }
  
  // Ensure we have at least 15 plants and shuffle final selection
  if (plantRecommendations.length < minPlants) {
    plantRecommendations = shuffleArray(allPlants).slice(0, maxPlants);
  } else if (plantRecommendations.length > maxPlants) {
    plantRecommendations = shuffleArray(plantRecommendations).slice(0, maxPlants);
  } else {
    plantRecommendations = shuffleArray(plantRecommendations);
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