
import React, { useState } from 'react';
import GardenPlanForm from './GardenPlanForm';
import GardenPlanResults from './GardenPlanResults';
import LoadingState from './LoadingState';
import { generateMockPlan } from './mockPlanGenerator';
import { GardenPlanFormData, GardenPlan } from './types';

const GardenPlanGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gardenPlan, setGardenPlan] = useState<GardenPlan | null>(null);
  const [formData, setFormData] = useState<GardenPlanFormData | null>(null);

  const generateGardenPlan = async (formData: GardenPlanFormData) => {
    setIsLoading(true);
    setFormData(formData);
    
    try {
      // Call the AI-powered edge function
      const response = await fetch('https://rxwynfpldittdwqtjhkpw.supabase.co/functions/v1/generate-smart-garden-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: 'demo-user' // In real app, get from auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate garden plan');
      }

      const aiPlan = await response.json();
      setGardenPlan(aiPlan);
    } catch (error) {
      console.error('Error generating garden plan:', error);
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
