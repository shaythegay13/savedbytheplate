import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { locationColors } from './MapConfig';

interface MapSidebarLegendProps {
  locationCounts?: {
    gardens: number;
    markets: number;
    fridges: number;
    foodbanks: number;
    farms: number;
    urbanfarms: number;
    businesses: number;
  };
}

const MapSidebarLegend = ({ locationCounts }: MapSidebarLegendProps) => {
  const legendItems = [
    {
      type: 'garden',
      label: 'Community Gardens',
      description: 'Community-managed growing spaces',
      color: locationColors.garden,
      count: locationCounts?.gardens
    },
    {
      type: 'market',
      label: 'Farmers Markets',
      description: 'Local produce markets',
      color: locationColors.market,
      count: locationCounts?.markets
    },
    {
      type: 'fridge',
      label: 'Community Fridges',
      description: '24/7 free food access',
      color: locationColors.fridge,
      count: locationCounts?.fridges
    },
    {
      type: 'foodbank',
      label: 'Food Banks & Pantries',
      description: 'Emergency food assistance',
      color: locationColors.foodbank,
      count: locationCounts?.foodbanks
    },
    {
      type: 'farm',
      label: 'Urban Farms',
      description: 'Local farming operations',
      color: locationColors.farm,
      count: locationCounts?.farms
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-sbtp-green-800">
          Food Access Map Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
            {typeof item.count === 'number' && (
              <Badge variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-700">
                {item.count}
              </Badge>
            )}
          </div>
        ))}
        
        <div className="mt-4 pt-3 border-t border-sbtp-green-200">
          <p className="text-xs text-sbtp-brown-500">
            Data sources: NYC Open Data, GrowNYC, Food Bank NYC, and community organizations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSidebarLegend;