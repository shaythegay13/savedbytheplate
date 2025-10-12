import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, ExternalLink, Facebook, MapPin, Clock, Info } from 'lucide-react';
import { MapLocation } from './types';
import { useState } from 'react';

interface LocationPopupProps {
  location: MapLocation;
  locationColors: Record<string, string>;
  onClose: () => void;
}

const LocationPopup = ({ location, locationColors, onClose }: LocationPopupProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  
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
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sbtp-green-700 flex-1">{location.name}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
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
        
        {location.website && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Website:</span>
            <a 
              href={location.website.startsWith('http') ? location.website : `https://${location.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Visit
            </a>
          </div>
        )}
        
        {location.facebook && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Facebook:</span>
            <a 
              href={location.facebook.startsWith('http') ? location.facebook : `https://facebook.com/${location.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Facebook className="h-3 w-3" />
              Visit
            </a>
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
        onClick={() => setDetailsOpen(true)}
      >
        View Details
      </Button>
      
      {/* Detailed Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-sbtp-green-700 flex items-center gap-2">
              <MapPin className="h-6 w-6" style={{ color: locationColors[location.type] }} />
              {location.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {location.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Location Type Badge */}
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                style={{
                  backgroundColor: `${locationColors[location.type]}20`,
                  color: locationColors[location.type]
                }}
              >
                {location.type.toUpperCase()}
              </Badge>
              {location.tags.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Address Section */}
            {location.address && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-green-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Information
                </h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Address:</span> {location.address}</p>
                  {location.crossstreets && (
                    <p><span className="font-medium">Cross Streets:</span> {location.crossstreets}</p>
                  )}
                  {location.zipcode && (
                    <p><span className="font-medium">Zipcode:</span> {location.zipcode}</p>
                  )}
                  {location.borough && (
                    <p><span className="font-medium">Borough:</span> {location.borough}</p>
                  )}
                  {location.communityboard && (
                    <p><span className="font-medium">Community Board:</span> {location.communityboard}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Operating Hours */}
            {location.operatingHours && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-green-700 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Operating Hours
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(location.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{dayNames[day as keyof typeof dayNames]}:</span>
                      <span className="text-right">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Details */}
            {location.details && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-green-700 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Additional Information
                </h4>
                <p className="text-sm text-sbtp-brown-600 whitespace-pre-line">{location.details}</p>
              </div>
            )}
            
            {/* Links Section */}
            {(location.website || location.facebook) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-green-700 mb-2">Links</h4>
                <div className="space-y-2">
                  {location.website && (
                    <a 
                      href={location.website.startsWith('http') ? location.website : `https://${location.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                  {location.facebook && (
                    <a 
                      href={location.facebook.startsWith('http') ? location.facebook : `https://facebook.com/${location.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Facebook className="h-4 w-4" />
                      Visit Facebook Page
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Status and Jurisdiction */}
            {(location.status || location.juris) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-green-700 mb-2">Administrative Info</h4>
                <div className="space-y-1 text-sm">
                  {location.status && (
                    <p><span className="font-medium">Status:</span> {location.status}</p>
                  )}
                  {location.juris && (
                    <p><span className="font-medium">Jurisdiction:</span> {location.juris}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationPopup;
