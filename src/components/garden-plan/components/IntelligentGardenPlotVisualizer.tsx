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

    // Set canvas size for detailed plan
    canvas.width = 1000;
    canvas.height = 700;

    // Clear canvas with light background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to fit the location in canvas with proper proportions
    const margin = 100;
    const availableWidth = canvas.width - 2 * margin;
    const availableHeight = canvas.height - 2 * margin;
    
    const actualLength = locationData.estimatedLength || 100;
    const actualWidth = locationData.estimatedWidth || 100;
    
    const scaleX = availableWidth / actualLength;
    const scaleY = availableHeight / actualWidth;
    const scale = Math.min(scaleX, scaleY) * 0.8; // Use 80% to leave space for detailed labels

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

    // Draw detailed garden zones and features
    const centerX = startX + plotWidth / 2;
    const centerY = startY + plotHeight / 2;

    // Define garden zones based on the garden layout
    const zones = [
      { name: 'Vegetable Beds', x: 0.2, y: 0.3, width: 0.25, height: 0.4, color: '#16a34a' },
      { name: 'Herb Garden', x: 0.55, y: 0.2, width: 0.2, height: 0.25, color: '#059669' },
      { name: 'Flower Beds', x: 0.15, y: 0.7, width: 0.3, height: 0.25, color: '#dc2626' },
      { name: 'Relaxation Zone', x: 0.6, y: 0.6, width: 0.25, height: 0.3, color: '#2563eb' },
      { name: 'Compost Area', x: 0.8, y: 0.1, width: 0.15, height: 0.15, color: '#92400e' }
    ];

    // Draw zones
    zones.forEach((zone, index) => {
      if (index < gardenLayout.length) {
        const zoneX = startX + zone.x * plotWidth;
        const zoneY = startY + zone.y * plotHeight;
        const zoneWidth = zone.width * plotWidth;
        const zoneHeight = zone.height * plotHeight;

        // Draw zone boundary
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = zone.color + '20';
        ctx.strokeRect(zoneX, zoneY, zoneWidth, zoneHeight);
        ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);

        // Add zone label
        ctx.fillStyle = zone.color;
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(gardenLayout[index]?.section || zone.name, zoneX + zoneWidth/2, zoneY + zoneHeight/2);
      }
    });

    // Draw main pathways
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#f5f5dc';
    
    // Central north-south path
    const pathWidth = plotWidth * 0.08;
    const mainPathX = centerX - pathWidth/2;
    ctx.fillRect(mainPathX, startY + plotHeight * 0.1, pathWidth, plotHeight * 0.8);
    ctx.strokeRect(mainPathX, startY + plotHeight * 0.1, pathWidth, plotHeight * 0.8);
    
    // East-west connecting path
    const crossPathY = centerY - pathWidth/2;
    ctx.fillRect(startX + plotWidth * 0.1, crossPathY, plotWidth * 0.8, pathWidth);
    ctx.strokeRect(startX + plotWidth * 0.1, crossPathY, plotWidth * 0.8, pathWidth);

    // Add entry points
    const entryPoints = [
      { x: startX + plotWidth * 0.5, y: startY, label: 'North Entry' },
      { x: startX + plotWidth * 0.8, y: startY + plotHeight * 0.5, label: 'East Entry' },
      { x: startX + plotWidth * 0.5, y: startY + plotHeight, label: 'South Entry' },
      { x: startX, y: startY + plotHeight * 0.5, label: 'West Entry' }
    ];

    entryPoints.forEach(entry => {
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(entry.x, entry.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Add entry label
      ctx.fillStyle = '#064e3b';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(entry.label, entry.x, entry.y - 15);
    });

    // Add sunny and shady area indicators
    // Sunny areas (south-facing)
    ctx.fillStyle = '#fbbf2480';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    
    // South sunny area
    ctx.beginPath();
    ctx.ellipse(centerX, startY + plotHeight * 0.7, plotWidth * 0.15, plotHeight * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Shady areas (north-facing)
    ctx.fillStyle = '#6b728080';
    ctx.strokeStyle = '#374151';
    
    // North shady area
    ctx.beginPath();
    ctx.ellipse(centerX, startY + plotHeight * 0.3, plotWidth * 0.12, plotHeight * 0.08, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash

    // Add sun/shade legend
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    
    // Sunny area legend
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(startX + plotWidth - 80, startY + 20, 12, 8);
    ctx.fillStyle = '#374151';
    ctx.fillText('Full Sun Areas', startX + plotWidth - 65, startY + 28);
    
    // Shady area legend
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(startX + plotWidth - 80, startY + 35, 12, 8);
    ctx.fillStyle = '#374151';
    ctx.fillText('Partial Shade', startX + plotWidth - 65, startY + 43);

    // Add comprehensive scale indicator with visual scale bar
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SCALE:', 15, canvas.height - 80);
    
    // Calculate and display scale
    const pixelsPerFoot = scale;
    const feetPer100Pixels = 100 / pixelsPerFoot;
    const scaleText = `1 inch = ${Math.round(feetPer100Pixels * 4.17)} feet (approx)`;
    ctx.font = '11px sans-serif';
    ctx.fillText(scaleText, 15, canvas.height - 65);
    
    // Draw visual scale bar
    const scaleBarLength = 100; // 100 pixels
    const scaleBarFeet = Math.round(scaleBarLength / pixelsPerFoot);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, canvas.height - 50);
    ctx.lineTo(15 + scaleBarLength, canvas.height - 50);
    ctx.stroke();
    
    // Scale bar markers
    ctx.beginPath();
    ctx.moveTo(15, canvas.height - 55);
    ctx.lineTo(15, canvas.height - 45);
    ctx.moveTo(15 + scaleBarLength, canvas.height - 55);
    ctx.lineTo(15 + scaleBarLength, canvas.height - 45);
    ctx.stroke();
    
    ctx.fillStyle = '#374151';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('0', 15, canvas.height - 35);
    ctx.fillText(`${scaleBarFeet}'`, 15 + scaleBarLength, canvas.height - 35);

    // Add features annotations in the right sidebar
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SITE FEATURES:', startX + plotWidth + 20, startY + 60);
    
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    const features = [
      '• Open meadow space',
      '• Full sun exposure', 
      '• Well-drained soil',
      '• High foot traffic area',
      '• Central Park setting'
    ];
    
    features.forEach((feature, index) => {
      ctx.fillText(feature, startX + plotWidth + 20, startY + 80 + (index * 16));
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