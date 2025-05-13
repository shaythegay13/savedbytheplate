
import { MapLocation } from './types';

// Sample data - in a real app, this would come from an API
export const sampleLocations: MapLocation[] = [
  {
    id: 'farm1',
    name: 'Uptown Urban Farm',
    type: 'farm',
    description: 'Organic produce, seasonal crops',
    tags: ['Vegetables', 'Fruits', 'Herbs'],
    details: 'Currently growing: Tomatoes, Peppers, Basil',
    lngLat: [-73.9654, 40.7829]
  },
  {
    id: 'market1',
    name: 'Union Square Farmers Market',
    type: 'market',
    description: 'Open Mon, Wed, Fri, Sat (8am-2pm)',
    tags: ['30+ Vendors', 'Local'],
    details: 'Seasonal highlights: Summer berries, Stone fruits',
    lngLat: [-73.9905, 40.7359]
  },
  {
    id: 'garden1',
    name: 'Lower East Side Community Garden',
    type: 'garden',
    description: 'Urban oasis with 20+ community plots',
    tags: ['Community Plots', 'Education'],
    details: 'Workshops every Sunday at 10am',
    lngLat: [-73.9815, 40.7168]
  },
  {
    id: 'urbanfarm1',
    name: 'Rooftop Growing Collective',
    type: 'urbanfarm',
    description: 'Rooftop farm with innovative growing methods',
    tags: ['Hydroponics', 'Vertical Farming'],
    details: 'Tours available by appointment',
    lngLat: [-74.0060, 40.7484]
  },
  {
    id: 'business1',
    name: 'Local Harvest Café',
    type: 'business',
    description: 'Farm-to-table café sourcing within 100 miles',
    tags: ['Café', 'Local-sourced'],
    details: 'Open 7am-8pm daily',
    lngLat: [-73.9787, 40.7689]
  },
];
