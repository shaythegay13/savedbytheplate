import brooklynNavyYard from "@/assets/brooklyn-navy-yard.webp";
import { fetchEnhancedMapData } from "@/services/enhancedMapDataService";
import { MapLocation } from "@/components/map/types";

export interface CommunitySpotlight {
  title: string;
  location: string;
  description: string;
  image?: string;
  highlights: string[];
}

// Prominent locations with researched information and images
const featuredSpotlights: Record<string, CommunitySpotlight> = {
  "brooklyn grange": {
    title: "Brooklyn Grange Rooftop Farm",
    location: "Brooklyn Navy Yard",
    description: "Brooklyn Grange is one of NYC's largest rooftop soil farms. Spanning over 2.5 acres across multiple locations, they demonstrate how urban agriculture can thrive in unexpected places.",
    image: brooklynNavyYard,
    highlights: [
      "Over 80,000 lbs of produce grown annually",
      "Hosts educational programs for 10,000+ visitors yearly",
      "Creates habitat for local wildlife and pollinators",
      "Demonstrates sustainable urban farming practices"
    ]
  },
  "east new york farms": {
    title: "East New York Farms!",
    location: "East New York, Brooklyn",
    description: "East New York Farms! is a coalition of community-based organizations that promotes local sustainable agriculture and community-led economic development. They've transformed vacant lots into thriving urban gardens.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
    highlights: [
      "Operates over 30 youth-run community and school gardens",
      "Provides fresh produce at farmers markets throughout East New York",
      "Trains youth in sustainable agriculture and entrepreneurship",
      "Distributes over 10,000 lbs of produce to community members annually"
    ]
  },
  "added value": {
    title: "Added Value Red Hook Community Farm",
    location: "Red Hook, Brooklyn",
    description: "Added Value operates a 1.75-acre community farm in Red Hook that serves as an educational hub for sustainable farming and environmental stewardship. The farm provides hands-on learning opportunities for local youth.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    highlights: [
      "Grows over 40 varieties of vegetables and herbs annually",
      "Employs local youth in farm operations and leadership roles",
      "Donates thousands of pounds of produce to local food pantries",
      "Hosts community events and workshops on urban farming"
    ]
  },
  "la finca del sur": {
    title: "La Finca del Sur",
    location: "South Bronx",
    description: "La Finca del Sur is a community garden and urban farm in the South Bronx that combines sustainable agriculture with cultural preservation. This space celebrates Puerto Rican and Latino heritage while providing fresh food access.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
    highlights: [
      "Cultivates traditional Caribbean and Latin American crops",
      "Features a casita (traditional Puerto Rican house) as a community gathering space",
      "Provides environmental education programs for neighborhood youth",
      "Serves as a cultural hub hosting music, art, and community events"
    ]
  },
  "queens county farm": {
    title: "Queens County Farm Museum",
    location: "Floral Park, Queens",
    description: "The Queens County Farm Museum is NYC's largest remaining tract of undisturbed farmland. This 47-acre working farm has been in operation since 1697 and serves as a living history museum.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    highlights: [
      "47 acres of working farmland with historic buildings",
      "Home to sheep, cows, pigs, chickens, and other farm animals",
      "Offers agricultural education programs for over 50,000 visitors annually",
      "Hosts seasonal festivals, farmers markets, and family activities"
    ]
  },
  "battery urban farm": {
    title: "Battery Urban Farm",
    location: "Battery Park City, Manhattan",
    description: "Battery Urban Farm is an educational organic farm in Lower Manhattan that demonstrates sustainable urban agriculture. The farm grows vegetables, herbs, and flowers while teaching sustainable practices to the community.",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800",
    highlights: [
      "6,000+ square feet of growing space in Lower Manhattan",
      "All produce donated to local food pantries and community programs",
      "Offers free workshops on composting, beekeeping, and urban farming",
      "Maintains beehives that produce local Battery Park honey"
    ]
  }
};

