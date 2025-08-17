import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { locationColors } from './MapConfig';

// Icon path definitions matching LocationMarker
const getIconPath = (type: string) => {
  const iconPaths = {
    farm: '<path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"/><circle cx="12" cy="12" r="3"/>',
    market: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>',
    garden: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    urbanfarm: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
    business: '<path d="M2 20h20"/><path d="M4 20V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 14h8"/><path d="M8 18h8"/>',
    fridge: '<rect width="4" height="15" x="2" y="4" rx="2"/><rect width="4" height="15" x="6" y="4" rx="2"/><rect width="4" height="15" x="10" y="4" rx="2"/><rect width="4" height="15" x="14" y="4" rx="2"/><rect width="4" height="15" x="18" y="4" rx="2"/><path d="M2 2v20"/><path d="M22 2v20"/>',
    foodbank: '<path d="M9 2v6h6V2"/><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M7 12h10"/><path d="M7 16h10"/>',
  };
  
  return iconPaths[type as keyof typeof iconPaths] || iconPaths.farm;
};

interface UnifiedMapLegendProps {
  locationCounts?: {
    gardens: number;
    markets: number;
    fridges: number;
    foodbanks: number;
    farms: number;
    urbanfarms: number;
    businesses: number;
  };
  isLoading?: boolean;
}

const UnifiedMapLegend = ({ locationCounts, isLoading }: UnifiedMapLegendProps) => {
  const legendItems = [
    {
      type: 'garden',
      label: 'Community Gardens',
      description: 'Community-managed growing spaces',
      color: locationColors.garden,
      count: locationCounts?.gardens || 0
    },
    {
      type: 'market',
      label: 'Farmers Markets',
      description: 'Local produce markets',
      color: locationColors.market,
      count: locationCounts?.markets || 0
    },
    {
      type: 'fridge',
      label: 'Community Fridges',
      description: '24/7 free food access',
      color: locationColors.fridge,
      count: locationCounts?.fridges || 0
    },
    {
      type: 'foodbank',
      label: 'Food Banks & Pantries',
      description: 'Emergency food assistance',
      color: locationColors.foodbank,
      count: locationCounts?.foodbanks || 0
    },
    {
      type: 'farm',
      label: 'Farms',
      description: 'Agricultural production',
      color: locationColors.farm,
      count: locationCounts?.farms || 0
    },
    {
      type: 'urbanfarm',
      label: 'Urban Farms',
      description: 'City-based farming operations',
      color: locationColors.urbanfarm,
      count: locationCounts?.urbanfarms || 0
    },
    {
      type: 'business',
      label: 'Local Food Businesses',
      description: 'Food retailers and restaurants',
      color: locationColors.business,
      count: locationCounts?.businesses || 0
    }
  ];

  const totalCount = legendItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-sbtp-green-800 flex items-center justify-between">
          Food Access Map Legend
          {!isLoading && (
            <Badge variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-700">
              {totalCount} total locations
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-4 w-4 border-2 border-sbtp-green-500 border-t-transparent rounded-full mr-2"></div>
            <span className="text-sm text-sbtp-brown-500">Loading locations...</span>
          </div>
        ) : (
          <>
            {legendItems.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={item.color} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
                    >
                      <g dangerouslySetInnerHTML={{ __html: getIconPath(item.type) }} />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-sbtp-brown-700">
                      {item.label}
                    </div>
                    <div className="text-xs text-sbtp-brown-500">
                      {item.description}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${item.count > 0 ? 'bg-sbtp-green-100 text-sbtp-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {item.count}
                </Badge>
              </div>
            ))}
            
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedMapLegend;