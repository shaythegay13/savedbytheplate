import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, ExternalLink, Facebook, MapPin, Clock, Info, Mail, Phone, Lock, Star, Camera } from 'lucide-react';
import { MapLocation } from './types';
import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { isLocationOpen } from '@/lib/hoursParser';
import LocationReviews from './LocationReviews';
import LocationPhotos from './LocationPhotos';

interface LocationPopupProps {
  location: MapLocation;
  locationColors: Record<string, string>;
  onClose: () => void;
  fullLocationData?: any; // Full location data with contact info
}

const LocationPopup = ({ location, locationColors, onClose, fullLocationData }: LocationPopupProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Check if location is currently open
  const openStatus = isLocationOpen(location.hoursText);
  
  // Get current user and subscription status
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await supabase.auth.getUser(),
  });
  
  const user = userData?.data?.user || null;
  const { subscribed, loading: subLoading } = useSubscription(user);
  
  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data && !error;
    },
    enabled: !!user?.id,
  });
  
  // Determine if user can see contact info (admin or subscriber)
  const canSeeContactInfo = isAdmin || subscribed;
  
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
    <>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl z-10 overflow-hidden border border-gray-200">
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2">{location.name}</h4>
            <button
              onClick={onClose}
              className="h-5 w-5 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-0.5 text-xs text-gray-600 mb-2">
            {location.address && (
              <div>{location.address}</div>
            )}
            {location.zipcode && (
              <div>New York, NY {location.zipcode}</div>
            )}
          </div>
          
          <button
            onClick={() => setDetailsOpen(true)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            View Details
          </button>
        </div>
      </div>
      
      {/* Detailed Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-sbtp-green-700 flex items-center gap-2">
              <MapPin className="h-6 w-6" style={{ color: locationColors[location.type] }} />
              {location.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {location.description}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-1" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Camera className="h-4 w-4 mr-1" />
                Photos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
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

            {!location.operatingHours && location.hoursText && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sbtp-green-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hours
                  </h4>
                  {openStatus.isOpen && (
                    <Badge className="bg-green-500 text-white">Open Now</Badge>
                  )}
                </div>
                <div className="text-sm">
                  {location.hoursText}
                  {openStatus.closesAt && openStatus.isOpen && (
                    <div className="text-sbtp-brown-500 mt-1">Closes at {openStatus.closesAt}</div>
                  )}
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
            
            {/* Contact Information - Premium Feature */}
            {(fullLocationData?.email || fullLocationData?.phone) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sbtp-green-700 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  {fullLocationData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {canSeeContactInfo ? (
                        <a 
                          href={`mailto:${fullLocationData.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {fullLocationData.email}
                        </a>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Premium subscribers only
                        </span>
                      )}
                    </div>
                  )}
                  {fullLocationData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {canSeeContactInfo ? (
                        <a 
                          href={`tel:${fullLocationData.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {fullLocationData.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Premium subscribers only
                        </span>
                      )}
                    </div>
                  )}
                  {!canSeeContactInfo && (
                    <p className="text-xs text-gray-500 mt-2">
                      <a href="/premium" className="text-blue-600 hover:underline">Upgrade to Premium</a> to access volunteer contact information
                    </p>
                  )}
                </div>
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
          </TabsContent>

          <TabsContent value="reviews">
            <LocationReviews 
              locationId={location.id} 
              locationName={location.name}
            />
          </TabsContent>

          <TabsContent value="photos">
            <LocationPhotos 
              locationId={location.id} 
              locationName={location.name}
            />
          </TabsContent>
        </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationPopup;
