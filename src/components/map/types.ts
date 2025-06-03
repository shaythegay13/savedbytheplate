// Define our location types
export interface MapLocation {
  id: string;
  name: string;
  type: 'farm' | 'market' | 'garden' | 'urbanfarm' | 'business';
  description: string;
  tags: string[];
  details?: string;
  lngLat: [number, number];
  address?: string;
  crossstreets?: string;
  zipcode?: string;
  borough?: string;
  communityboard?: string;
  juris?: string;
  status?: string;
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  website?: string;
  facebook?: string;
}

// NYC Open Data response structure
export interface NYCDataItem {
  objectid?: string;
  gardenname?: string;
  facility_type?: string;
  facility_subtype?: string;
  address?: string;
  borough?: string;
  zipcode?: string;
  phone?: string;
  website?: string;
  lat?: string;
  lon?: string;
  crossstreets?: string;
  communityboard?: string;
  juris?: string;
  status?: string;
  openhrsm?: string;
  openhrstu?: string;
  openhrsw?: string;
  openhrsth?: string;
  openhrsf?: string;
  openhrssa?: string;
  openhrssu?: string;
  [key: string]: any;
}
