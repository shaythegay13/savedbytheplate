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

const improvementSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Please provide at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" })
});

type ImprovementFormData = z.infer<typeof improvementSchema>;

interface MapImprovementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MapImprovementForm = ({ open, onOpenChange }: MapImprovementFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ImprovementFormData>({
    resolver: zodResolver(improvementSchema),
  });

  const onSubmit = async (data: ImprovementFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual submission (e.g., send to Supabase or email service)
      // For now, we'll just log it and show a success message
      console.log('Map improvement feedback:', {
        name: data.name,
        email: data.email,
        messageLength: data.message.length,
        timestamp: new Date().toISOString()
      });
      
      toast.success('Thank you for your feedback!', {
        description: 'We appreciate your help in improving our map.'
      });
      
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-sbtp-green-800">Improve This Map</DialogTitle>
          <DialogDescription className="text-sbtp-brown-600">
            Help us make this map better! Share any missing locations, incorrect information, or suggestions for improvement.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sbtp-green-700">
              Your Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your name"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sbtp-green-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your.email@example.com"
              className="border-sbtp-green-200 focus:border-sbtp-green-500"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sbtp-green-700">
              How can we improve this map? *
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about missing locations, incorrect information, or your suggestions..."
              className="border-sbtp-green-200 focus:border-sbtp-green-500 min-h-[120px]"
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
            <p className="text-xs text-sbtp-brown-500">
              Examples: "Missing community fridge at...", "Market hours are incorrect...", "Consider adding..."
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MapImprovementForm;
