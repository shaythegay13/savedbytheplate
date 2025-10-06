import brooklynNavyYard from "@/assets/brooklyn-navy-yard.webp";

export interface CommunitySpotlight {
  title: string;
  location: string;
  description: string;
  image?: string;
  highlights: string[];
}

// Community spotlights that rotate weekly
export const communitySpotlights: CommunitySpotlight[] = [
  {
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
  {
    title: "East New York Farms!",
    location: "East New York, Brooklyn",
    description: "East New York Farms! is a coalition of community-based organizations that promotes local sustainable agriculture and community-led economic development. They've transformed vacant lots into thriving urban gardens.",
    highlights: [
      "Operates over 30 youth-run community and school gardens",
      "Provides fresh produce at farmers markets throughout East New York",
      "Trains youth in sustainable agriculture and entrepreneurship",
      "Distributes over 10,000 lbs of produce to community members annually"
    ]
  },
  {
    title: "Added Value Red Hook Community Farm",
    location: "Red Hook, Brooklyn",
    description: "Added Value operates a 1.75-acre community farm in Red Hook that serves as an educational hub for sustainable farming and environmental stewardship. The farm provides hands-on learning opportunities for local youth.",
    highlights: [
      "Grows over 40 varieties of vegetables and herbs annually",
      "Employs local youth in farm operations and leadership roles",
      "Donates thousands of pounds of produce to local food pantries",
      "Hosts community events and workshops on urban farming"
    ]
  },
  {
    title: "La Finca del Sur",
    location: "South Bronx",
    description: "La Finca del Sur is a community garden and urban farm in the South Bronx that combines sustainable agriculture with cultural preservation. This space celebrates Puerto Rican and Latino heritage while providing fresh food access.",
    highlights: [
      "Cultivates traditional Caribbean and Latin American crops",
      "Features a casita (traditional Puerto Rican house) as a community gathering space",
      "Provides environmental education programs for neighborhood youth",
      "Serves as a cultural hub hosting music, art, and community events"
    ]
  },
  {
    title: "Queens County Farm Museum",
    location: "Floral Park, Queens",
    description: "The Queens County Farm Museum is NYC's largest remaining tract of undisturbed farmland. This 47-acre working farm has been in operation since 1697 and serves as a living history museum.",
    highlights: [
      "47 acres of working farmland with historic buildings",
      "Home to sheep, cows, pigs, chickens, and other farm animals",
      "Offers agricultural education programs for over 50,000 visitors annually",
      "Hosts seasonal festivals, farmers markets, and family activities"
    ]
  },
  {
    title: "Battery Urban Farm",
    location: "Battery Park City, Manhattan",
    description: "Battery Urban Farm is an educational organic farm in Lower Manhattan that demonstrates sustainable urban agriculture. The farm grows vegetables, herbs, and flowers while teaching sustainable practices to the community.",
    highlights: [
      "6,000+ square feet of growing space in Lower Manhattan",
      "All produce donated to local food pantries and community programs",
      "Offers free workshops on composting, beekeeping, and urban farming",
      "Maintains beehives that produce local Battery Park honey"
    ]
  },
  {
    title: "Randall's Island Urban Farm",
    location: "Randall's Island",
    description: "Randall's Island Urban Farm is a 2-acre organic farm that provides educational programming and fresh produce to the community. The farm partners with schools and community organizations to promote food justice.",
    highlights: [
      "Grows over 30 varieties of vegetables using organic methods",
      "Provides farm-based education to thousands of NYC students",
      "Distributes fresh produce through CSA and to local food programs",
      "Offers job training and employment opportunities for local youth"
    ]
  },
  {
    title: "Corbin Hill Food Project",
    location: "Various locations, Bronx and Harlem",
    description: "Corbin Hill Food Project connects low-income communities with fresh, locally-grown food through innovative food share programs. They partner with upstate farms to deliver high-quality produce to urban neighborhoods.",
    highlights: [
      "Delivers over 100,000 lbs of fresh produce to Bronx and Harlem communities",
      "Accepts SNAP/EBT and offers subsidized shares for low-income families",
      "Partners with over 10 upstate New York family farms",
      "Provides nutrition education and cooking demonstrations"
    ]
  }
];

/**
 * Get the current community spotlight based on a weekly rotation
 * Cycles through spotlights every 7 days starting from a fixed epoch
 */
export const getCurrentSpotlight = (): CommunitySpotlight => {
  // Use January 1, 2025 as the epoch (arbitrary starting point)
  const epoch = new Date('2025-01-01').getTime();
  const now = Date.now();
  const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  const weeksSinceEpoch = Math.floor(daysSinceEpoch / 7);
  
  // Rotate through spotlights every 7 days
  const currentIndex = weeksSinceEpoch % communitySpotlights.length;
  
  return communitySpotlights[currentIndex];
};
