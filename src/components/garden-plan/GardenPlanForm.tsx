import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from './components/ImageUpload';

interface GardenPlanFormData {
  spaceType: string;
  spaceSize: string;
  sunlight: string;
  soil_contaminated: string;
  soil_type: string;
  growing_options: string;
  rainfall: string;
  season: string;
  experience_level: string;
  goals: string;
  space_description: string;
  preferred_plants: string;
  time_commitment: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  gardenImage?: { file: File; previewUrl: string } | null;
}

interface GardenPlanFormProps {
  onSubmit: (data: GardenPlanFormData) => void;
  isLoading: boolean;
}

const GardenPlanForm: React.FC<GardenPlanFormProps> = ({ onSubmit, isLoading }) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const { toast } = useToast();
  
  const form = useForm<GardenPlanFormData>({
    defaultValues: {
      spaceType: "",
      spaceSize: "",
      sunlight: "",
      soil_contaminated: "",
      soil_type: "",
      growing_options: "",
      rainfall: "",
      season: "",
      experience_level: "",
      goals: "",
      space_description: "",
      preferred_plants: "",
      time_commitment: "",
      latitude: undefined,
      longitude: undefined,
      city: "",
      gardenImage: null
    }
  });
  const watchSoilContaminated = form.watch("soil_contaminated");

  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      const currentCity = form.getValues('city');
      
      if (currentCity && currentCity !== 'Enter your location' && currentCity.trim() !== '') {
        // Try to geocode the entered address/city first
        try {
          // Use a working OpenWeatherMap API call (no key needed for basic geo)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentCity)}&limit=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data && data[0]) {
              form.setValue('latitude', parseFloat(data[0].lat));
              form.setValue('longitude', parseFloat(data[0].lon));
              toast({
                title: "Location Set",
                description: `Using coordinates for ${data[0].display_name.split(',').slice(0,2).join(',')}`,
              });
              setIsGettingLocation(false);
              return;
            }
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      }
      
      // Fallback to GPS location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            form.setValue('latitude', latitude);
            form.setValue('longitude', longitude);
            
            // Get city name from coordinates using a free service
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              if (response.ok) {
                const data = await response.json();
                if (data && data.display_name) {
                  const cityInfo = data.display_name.split(',').slice(0,3).join(',');
                  form.setValue('city', cityInfo);
                }
              }
            } catch (error) {
              console.log('Could not get city name');
            }
            
            toast({
              title: "Location Set",
              description: "Using your current GPS location",
            });
            setIsGettingLocation(false);
          },
          (error) => {
            console.error('Location error:', error);
            toast({
              title: "Location Error",
              description: "Could not access your location. Please enter your city manually.",
              variant: "destructive",
            });
            setIsGettingLocation(false);
          }
        );
      } else {
        toast({
          title: "Geolocation Not Supported",
          description: "Please enter your city manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    } catch (error) {
      console.error('Location error:', error);
      setIsGettingLocation(false);
    }
  };

  const handleImageUpload = (file: File, previewUrl: string) => {
    const imageData = { file, previewUrl };
    setUploadedImage(imageData);
    form.setValue('gardenImage', imageData);
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }
    setUploadedImage(null);
    form.setValue('gardenImage', null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-sbtp-green-800">Create Your Personalized Garden Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="spaceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What type of gardening space do you have?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your space type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="balcony">Balcony/Patio</SelectItem>
                        <SelectItem value="small_yard">Small Yard (under 500 sq ft)</SelectItem>
                        <SelectItem value="medium_yard">Medium Yard (500-2000 sq ft)</SelectItem>
                        <SelectItem value="large_yard">Large Yard (2000-5000 sq ft)</SelectItem>
                        <SelectItem value="small_farm">Small Farm/Homestead (0.25-2 acres)</SelectItem>
                        <SelectItem value="medium_farm">Medium Farm (2-10 acres)</SelectItem>
                        <SelectItem value="large_farm">Large Farm/Urban Farm (10+ acres)</SelectItem>
                         <SelectItem value="community_plot">Community Garden Plot</SelectItem>
                         <SelectItem value="indoor">Indoor Growing</SelectItem>
                         <SelectItem value="greenhouse">Greenhouse</SelectItem>
                         <SelectItem value="cold_frame">Cold Frame Setup</SelectItem>
                         <SelectItem value="high_tunnel">High Tunnel/Hoop House</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spaceSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approximate size of your growing space</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 10x10 feet, 4 containers, 200 sq ft" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (for weather-based recommendations)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="Enter your city or click to get location" />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={getLocation}
                        disabled={isGettingLocation}
                        className="whitespace-nowrap"
                      >
                        {isGettingLocation ? "Getting..." : "Get Location"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sunlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How much sunlight does your space receive daily?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sunlight exposure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full_sun">Full Sun (6+ hours direct sunlight)</SelectItem>
                        <SelectItem value="partial_sun">Partial Sun (4-6 hours direct sunlight)</SelectItem>
                        <SelectItem value="partial_shade">Partial Shade (2-4 hours direct sunlight)</SelectItem>
                        <SelectItem value="full_shade">Full Shade (less than 2 hours direct sunlight)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="soil_contaminated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is your soil potentially contaminated?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no">No, soil is safe</SelectItem>
                        <SelectItem value="yes">Yes, contaminated or uncertain</SelectItem>
                        <SelectItem value="unknown">Not sure/need testing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchSoilContaminated === "no" && (
                <FormField
                  control={form.control}
                  name="soil_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What type of soil do you have?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clay">Clay (heavy, retains water)</SelectItem>
                          <SelectItem value="sandy">Sandy (light, drains quickly)</SelectItem>
                          <SelectItem value="loamy">Loamy (balanced, ideal)</SelectItem>
                          <SelectItem value="rocky">Rocky/Poor soil</SelectItem>
                          <SelectItem value="unknown">Not sure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(watchSoilContaminated === "yes" || watchSoilContaminated === "unknown") && (
                <FormField
                  control={form.control}
                  name="growing_options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred growing method for safe cultivation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select growing method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="raised_beds">Raised beds with new soil</SelectItem>
                          <SelectItem value="container_gardening">Container gardening</SelectItem>
                          <SelectItem value="greenhouse">Greenhouse growing</SelectItem>
                          <SelectItem value="vertical_growing">Vertical/hydroponic systems</SelectItem>
                          <SelectItem value="soil_remediation">Soil testing and remediation first</SelectItem>
                          <SelectItem value="several_methods">Several of these</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="rainfall"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How much rainfall does your area typically receive?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rainfall amount" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low (under 20 inches annually)</SelectItem>
                        <SelectItem value="moderate">Moderate (20-40 inches annually)</SelectItem>
                        <SelectItem value="high">High (over 40 inches annually)</SelectItem>
                        <SelectItem value="variable">Variable/Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What season are you planning for?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="fall">Fall/Autumn</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                        <SelectItem value="year_round">Year-round planning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's your gardening experience level?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (just starting)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (some experience)</SelectItem>
                        <SelectItem value="advanced">Advanced (very experienced)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_commitment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How much time can you dedicate to gardening weekly?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time commitment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (1-2 hours)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 hours)</SelectItem>
                        <SelectItem value="high">High (6+ hours)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your gardening goals?</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., grow fresh vegetables for my family, create a beautiful flower garden, herbs for cooking, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_plants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Are there specific plants you'd like to grow?</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., tomatoes, roses, basil, lettuce, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="space_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional details about your growing space</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any additional information about your space, challenges, or specific conditions..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Component */}
            <ImageUpload
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
              onRemoveImage={handleRemoveImage}
            />

            <Button type="submit" disabled={isLoading} className="w-full bg-sbtp-green-500 hover:bg-sbtp-green-600">
              {isLoading ? "Generating Your Garden Plan..." : "Create My Garden Plan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GardenPlanForm;
