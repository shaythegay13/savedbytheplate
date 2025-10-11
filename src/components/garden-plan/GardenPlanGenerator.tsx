
import React, { useState } from 'react';
import GardenPlanForm from './GardenPlanForm';
import GardenPlanResults from './GardenPlanResults';
import LoadingState from './LoadingState';
import { generateMockPlan } from './mockPlanGenerator';
import { GardenPlanFormData, GardenPlan } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

const GardenPlanGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gardenPlan, setGardenPlan] = useState<GardenPlan | null>(null);
  const [formData, setFormData] = useState<GardenPlanFormData | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();

  const generateGardenPlan = async (formData: GardenPlanFormData) => {
    setIsLoading(true);
    setFormData(formData);
    setUsingMockData(false);
    setErrorDetails(null);
    
    try {
      console.log('=== FRONTEND: Garden Plan Request ===');
      console.log('Form data being sent:', JSON.stringify(formData, null, 2));
      
      // Prepare payload matching Python backend expectations
      const requestPayload = {
        spaceType: formData.spaceType,
        spaceSize: formData.spaceSize,
        growing_location: formData.growing_options || 'outdoors',
        soil_contaminated: formData.soil_contaminated,
        soil_type: formData.soil_type,
        growing_options: formData.growing_options,
        rainfall: formData.rainfall,
        season: formData.season,
        experience_level: formData.experience_level,
        goals: formData.goals,
        space_description: formData.space_description,
        preferred_plants: formData.preferred_plants,
        time_commitment: formData.time_commitment,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: formData.city,
        user_id: 'demo-user' // In real app, get from auth context
      };

      console.log('Request payload to Edge Function:', JSON.stringify(requestPayload, null, 2));
      
      // Call the AI-powered edge function using Supabase client
      const { data: aiPlan, error } = await supabase.functions.invoke('generate-smart-garden-plan', {
        body: requestPayload
      });

      console.log('Edge Function response:', { data: aiPlan, error });

      if (error) {
        console.error('=== FRONTEND: Edge Function Error ===');
        console.error('Error object:', error);
        
        // Check for specific error types
        if (error.message?.includes('timeout') || error.message?.includes('504')) {
          setErrorDetails('Backend service is waking up (cold start). This can take 30-50 seconds on free tier.');
          toast({
            title: "Backend Cold Start",
            description: "The AI service is waking up. Please wait 30 seconds and try again.",
            variant: "default",
          });
        } else if (error.message?.includes('not responding')) {
          setErrorDetails('Python backend is not responding. It may need to be redeployed.');
          toast({
            title: "Backend Connection Failed",
            description: "Unable to connect to AI service. Using fallback mock data.",
            variant: "destructive",
          });
        } else {
          setErrorDetails(error.message);
        }
        
        throw new Error(`Edge Function failed: ${error.message}`);
      }

      if (!aiPlan) {
        throw new Error('No plan data returned from Edge Function');
      }

      console.log('=== FRONTEND: AI Plan Generated Successfully ===');
      console.log('Plan data:', JSON.stringify(aiPlan, null, 2));
      
      toast({
        title: "Garden Plan Generated!",
        description: "Your AI-powered garden plan is ready.",
      });
      
      setGardenPlan(aiPlan);
    } catch (error) {
      console.error('=== FRONTEND: Error Generating Garden Plan ===');
      console.error('Error:', error);
      
      setIsLoading(false);
      
      // Show the actual error instead of falling back to mock data
      toast({
        title: "Backend Error",
        description: error instanceof Error ? error.message : "Failed to generate garden plan",
        variant: "destructive",
      });
      
      // Set error details for display
      setErrorDetails(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };


  if (isLoading) {
    return <LoadingState />;
  }

  if (gardenPlan) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sbtp-green-800 mb-2">
            Your AI-Enhanced Personalized Garden Plan
          </h2>
          <p className="text-sbtp-brown-600">
            Here's your data-driven garden plan that gets smarter with every gardener who shares their experience
          </p>
        </div>
        
        <GardenPlanResults {...gardenPlan} planId={gardenPlan.planId} formData={formData} />
      </div>
    );
  }

  // Show error if present
  if (errorDetails && !isLoading) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Error</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p className="font-semibold">The Python backend returned an error:</p>
              <pre className="bg-slate-900 text-white p-4 rounded text-xs overflow-x-auto">
                {errorDetails}
              </pre>
              <p className="mt-4 text-sm">
                Please check that:
                <ol className="list-decimal ml-4 mt-2">
                  <li>The backend is deployed and running</li>
                  <li>The backend code expects the correct payload structure</li>
                  <li>All required fields are being sent in the request</li>
                </ol>
              </p>
            </div>
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <button 
            onClick={() => {
              setErrorDetails(null);
              setGardenPlan(null);
            }}
            className="px-6 py-2 bg-sbtp-green-600 text-white rounded-lg hover:bg-sbtp-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <GardenPlanForm onSubmit={generateGardenPlan} isLoading={isLoading} />;
};

export default GardenPlanGenerator;
