interface LocationDimensions {
  name: string;
  acres?: number;
  squareFeet?: number;
  estimatedLength?: number;
  estimatedWidth?: number;
  description: string;
  shape?: 'rectangular' | 'oval' | 'irregular' | 'curved';
  boundaryPoints?: { x: number; y: number }[];
}

// Known locations with their dimensions
const knownLocations: Record<string, LocationDimensions> = {
  "sheep's meadow": {
    name: "Sheep's Meadow, Central Park",
    acres: 15,
    squareFeet: 653400, // 15 acres * 43,560 sq ft per acre
    estimatedLength: 1400, // North-south axis
    estimatedWidth: 500,   // East-west axis
    description: "A 15-acre oval meadow in Central Park (1,400' x 500')",
    shape: 'oval',
    boundaryPoints: [
      { x: 0, y: 0.2 }, { x: 0.15, y: 0 }, { x: 0.85, y: 0 }, { x: 1, y: 0.2 },
      { x: 1, y: 0.8 }, { x: 0.85, y: 1 }, { x: 0.15, y: 1 }, { x: 0, y: 0.8 }
    ]
  },
  "central park": {
    name: "Central Park",
    acres: 843,
    squareFeet: 36729480,
    estimatedLength: 2640,
    estimatedWidth: 1320,
    description: "Full Central Park area - 843 acres"
  }
};

export const researchLocationDimensions = async (locationDescription: string): Promise<LocationDimensions> => {
  const normalizedLocation = locationDescription.toLowerCase();
  
  // Check for known locations, prioritizing more specific matches
  const matches = Object.entries(knownLocations)
    .filter(([key]) => normalizedLocation.includes(key))
    .sort((a, b) => b[0].length - a[0].length); // Sort by key length (more specific first)
  
  if (matches.length > 0) {
    return matches[0][1]; // Return the most specific match
  }
  
  // Default fallback for unknown locations
  return {
    name: locationDescription,
    squareFeet: 10000, // Default to about 1/4 acre
    estimatedLength: 100,
    estimatedWidth: 100,
    description: `Estimated dimensions for ${locationDescription}`
  };
};

export const convertAcresToDimensions = (acres: number): { length: number; width: number } => {
  const squareFeet = acres * 43560;
  const sideLength = Math.sqrt(squareFeet);
  
  // Assume rectangular with 1.5:1 ratio for more realistic proportions
  const width = Math.sqrt(squareFeet / 1.5);
  const length = squareFeet / width;
  
  return {
    length: Math.round(length),
    width: Math.round(width)
  };
};