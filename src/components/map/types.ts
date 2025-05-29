
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

// NYC Open Data response structure
export interface NYCDataItem {
  objectid?: string;
  facility_name?: string;
  facility_type?: string;
  facility_subtype?: string;
  address?: string;
  borough?: string;
  zipcode?: string;
  phone?: string;
  website?: string;
  latitude?: string;
  longitude?: string;
  [key: string]: any;
}
