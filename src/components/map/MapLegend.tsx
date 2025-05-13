
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MapLegendProps {
  locationColors: Record<string, string>;
}

const MapLegend = ({ locationColors }: MapLegendProps) => {
  return (
    <>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-md shadow-md text-xs">
        <h4 className="font-medium mb-2 text-sbtp-brown-700">Map Legend</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.farm }}></span>
            <span>Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.market }}></span>
            <span>Farmers Markets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.garden }}></span>
            <span>Community Gardens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.urbanfarm }}></span>
            <span>Urban Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.business }}></span>
            <span>Local Food Businesses</span>
          </div>
        </div>
      </div>
      
      {/* Manhattan label */}
      <div className="absolute bottom-4 right-4">
        <Badge className="bg-white text-sbtp-brown-700 border border-sbtp-green-200">Manhattan, NYC</Badge>
      </div>
    </>
  );
};

export default MapLegend;
