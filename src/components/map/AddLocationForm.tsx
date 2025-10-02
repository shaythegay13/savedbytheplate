import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const locationSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Location name is required" })
    .max(200, { message: "Name must be less than 200 characters" }),
  type: z.enum([
    'Community Garden',
    'Farmers Market',
    'Community Fridge',
    'Food Bank & Pantry',
    'Farm',
    'Urban Farm',
    'Local Food Business',
    'CSA Program'
  ], { message: "Please select a location type" }),
  owner: z.string()
    .trim()
    .min(1, { message: "Owner/organization is required" })
    .max(200, { message: "Owner must be less than 200 characters" }),
  address: z.string()
    .trim()
    .min(1, { message: "Address or coordinates are required" })
    .max(300, { message: "Address must be less than 300 characters" }),
  neighborhood: z.string()
    .trim()
    .min(1, { message: "Neighborhood is required" })
    .max(100, { message: "Neighborhood must be less than 100 characters" }),
  openHours: z.string()
    .trim()
    .max(500, { message: "Open hours must be less than 500 characters" })
    .optional()
    .or(z.literal('')),
  contact: z.string()
    .trim()
    .max(300, { message: "Contact info must be less than 300 characters" })
    .optional()
    .or(z.literal('')),
  localItems: z.string()
    .trim()
    .max(500, { message: "Local items must be less than 500 characters" })
    .optional()
    .or(z.literal('')),
  description: z.string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional()
    .or(z.literal('')),
  website: z.string()
    .trim()
    .max(300, { message: "Website must be less than 300 characters" })
    .optional()
    .or(z.literal('')),
  socialMedia: z.string()
    .trim()
    .max(300, { message: "Social media must be less than 300 characters" })
    .optional()
    .or(z.literal('')),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface AddLocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const locationTypes = [
  'Community Garden',
  'Farmers Market',
  'Community Fridge',
  'Food Bank & Pantry',
  'Farm',
  'Urban Farm',
  'Local Food Business',
  'CSA Program'
] as const;

const AddLocationForm = ({ open, onOpenChange }: AddLocationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  const onSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('submit-location', {
        body: data
      });

      if (error) throw error;
      
      toast.success('Location submitted successfully!', {
        description: 'Your location will be added to the map shortly after review.'
      });
      
      reset();
      setSelectedType('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting location:', error);
      toast.error('Failed to submit location', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setValue('type', type as any);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-sbtp-green-800">Add a New Location</DialogTitle>
          <DialogDescription className="text-sbtp-brown-600">
            Help us expand our map! Submit a new food access location in your community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sbtp-green-700">
              Location Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Brooklyn Community Garden"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sbtp-green-700">Location Type *</Label>
            <div className="grid grid-cols-2 gap-2">
              {locationTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeClick(type)}
                  disabled={isSubmitting}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    selectedType === type
                      ? 'border-sbtp-green-600 bg-sbtp-green-50 text-sbtp-green-800 font-semibold'
                      : 'border-sbtp-green-200 bg-white text-sbtp-brown-700 hover:border-sbtp-green-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('type')} />
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner" className="text-sbtp-green-700">
              Who Owns This Space? *
            </Label>
            <Input
              id="owner"
              {...register('owner')}
              placeholder="e.g., GreenThumb, NYRP, Private"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.owner && (
              <p className="text-sm text-red-600">{errors.owner.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sbtp-green-700">
              Address or Coordinates *
            </Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="e.g., 123 Main St, Brooklyn, NY 11201"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-sbtp-green-700">
              Neighborhood *
            </Label>
            <Input
              id="neighborhood"
              {...register('neighborhood')}
              placeholder="e.g., Williamsburg, Park Slope"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.neighborhood && (
              <p className="text-sm text-red-600">{errors.neighborhood.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="openHours" className="text-sbtp-green-700">
              Open Hours & Operating Days
            </Label>
            <Textarea
              id="openHours"
              {...register('openHours')}
              placeholder="e.g., Mon-Fri 9am-5pm, Sat 10am-2pm"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
              rows={2}
            />
            {errors.openHours && (
              <p className="text-sm text-red-600">{errors.openHours.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact" className="text-sbtp-green-700">
              Contact Information
            </Label>
            <Input
              id="contact"
              {...register('contact')}
              placeholder="e.g., contact@example.com, (555) 123-4567"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.contact && (
              <p className="text-sm text-red-600">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="localItems" className="text-sbtp-green-700">
              Food Selling/Giving Away This Season
            </Label>
            <Textarea
              id="localItems"
              {...register('localItems')}
              placeholder="e.g., Fresh vegetables, herbs, eggs, bread"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
              rows={2}
            />
            {errors.localItems && (
              <p className="text-sm text-red-600">{errors.localItems.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sbtp-green-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Tell us more about this location..."
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sbtp-green-700">
              Website
            </Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="e.g., https://example.com"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.website && (
              <p className="text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialMedia" className="text-sbtp-green-700">
              Social Media
            </Label>
            <Input
              id="socialMedia"
              {...register('socialMedia')}
              placeholder="e.g., @username or social media link"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.socialMedia && (
              <p className="text-sm text-red-600">{errors.socialMedia.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedType('');
                onOpenChange(false);
              }}
              disabled={isSubmitting}
              className="flex-1 border-sbtp-green-300 text-sbtp-green-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-sbtp-green-600 hover:bg-sbtp-green-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationForm;
