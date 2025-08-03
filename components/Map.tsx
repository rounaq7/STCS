import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Icon, LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CHENNAI_LOCATIONS } from '../utils/constants';

// Update algorithm types to match selection
type AlgorithmType = 'dijkstra' | 'astar' | 'ant' | 'fringe';

interface AlgorithmPath {
  path: LatLngTuple[];
  distance: number;
  duration: number;
  timeComplexity: string;
}

const ROUTE_COLORS: Record<AlgorithmType, { color: string; name: string; complexity: string }> = {
  dijkstra: { 
    color: '#2563eb', 
    name: "Dijkstra's Algorithm",
    complexity: "O((V+E) log V)"
  },
  astar: { 
    color: '#16a34a', 
    name: "A* Algorithm",
    complexity: "O(E)"
  },
  ant: { 
    color: '#dc2626', 
    name: "Ant Colony Optimization",
    complexity: "O(n*m)"
  },
  fringe: { 
    color: '#9333ea', 
    name: "Fringe Search",
    complexity: "O(bd)"
  }
};

interface MapProps {
  source?: string;
  destination?: string;
  algorithmPaths: Partial<Record<AlgorithmType, AlgorithmPath>>;
}

const MapComponent = ({ source, destination, algorithmPaths }: MapProps) => {
  // Chennai center coordinates
  const CHENNAI_CENTER: LatLngTuple = CHENNAI_LOCATIONS['Chennai Central'];
  
  useEffect(() => {
    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Memoize coordinates to prevent unnecessary recalculations
  const { sourceCoords, destCoords } = useMemo(() => ({
    sourceCoords: source && CHENNAI_LOCATIONS[source] ? CHENNAI_LOCATIONS[source] : null,
    destCoords: destination && CHENNAI_LOCATIONS[destination] ? CHENNAI_LOCATIONS[destination] : null
  }), [source, destination]);

  // Define MapClickHandler here inside the main component scope
  const MapClickHandler = ({ handleClick }: { handleClick: (e: LeafletMouseEvent) => void }) => {
    useMapEvents({
      click: handleClick,
    });
    return null;
  };

  return (
    <div className="relative h-full">
      <MapContainer 
        center={CHENNAI_CENTER}
        zoom={12} 
        className="w-full h-full rounded-lg shadow-inner"
        zoomControl={false}
      >
        {source && <MapClickHandler handleClick={(e) => {}} />}
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {sourceCoords && (
          <Marker position={sourceCoords}>
            <Popup>Source: {source}</Popup>
          </Marker>
        )}
        
        {destCoords && (
          <Marker position={destCoords}>
            <Popup>Destination: {destination}</Popup>
          </Marker>
        )}

        {/* Render paths for each algorithm */}
        {Object.entries(algorithmPaths).map(([algo, data]) => (
          data && (
            <Polyline
              key={algo}
              positions={data.path}
              color={ROUTE_COLORS[algo as AlgorithmType].color}
              weight={4}
              opacity={0.8}
            />
          )
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] min-w-[280px]">
        <h3 className="text-sm font-semibold mb-3 text-gray-800">Route Legend</h3>
        <div className="space-y-3">
          {Object.entries(ROUTE_COLORS).map(([algo, { color, name }]) => {
            const pathData = algorithmPaths[algo as AlgorithmType];
            if (!pathData) return null;
            
            return (
              <div key={algo} className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-6 h-2 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-700 font-medium">
                    {pathData.distance.toFixed(2)} km
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(pathData.duration)} min
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
