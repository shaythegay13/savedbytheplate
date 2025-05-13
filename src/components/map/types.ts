
// Define our location types
export interface MapLocation {
  id: string;
  name: string;
  type: 'farm' | 'market' | 'garden' | 'urbanfarm' | 'business';
  description: string;
  tags: string[];
  details?: string;
  lngLat: [number, number];
}
