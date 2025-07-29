
import React, { useState } from 'react';
import GardenPlanForm from './GardenPlanForm';
import GardenPlanResults from './GardenPlanResults';
import LoadingState from './LoadingState';
import { generateMockPlan } from './mockPlanGenerator';
import { GardenPlanFormData, GardenPlan } from './types';
import { supabase } from '@/integrations/supabase/client';

const GardenPlanGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gardenPlan, setGardenPlan] = useState<GardenPlan | null>(null);
  const [formData, setFormData] = useState<GardenPlanFormData | null>(null);

  const generateGardenPlan = async (formData: GardenPlanFormData) => {
    setIsLoading(true);
    setFormData(formData);
    
    try {
      console.log('Calling AI garden plan generation with:', formData);
      
      // Call the AI-powered edge function using Supabase client
      const { data: aiPlan, error } = await supabase.functions.invoke('generate-smart-garden-plan', {
        body: {
          ...formData,
          user_id: 'demo-user' // In real app, get from auth context
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`AI function failed: ${error.message}`);
      }

      if (!aiPlan) {
        throw new Error('No plan data returned from AI');
      }

      console.log('AI plan generated successfully:', aiPlan);
      setGardenPlan(aiPlan);
    } catch (error) {
      console.error('Error generating garden plan:', error);
      console.log('Falling back to mock plan');
      // Fallback to mock plan
      const mockPlan = generateMockPlan(formData);
      setGardenPlan(mockPlan);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return <LoadingState />;
  }

  if (gardenPlan) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sbtp-green-800 mb-2">Your AI-Enhanced Personalized Garden Plan</h2>
          <p className="text-sbtp-brown-600">Here's your data-driven garden plan that gets smarter with every gardener who shares their experience</p>
        </div>
        <GardenPlanResults {...gardenPlan} planId={gardenPlan.planId} formData={formData} />
      </div>
    );
  }

  return <GardenPlanForm onSubmit={generateGardenPlan} isLoading={isLoading} />;
};

export default GardenPlanGenerator;