// Generate spotlight info for any location
const generateSpotlightForLocation = (location: MapLocation): CommunitySpotlight => {
  const name = location.name.toLowerCase();
  
  // Check if we have featured info for this location
  for (const [key, spotlight] of Object.entries(featuredSpotlights)) {
    if (name.includes(key)) {
      return spotlight;
    }
  }
  
  // Generate generic but informative spotlight
  const typeDescriptions: Record<string, string> = {
    garden: "community garden providing fresh produce and green space to local residents",
    farm: "working farm that supplies fresh, locally-grown produce to the community",
    urbanfarm: "innovative urban farm demonstrating sustainable agriculture in the city",
    market: "farmers market connecting local growers with community members",
    fridge: "community fridge providing free fresh food access to neighbors in need",
    foodbank: "food pantry serving families and individuals facing food insecurity"
  };
  
  const typeHighlights: Record<string, string[]> = {
    garden: [
      "Provides green space and community gathering area",
      "Grows fresh vegetables and herbs for local residents",
      "Offers educational programs on sustainable gardening",
      "Promotes community engagement and environmental stewardship"
    ],
    farm: [
      "Supplies fresh, locally-grown produce to the community",
      "Practices sustainable and organic farming methods",
      "Offers farm tours and educational workshops",
      "Supports local food economy and food security"
    ],
    urbanfarm: [
      "Demonstrates innovative urban agriculture techniques",
      "Grows diverse crops in limited urban space",
      "Provides job training and employment opportunities",
      "Strengthens community food systems"
    ],
    market: [
      "Connects local farmers with community members",
      "Offers fresh, seasonal produce year-round",
      "Accepts SNAP/EBT benefits for accessibility",
      "Supports local agricultural economy"
    ],
    fridge: [
      "Provides 24/7 free food access to community members",
      "Reduces food waste by redistributing fresh items",
      "Operated by volunteers and community donations",
      "Addresses immediate food insecurity needs"
    ],
    foodbank: [
      "Distributes fresh and shelf-stable food to families in need",
      "Serves hundreds of community members each month",
      "Partners with local organizations for food rescue",
      "Provides nutrition education and resources"
    ]
  };
  
  const description = `This ${typeDescriptions[location.type] || 'food access location'} serves the ${location.borough || 'New York City'} community. ${location.description || 'A vital resource for local food access and community connection.'}`;
  
  // Use generic garden/farm images from Unsplash
  const imageUrls: Record<string, string> = {
    garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    urbanfarm: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
    market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
    fridge: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=800",
    foodbank: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800"
  };
  
  return {
    title: location.name,
    location: location.address || `${location.borough}, NYC` || 'New York City',
    description,
    image: imageUrls[location.type] || brooklynNavyYard,
    highlights: typeHighlights[location.type] || typeHighlights.garden
  };
};

let allLocationsCache: MapLocation[] | null = null;
let spotlightLocationsCache: CommunitySpotlight[] | null = null;

/**
 * Get all spotlight-worthy locations from the map
 * Prioritizes gardens, farms, and urban farms as they make the best showcase content
 */
export const getAllSpotlightLocations = async (): Promise<CommunitySpotlight[]> => {
  if (spotlightLocationsCache) {
    return spotlightLocationsCache;
  }
  
  if (!allLocationsCache) {
    allLocationsCache = await fetchEnhancedMapData();
  }
  
  // Filter for showcase-worthy location types
  const showcaseTypes: MapLocation['type'][] = ['garden', 'farm', 'urbanfarm', 'market'];
  const showcaseLocations = allLocationsCache
    .filter(loc => showcaseTypes.includes(loc.type))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically for consistency
  
  // Generate spotlights for all locations
  spotlightLocationsCache = showcaseLocations.map(generateSpotlightForLocation);
  
  console.log(`📍 Generated ${spotlightLocationsCache.length} community spotlights from map data`);
  
  return spotlightLocationsCache;
};

/**
 * Get the current community spotlight based on a daily rotation
 * Cycles through ALL locations on the map every day
 */
export const getCurrentSpotlight = async (): Promise<CommunitySpotlight> => {
  const allSpotlights = await getAllSpotlightLocations();
  
  if (allSpotlights.length === 0) {
    // Fallback to Brooklyn Grange if no data available
    return featuredSpotlights["brooklyn grange"];
  }
  
  // Use January 1, 2025 as the epoch (arbitrary starting point)
  const epoch = new Date('2025-01-01').getTime();
  const now = Date.now();
  const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  
  // Rotate through ALL spotlights every day
  const currentIndex = daysSinceEpoch % allSpotlights.length;
  
  console.log(`🎯 Current spotlight (day ${daysSinceEpoch}): ${allSpotlights[currentIndex].title} (${currentIndex + 1}/${allSpotlights.length})`);
  
  return allSpotlights[currentIndex];
};
