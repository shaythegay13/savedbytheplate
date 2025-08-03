import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { locationColors } from './MapConfig';

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
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: item.color }}
                  />
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
            
            <div className="mt-4 pt-3 border-t border-sbtp-green-200">
              <p className="text-xs text-sbtp-brown-500">
                Data sources: NYC Open Data, GrowNYC, Food Bank NYC, and community organizations
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedMapLegend;