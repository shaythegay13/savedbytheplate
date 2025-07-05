import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface GardenPlotVisualizerProps {
  gardenLayout: GardenLayout[];
  spaceType: string;
  spaceSize: string;
}

const GardenPlotVisualizer: React.FC<GardenPlotVisualizerProps> = ({
  gardenLayout,
  spaceType,
  spaceSize
}) => {
  const getPlotDimensions = () => {
    if (spaceSize.includes('small') || spaceSize.includes('container')) {
      return { width: 300, height: 200 };
    } else if (spaceSize.includes('medium')) {
      return { width: 400, height: 300 };
    } else if (spaceSize.includes('large') || spaceSize.includes('farm')) {
      return { width: 500, height: 400 };
    }
    return { width: 350, height: 250 };
  };

  const { width, height } = getPlotDimensions();
  
  const getPlantColor = (plantName: string) => {
    const colors = [
      '#10B981', '#059669', '#047857', '#065F46', // greens
      '#F59E0B', '#D97706', '#B45309', '#92400E', // oranges
      '#EF4444', '#DC2626', '#B91C1C', '#991B1B', // reds
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', // purples
    ];
    let hash = 0;
    for (let i = 0; i < plantName.length; i++) {
      hash = plantName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getPlantIcon = (plantName: string) => {
    const lowerName = plantName.toLowerCase();
    if (lowerName.includes('tomato')) return '🍅';
    if (lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('lettuce') || lowerName.includes('salad')) return '🥬';
    if (lowerName.includes('herb') || lowerName.includes('basil') || lowerName.includes('parsley')) return '🌿';
    if (lowerName.includes('pepper')) return '🌶️';
    if (lowerName.includes('cucumber')) return '🥒';
    if (lowerName.includes('bean')) return '🫘';
    if (lowerName.includes('corn')) return '🌽';
    if (lowerName.includes('potato')) return '🥔';
    if (lowerName.includes('onion')) return '🧅';
    if (lowerName.includes('flower')) return '🌸';
    return '🌱';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Your Garden Plot Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Plot Visual */}
          <div className="flex-1">
            <div 
              className="relative bg-gradient-to-br from-sbtp-green-50 to-sbtp-green-100 border-2 border-sbtp-green-200 rounded-lg mx-auto shadow-lg"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              {/* Grid lines for visual appeal */}
              <svg className="absolute inset-0 w-full h-full opacity-10">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#059669" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Plot sections */}
              {gardenLayout.map((section, index) => {
                const sectionWidth = width / Math.ceil(gardenLayout.length / 2);
                const sectionHeight = height / 2;
                const x = (index % Math.ceil(gardenLayout.length / 2)) * sectionWidth;
                const y = Math.floor(index / Math.ceil(gardenLayout.length / 2)) * sectionHeight;

                return (
                  <div
                    key={index}
                    className="absolute border border-sbtp-green-300 bg-white/30 rounded-md flex flex-col items-center justify-center p-2"
                    style={{
                      left: `${x + 5}px`,
                      top: `${y + 5}px`,
                      width: `${sectionWidth - 10}px`,
                      height: `${sectionHeight - 10}px`,
                    }}
                  >
                    <div className="text-xs font-semibold text-sbtp-green-800 mb-1 text-center">
                      {section.section}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {section.plants.slice(0, 4).map((plant, plantIndex) => (
                        <div
                          key={plantIndex}
                          className="flex items-center justify-center w-6 h-6 rounded-full text-sm shadow-sm"
                          style={{ backgroundColor: getPlantColor(plant) + '20', border: `1px solid ${getPlantColor(plant)}` }}
                          title={plant}
                        >
                          <span className="text-xs">{getPlantIcon(plant)}</span>
                        </div>
                      ))}
                      {section.plants.length > 4 && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sbtp-brown-100 border border-sbtp-brown-300 text-xs">
                          +{section.plants.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-sbtp-brown-600 mt-1">
                      {section.size}
                    </div>
                  </div>
                );
              })}

              {/* Compass */}
              <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow-sm">
                <div className="text-xs font-bold text-sbtp-green-700">N</div>
                <div className="w-4 h-4 border-t-2 border-r-2 border-sbtp-green-500 transform rotate-45 mt-1"></div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Badge variant="outline" className="bg-sbtp-green-50 text-sbtp-green-700">
                {spaceType} • {spaceSize}
              </Badge>
            </div>
          </div>

          {/* Legend */}
          <div className="lg:w-64">
            <h4 className="font-semibold text-sbtp-green-800 mb-3">Plant Legend</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {gardenLayout.flatMap(section => section.plants).map((plant, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: getPlantColor(plant) + '40',
                      borderColor: getPlantColor(plant)
                    }}
                  >
                    <span className="text-xs flex items-center justify-center h-full">
                      {getPlantIcon(plant)}
                    </span>
                  </div>
                  <span className="text-sbtp-brown-700">{plant}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-sbtp-yellow/10 border border-sbtp-yellow/30 rounded-lg">
              <h5 className="font-medium text-sbtp-brown-800 mb-2">💡 Layout Tips</h5>
              <ul className="text-xs text-sbtp-brown-600 space-y-1">
                <li>• Taller plants go north to avoid shading</li>
                <li>• Group plants with similar water needs</li>
                <li>• Leave paths between sections</li>
                <li>• Consider companion planting benefits</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GardenPlotVisualizer;