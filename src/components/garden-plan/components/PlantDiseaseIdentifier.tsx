import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DiseaseIdentification {
  disease: string;
  confidence: number;
  description: string;
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

const PlantDiseaseIdentifier: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DiseaseIdentification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-plant-disease', {
        body: {
          imageData: selectedImage,
          analysisType: 'comprehensive'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Ensure we have valid analysis data before setting it
      if (data && data.disease) {
        setAnalysis(data);
      } else {
        throw new Error('Invalid analysis response');
      }
    } catch (err: any) {
      console.error('Disease analysis error:', err);
      setError('Unable to analyze the image at this time. Please try uploading a clearer photo with better lighting focused on the affected plant parts.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Plant Disease Identifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            {selectedImage ? (
              <div className="space-y-4">
                <img 
                  src={selectedImage} 
                  alt="Plant to analyze" 
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <Button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    size="sm"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 mr-2" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="w-12 h-12 mx-auto text-slate-400" />
                <div>
                  <p className="text-lg font-medium text-slate-600">
                    Upload a photo of your plant
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Take a clear photo of affected leaves or stems for best results
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800">
                  Disease Identified: {analysis.disease}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(analysis.severity)}>
                    {getSeverityIcon(analysis.severity)} {analysis.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(analysis.confidence * 100)}% confidence
                  </Badge>
                </div>
              </div>
              
              <p className="text-slate-600 mb-4">{analysis.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Treatment */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Immediate Treatment
                  </h4>
                  <ul className="space-y-1">
                    {analysis.treatment.map((step, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-green-500">🛡️</span>
                    Prevention Tips
                  </h4>
                  <ul className="space-y-1">
                    {analysis.prevention.map((tip, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Photography Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Take photos in good natural lighting</li>
            <li>• Focus on affected areas of the plant</li>
            <li>• Include both diseased and healthy parts for comparison</li>
            <li>• Take multiple angles if the problem isn't clear</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantDiseaseIdentifier;