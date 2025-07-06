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

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to fit the location in canvas
    const margin = 50;
    const availableWidth = canvas.width - 2 * margin;
    const availableHeight = canvas.height - 2 * margin;
    
    const scaleX = availableWidth / (locationData.estimatedLength || 100);
    const scaleY = availableHeight / (locationData.estimatedWidth || 100);
    const scale = Math.min(scaleX, scaleY) * 0.8; // Use 80% to leave some padding

    // Calculate plot dimensions on canvas
    const plotWidth = (locationData.estimatedLength || 100) * scale;
    const plotHeight = (locationData.estimatedWidth || 100) * scale;
    const startX = (canvas.width - plotWidth) / 2;
    const startY = (canvas.height - plotHeight) / 2;

    // Draw main plot boundary with accurate shape
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';

    if (locationData.boundaryPoints && locationData.boundaryPoints.length > 0) {
      // Draw custom shape based on boundary points
      ctx.beginPath();
      const firstPoint = locationData.boundaryPoints[0];
      ctx.moveTo(startX + firstPoint.x * plotWidth, startY + firstPoint.y * plotHeight);
      
      locationData.boundaryPoints.slice(1).forEach(point => {
        ctx.lineTo(startX + point.x * plotWidth, startY + point.y * plotHeight);
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (locationData.shape === 'oval') {
      // Draw oval shape
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

    // Add title
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(locationData.name, canvas.width / 2, 30);

    // Add dimensions text
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#065f46';
    const dimensionsText = locationData.acres 
      ? `${locationData.acres} acres (${locationData.estimatedLength}' × ${locationData.estimatedWidth}')`
      : `${locationData.estimatedLength}' × ${locationData.estimatedWidth}'`;
    ctx.fillText(dimensionsText, canvas.width / 2, 45);

    // Calculate section layout
    const cols = Math.ceil(Math.sqrt(gardenLayout.length));
    const rows = Math.ceil(gardenLayout.length / cols);
    const sectionWidth = plotWidth / cols;
    const sectionHeight = plotHeight / rows;

    // Plant colors for different types
    const plantColors = [
      '#f59e0b', // yellow
      '#dc2626', // red  
      '#16a34a', // green
      '#2563eb', // blue
      '#9333ea', // purple
      '#ea580c', // orange
    ];

    // Draw garden sections
    gardenLayout.forEach((section, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * sectionWidth;
      const y = startY + row * sectionHeight;

      // Section background
      ctx.fillStyle = plantColors[index % plantColors.length] + '40'; // Add transparency
      ctx.fillRect(x + 2, y + 2, sectionWidth - 4, sectionHeight - 4);

      // Section border
      ctx.strokeStyle = plantColors[index % plantColors.length];
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, sectionWidth - 4, sectionHeight - 4);

      // Section label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      const centerX = x + sectionWidth / 2;
      const centerY = y + sectionHeight / 2;
      
      // Wrap section name if too long
      const maxWidth = sectionWidth - 10;
      const words = section.section.split(' ');
      let lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      // Draw section name
      lines.forEach((line, i) => {
        ctx.fillText(line, centerX, centerY - 10 + i * 14);
      });

      // Draw plant count
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`${section.plants.length} plants`, centerX, centerY + 15);

      // Draw size
      ctx.fillText(section.size, centerX, centerY + 27);
    });

    // Add scale indicator
    ctx.fillStyle = '#374151';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Scale: 1px = ${(1/scale).toFixed(1)} feet`, 10, canvas.height - 10);

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