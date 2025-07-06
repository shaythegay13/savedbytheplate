import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, MapPin } from "lucide-react";
import { researchLocationDimensions } from '@/services/locationResearchService';

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface IntelligentGardenPlotVisualizerProps {
  gardenLayout: GardenLayout[];
  spaceType: string;
  spaceSize: string;
  locationDescription?: string;
}

const IntelligentGardenPlotVisualizer: React.FC<IntelligentGardenPlotVisualizerProps> = ({
  gardenLayout,
  spaceType,
  spaceSize,
  locationDescription = "Your Garden Location"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const data = await researchLocationDimensions(locationDescription);
        setLocationData(data);
      } catch (error) {
        console.error('Failed to research location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [locationDescription]);

  useEffect(() => {
    if (!canvasRef.current || !locationData || loading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas with light background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to fit the location in canvas with proper proportions
    const margin = 80;
    const availableWidth = canvas.width - 2 * margin;
    const availableHeight = canvas.height - 2 * margin;
    
    const actualLength = locationData.estimatedLength || 100;
    const actualWidth = locationData.estimatedWidth || 100;
    
    const scaleX = availableWidth / actualLength;
    const scaleY = availableHeight / actualWidth;
    const scale = Math.min(scaleX, scaleY) * 0.7; // Use 70% to leave space for labels

    // Calculate plot dimensions on canvas
    const plotWidth = actualLength * scale;
    const plotHeight = actualWidth * scale;
    const startX = (canvas.width - plotWidth) / 2;
    const startY = (canvas.height - plotHeight) / 2;

    // Draw main meadow boundary with accurate shape
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';

    if (locationData.boundaryPoints && locationData.boundaryPoints.length > 0) {
      // Draw custom shape based on boundary points (oval for Sheep's Meadow)
      ctx.beginPath();
      const firstPoint = locationData.boundaryPoints[0];
      ctx.moveTo(startX + firstPoint.x * plotWidth, startY + firstPoint.y * plotHeight);
      
      // Create smooth curves between points for oval shape
      for (let i = 1; i < locationData.boundaryPoints.length; i++) {
        const currentPoint = locationData.boundaryPoints[i];
        const nextPoint = locationData.boundaryPoints[(i + 1) % locationData.boundaryPoints.length];
        const controlX = startX + currentPoint.x * plotWidth;
        const controlY = startY + currentPoint.y * plotHeight;
        const endX = startX + nextPoint.x * plotWidth;
        const endY = startY + nextPoint.y * plotHeight;
        
        ctx.quadraticCurveTo(controlX, controlY, (controlX + endX) / 2, (controlY + endY) / 2);
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (locationData.shape === 'oval') {
      // Draw precise oval shape for Sheep's Meadow
      const centerX = startX + plotWidth / 2;
      const centerY = startY + plotHeight / 2;
      const radiusX = plotWidth / 2;
      const radiusY = plotHeight / 2;
      
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      // Default rectangular shape
      ctx.strokeRect(startX, startY, plotWidth, plotHeight);
      ctx.fillRect(startX, startY, plotWidth, plotHeight);
    }

    // Add main title
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(locationData.name, canvas.width / 2, 35);

    // Add area and dimensions
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#059669';
    const areaText = locationData.acres ? `${locationData.acres} acres` : `${Math.round((locationData.squareFeet || 0) / 43560 * 10) / 10} acres`;
    ctx.fillText(areaText, canvas.width / 2, 55);

    // Add dimension labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#374151';
    
    // Length dimension (top)
    const lengthText = `${actualLength}'`;
    ctx.fillText(lengthText, canvas.width / 2, startY - 10);
    
    // Width dimension (side)
    ctx.save();
    ctx.translate(startX - 20, startY + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${actualWidth}'`, 0, 0);
    ctx.restore();

    // Add dimension lines
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Top dimension line
    ctx.beginPath();
    ctx.moveTo(startX, startY - 25);
    ctx.lineTo(startX + plotWidth, startY - 25);
    ctx.stroke();
    
    // Side dimension line  
    ctx.beginPath();
    ctx.moveTo(startX - 35, startY);
    ctx.lineTo(startX - 35, startY + plotHeight);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash

    // Add compass rose
    const compassX = startX + plotWidth - 40;
    const compassY = startY + 40;
    
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#059669';
    
    // North arrow
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 15);
    ctx.lineTo(compassX + 5, compassY - 5);
    ctx.lineTo(compassX, compassY);
    ctx.lineTo(compassX - 5, compassY - 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', compassX, compassY - 20);

    // Add garden section overlays as small indicators
    const sectionColors = ['#f59e0b', '#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c'];
    
    gardenLayout.forEach((section, index) => {
      if (index < 4) { // Only show first 4 sections to avoid clutter
        const angle = (index * Math.PI * 2) / Math.min(gardenLayout.length, 4);
        const radius = Math.min(plotWidth, plotHeight) * 0.25;
        const centerX = startX + plotWidth / 2;
        const centerY = startY + plotHeight / 2;
        
        const sectionX = centerX + Math.cos(angle) * radius;
        const sectionY = centerY + Math.sin(angle) * radius;
        
        // Draw section indicator
        ctx.fillStyle = sectionColors[index] + '80';
        ctx.strokeStyle = sectionColors[index];
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(sectionX, sectionY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Add section label
        ctx.fillStyle = '#1f2937';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), sectionX, sectionY + 3);
      }
    });

    // Add scale indicator
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    const scaleText = `Scale: 1 pixel = ${(1/scale).toFixed(1)} feet`;
    ctx.fillText(scaleText, 15, canvas.height - 15);

    // Add features annotations
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Features:', 15, canvas.height - 50);
    
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    const features = [
      '• Open meadow space',
      '• Full sun exposure', 
      '• Well-drained soil',
      '• High foot traffic area'
    ];
    
    features.forEach((feature, index) => {
      ctx.fillText(feature, 15, canvas.height - 35 + (index * 14));
    });

  }, [gardenLayout, locationData, loading]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Ruler className="mr-2" />
            Researching Your Garden Plot...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin h-8 w-8 border-2 border-sbtp-green-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Ruler className="mr-2" />
          Your Garden Plot Visualization
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 text-sbtp-brown-600" />
          <span className="text-sm text-sbtp-brown-600">{locationData?.description}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationData && (
            <div className="flex gap-2 mb-4">
              {locationData.acres && (
                <Badge variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-800">
                  {locationData.acres} acres
                </Badge>
              )}
              <Badge variant="secondary" className="bg-sbtp-blue/20 text-sbtp-blue">
                {locationData.estimatedLength}' × {locationData.estimatedWidth}'
              </Badge>
              <Badge variant="secondary" className="bg-sbtp-yellow/20 text-sbtp-brown-700">
                {gardenLayout.length} sections
              </Badge>
            </div>
          )}
          
          <div className="border border-sbtp-green-200 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="w-full h-auto max-w-full"
              style={{ display: 'block' }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {gardenLayout.map((section, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded border"
                  style={{ 
                    backgroundColor: ['#f59e0b', '#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c'][index % 6] + '40',
                    borderColor: ['#f59e0b', '#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c'][index % 6]
                  }}
                />
                <span className="text-sbtp-brown-700 font-medium">{section.section}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentGardenPlotVisualizer;