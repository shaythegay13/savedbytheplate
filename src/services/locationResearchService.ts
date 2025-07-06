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
    estimatedLength: 1000,
    estimatedWidth: 650,
    description: "A 15-acre lawn in Central Park, popular for relaxation and picnicking",
    shape: 'oval',
    boundaryPoints: [
      { x: 0, y: 0.3 }, { x: 0.2, y: 0 }, { x: 0.8, y: 0 }, { x: 1, y: 0.3 },
      { x: 1, y: 0.7 }, { x: 0.8, y: 1 }, { x: 0.2, y: 1 }, { x: 0, y: 0.7 }
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
  
  // Check for known locations first
  for (const [key, location] of Object.entries(knownLocations)) {
    if (normalizedLocation.includes(key)) {
      return location;
    }
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