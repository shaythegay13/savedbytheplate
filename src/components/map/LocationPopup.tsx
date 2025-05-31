
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapLocation } from './types';

interface LocationPopupProps {
  location: MapLocation;
  locationColors: Record<string, string>;
}

const LocationPopup = ({ location, locationColors }: LocationPopupProps) => {
  if (!location) return null;
  
  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };
  
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-md shadow-lg p-4 z-10 max-h-96 overflow-y-auto">
      <h4 className="font-medium text-sbtp-green-700 mb-2">{location.name}</h4>
      
      <div className="space-y-2 text-sm">
        {location.address && (
          <div>
            <span className="font-medium">Address:</span> {location.address}
          </div>
        )}
        
        {location.crossstreets && (
          <div>
            <span className="font-medium">Cross Streets:</span> {location.crossstreets}
          </div>
        )}
        
        {location.zipcode && (
          <div>
            <span className="font-medium">Zipcode:</span> {location.zipcode}
          </div>
        )}
        
        {location.borough && (
          <div>
            <span className="font-medium">Borough:</span> {location.borough}
          </div>
        )}
        
        {location.communityboard && (
          <div>
            <span className="font-medium">Community Board:</span> {location.communityboard}
          </div>
        )}
        
        {location.juris && (
          <div>
            <span className="font-medium">Jurisdiction:</span> {location.juris}
          </div>
        )}
        
        {location.status && (
          <div>
            <span className="font-medium">Status:</span> {location.status}
          </div>
        )}
      </div>
      
      {location.operatingHours && (
        <div className="mt-3">
          <h5 className="font-medium text-sbtp-green-700 mb-2">Open Hours This Season</h5>
          <div className="space-y-1 text-xs">
            {Object.entries(location.operatingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span className="font-medium">{dayNames[day as keyof typeof dayNames]}:</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-3 flex flex-wrap gap-1">
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
      
      {location.details && (
        <p className="text-xs mt-2 text-sbtp-brown-500">{location.details}</p>
      )}
      
      <Button 
        size="sm" 
        className="w-full mt-3 text-xs text-white"
        style={{ backgroundColor: locationColors[location.type] }}
      >
        View Details
      </Button>
    </div>
  );
};

export default LocationPopup;
