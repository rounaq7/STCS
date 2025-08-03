import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface VisualizationProps {
  algorithm: string;
  source: LatLngTuple;
  destination: LatLngTuple;
  steps: LatLngTuple[];
  timeComplexity: string;
  description: string;
}

const AnimatedPolyline = ({ steps }: { steps: LatLngTuple[] }) => {
  const [currentPath, setCurrentPath] = useState<LatLngTuple[]>([]);
  const map = useMap();

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setCurrentPath(prev => [...prev, steps[currentIndex]]);
        currentIndex++;
        // Using map to fit bounds
        if (map && currentPath.length > 0) {
          map.fitBounds(currentPath);
        }
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [steps, map, currentPath]);

  return (
    <>
      <Polyline 
        positions={currentPath}
        color="#2563eb"
        weight={4}
        opacity={0.8}
      />
      {currentPath.map((pos, idx) => (
        <Marker 
          key={idx} 
          position={pos}
          opacity={0.5}
        >
          <Popup>Step {idx + 1}</Popup>
        </Marker>
      ))}
    </>
  );
};

const AlgorithmVisualization = ({ 
  algorithm, 
  source, 
  destination, 
  steps,
  timeComplexity,
  description 
}: VisualizationProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2 h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
        <MapContainer
          center={source}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={source}>
            <Popup>Source</Popup>
          </Marker>
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
          <AnimatedPolyline steps={steps} />
        </MapContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">{algorithm}</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Time Complexity</h3>
            <p className="text-blue-600 font-mono">{timeComplexity}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">How it works</h3>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700">Statistics</h3>
            <ul className="space-y-2">
              <li>Steps explored: {steps.length}</li>
              <li>Distance: {calculateDistance(steps)} km</li>
              <li>Estimated time: {calculateTime(steps)} mins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const calculateDistance = (steps: LatLngTuple[]): number => {
  // Implementation for calculating total distance
  return Number((steps.length * 0.5).toFixed(2));
};

const calculateTime = (steps: LatLngTuple[]): number => {
  // Implementation for calculating estimated time
  return Math.round(steps.length * 2);
};

export default AlgorithmVisualization; 