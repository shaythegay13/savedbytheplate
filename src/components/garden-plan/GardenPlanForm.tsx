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

interface GardenPlanFormData {
  spaceType: string;
  spaceSize: string;
  sunlight: string;
  hardiness_zone: string;
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
}

interface GardenPlanFormProps {
  onSubmit: (data: GardenPlanFormData) => void;
  isLoading: boolean;
}

const GardenPlanForm: React.FC<GardenPlanFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<GardenPlanFormData>({
    defaultValues: {
      spaceType: "",
      spaceSize: "",
      sunlight: "",
      hardiness_zone: "",
      soil_contaminated: "",
      soil_type: "",
      growing_options: "",
      rainfall: "",
      season: "",
      experience_level: "",
      goals: "",
      space_description: "",
      preferred_plants: "",
      time_commitment: ""
    }
  });
  const watchSoilContaminated = form.watch("soil_contaminated");

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
                name="hardiness_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's your USDA Hardiness Zone?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1a">Zone 1a (-60 to -55°F)</SelectItem>
                        <SelectItem value="1b">Zone 1b (-55 to -50°F)</SelectItem>
                        <SelectItem value="2a">Zone 2a (-50 to -45°F)</SelectItem>
                        <SelectItem value="2b">Zone 2b (-45 to -40°F)</SelectItem>
                        <SelectItem value="3a">Zone 3a (-40 to -35°F)</SelectItem>
                        <SelectItem value="3b">Zone 3b (-35 to -30°F)</SelectItem>
                        <SelectItem value="4a">Zone 4a (-30 to -25°F)</SelectItem>
                        <SelectItem value="4b">Zone 4b (-25 to -20°F)</SelectItem>
                        <SelectItem value="5a">Zone 5a (-20 to -15°F)</SelectItem>
                        <SelectItem value="5b">Zone 5b (-15 to -10°F)</SelectItem>
                        <SelectItem value="6a">Zone 6a (-10 to -5°F)</SelectItem>
                        <SelectItem value="6b">Zone 6b (-5 to 0°F)</SelectItem>
                        <SelectItem value="7a">Zone 7a (0 to 5°F)</SelectItem>
                        <SelectItem value="7b">Zone 7b (5 to 10°F)</SelectItem>
                        <SelectItem value="8a">Zone 8a (10 to 15°F)</SelectItem>
                        <SelectItem value="8b">Zone 8b (15 to 20°F)</SelectItem>
                        <SelectItem value="9a">Zone 9a (20 to 25°F)</SelectItem>
                        <SelectItem value="9b">Zone 9b (25 to 30°F)</SelectItem>
                        <SelectItem value="10a">Zone 10a (30 to 35°F)</SelectItem>
                        <SelectItem value="10b">Zone 10b (35 to 40°F)</SelectItem>
                        <SelectItem value="11a">Zone 11a (40 to 45°F)</SelectItem>
                        <SelectItem value="11b">Zone 11b (45 to 50°F)</SelectItem>
                        <SelectItem value="12a">Zone 12a (50 to 55°F)</SelectItem>
                        <SelectItem value="12b">Zone 12b (55 to 60°F)</SelectItem>
                        <SelectItem value="13a">Zone 13a (60 to 65°F)</SelectItem>
                        <SelectItem value="13b">Zone 13b (65 to 70°F)</SelectItem>
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
