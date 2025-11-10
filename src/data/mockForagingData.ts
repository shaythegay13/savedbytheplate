// Mock foraging data for UI/UX testing
// This is frontend-only data for prototyping the Foraging Map feature

export interface ForagingLocation {
  id: string;
  name: string;
  type: 'herb' | 'berry' | 'fruit' | 'green' | 'nut';
  description: string;
  lngLat: [number, number];
  season: string;
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;
}

export const mockForagingLocations: ForagingLocation[] = [
  {
    id: 'f1',
    name: 'Wild Blackberries',
    type: 'berry',
    description: 'Abundant blackberry bushes along the park trail',
    lngLat: [-73.9712, 40.7831],
    season: 'Late Summer (July-August)',
    difficulty: 'easy',
    notes: 'Best after rain. Watch for thorns!'
  },
  {
    id: 'f2',
    name: 'Mulberry Trees',
    type: 'fruit',
    description: 'Several mature mulberry trees with sweet berries',
    lngLat: [-73.9836, 40.7489],
    season: 'Early Summer (June-July)',
    difficulty: 'easy',
    notes: 'Purple berries are ripe. White/pink ones need more time.'
  },
  {
    id: 'f3',
    name: 'Wild Garlic Mustard',
    type: 'green',
    description: 'Invasive but edible greens with garlicky flavor',
    lngLat: [-73.9789, 40.7614],
    season: 'Spring (April-May)',
    difficulty: 'easy',
    notes: 'Young leaves are best. Helps control invasive species!'
  },
  {
    id: 'f4',
    name: 'Elderflowers',
    type: 'herb',
    description: 'Elder bushes producing fragrant edible flowers',
    lngLat: [-73.9845, 40.7505],
    season: 'Late Spring (May-June)',
    difficulty: 'medium',
    notes: 'Use flowers only. Unripe berries are toxic.'
  },
  {
    id: 'f5',
    name: 'Apple Trees (Feral)',
    type: 'fruit',
    description: 'Wild apple trees from old homesteads',
    lngLat: [-73.9652, 40.7741],
    season: 'Fall (September-October)',
    difficulty: 'easy',
    notes: 'Smaller than store apples but great for cooking'
  },
  {
    id: 'f6',
    name: 'Dandelion Greens',
    type: 'green',
    description: 'Common lawns with pesticide-free dandelions',
    lngLat: [-73.9891, 40.7359],
    season: 'Spring & Fall',
    difficulty: 'easy',
    notes: 'Pick young leaves before flowering. Confirm no pesticides used.'
  },
  {
    id: 'f7',
    name: 'Wild Strawberries',
    type: 'berry',
    description: 'Tiny but intensely flavored wild strawberries',
    lngLat: [-73.9734, 40.7648],
    season: 'Late Spring (May-June)',
    difficulty: 'medium',
    notes: 'Very small but worth the effort!'
  },
  {
    id: 'f8',
    name: 'Wood Sorrel',
    type: 'herb',
    description: 'Lemony clover-like plant, great for salads',
    lngLat: [-73.9567, 40.7789],
    season: 'Spring through Fall',
    difficulty: 'easy',
    notes: 'Yellow flowers are edible too'
  },
  {
    id: 'f9',
    name: 'Black Walnuts',
    type: 'nut',
    description: 'Black walnut trees dropping nuts in autumn',
    lngLat: [-73.9923, 40.7298],
    season: 'Fall (October)',
    difficulty: 'hard',
    notes: 'Husks stain badly. Wear gloves! Needs curing.'
  },
  {
    id: 'f10',
    name: 'Wild Mint',
    type: 'herb',
    description: 'Aromatic wild mint growing near stream',
    lngLat: [-73.9701, 40.7556],
    season: 'Summer (June-August)',
    difficulty: 'easy',
    notes: 'Great for tea. Check area is clean.'
  },
  {
    id: 'f11',
    name: 'Serviceberries',
    type: 'berry',
    description: 'Early fruiting shrubs with sweet berries',
    lngLat: [-73.9812, 40.7623],
    season: 'Early Summer (June)',
    difficulty: 'medium',
    notes: 'Birds love these too - get there early!'
  },
  {
    id: 'f12',
    name: 'Purslane',
    type: 'green',
    description: 'Succulent ground cover, high in omega-3s',
    lngLat: [-73.9678, 40.7445],
    season: 'Summer (July-September)',
    difficulty: 'easy',
    notes: 'Common "weed" that\'s actually nutritious'
  },
  {
    id: 'f13',
    name: 'Cherry Trees (Wild)',
    type: 'fruit',
    description: 'Wild cherry trees with tart fruit',
    lngLat: [-73.9598, 40.7692],
    season: 'Mid Summer (July)',
    difficulty: 'medium',
    notes: 'Pits are toxic - spit them out'
  },
  {
    id: 'f14',
    name: 'Chicory',
    type: 'herb',
    description: 'Blue flowering plant with edible roots and leaves',
    lngLat: [-73.9856, 40.7412],
    season: 'Spring & Summer',
    difficulty: 'medium',
    notes: 'Root can be roasted as coffee substitute'
  },
  {
    id: 'f15',
    name: 'Wild Grapes',
    type: 'fruit',
    description: 'Native grapevines growing on fence',
    lngLat: [-73.9945, 40.7267],
    season: 'Late Summer (August-September)',
    difficulty: 'medium',
    notes: 'Small but flavorful. Make sure not poison ivy!'
  }
];

// Color scheme for foraging map markers - using earthy, nature-inspired colors
export const foragingColors = {
  herb: '#22C55E', // green
  berry: '#8B5CF6', // purple
  fruit: '#EF4444', // red
  green: '#10B981', // emerald
  nut: '#92400E', // brown
};
