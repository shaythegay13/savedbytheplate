import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";

interface LocationInputProps {
  onLocationSubmit: (location: { address?: string; lat?: number; lng?: number }) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationSubmit }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [inputType, setInputType] = useState<'address' | 'coordinates'>('address');

  const handleSubmit = () => {
    if (inputType === 'address' && address.trim()) {
      onLocationSubmit({ address: address.trim() });
    } else if (inputType === 'coordinates' && coordinates.lat && coordinates.lng) {
      onLocationSubmit({ 
        lat: parseFloat(coordinates.lat), 
        lng: parseFloat(coordinates.lng) 
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSubmit({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-sbtp-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-sbtp-green-600" />
        </div>
        <CardTitle className="text-sbtp-green-700">Where is your garden located?</CardTitle>
        <CardDescription className="text-sbtp-brown-500">
          We need your location to provide personalized growing recommendations and climate data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant={inputType === 'address' ? 'default' : 'outline'}
            onClick={() => setInputType('address')}
            className="flex-1"
          >
            Address
          </Button>
          <Button
            variant={inputType === 'coordinates' ? 'default' : 'outline'}
            onClick={() => setInputType('coordinates')}
            className="flex-1"
          >
            Coordinates
          </Button>
        </div>

        {inputType === 'address' ? (
          <div className="space-y-2">
            <Label htmlFor="address">Street Address or City</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Main St, Brooklyn, NY or just Brooklyn, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="e.g., 40.7128"
                value={coordinates.lat}
                onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="e.g., -74.0060"
                value={coordinates.lng}
                onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleGetCurrentLocation}
            variant="outline"
            className="w-full border-sbtp-green-500 text-sbtp-green-700"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Use Current Location
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={
              (inputType === 'address' && !address.trim()) ||
              (inputType === 'coordinates' && (!coordinates.lat || !coordinates.lng))
            }
            className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInput;