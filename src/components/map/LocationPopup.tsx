
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapLocation } from './types';

interface LocationPopupProps {
  location: MapLocation;
  locationColors: Record<string, string>;
}

const LocationPopup = ({ location, locationColors }: LocationPopupProps) => {
  if (!location) return null;
  
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-md shadow-lg p-3 z-10">
      <h4 className="font-medium text-sbtp-green-700">{location.name}</h4>
      <p className="text-xs text-sbtp-brown-500 mt-1">{location.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {location.tags.map((tag, i) => (
          <Badge 
            key={i} 
            variant="outline" 
            className="text-xs"
            style={{
              backgroundColor: `${locationColors[location.type]}20`,
              color: locationColors[location.type]
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <p className="text-xs mt-2">{location.details}</p>
      <Button 
        size="sm" 
        className="w-full mt-2 text-xs text-white"
        style={{ backgroundColor: locationColors[location.type] }}
      >
        View Details
      </Button>
    </div>
  );
};

export default LocationPopup;
