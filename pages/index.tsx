import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AlgorithmSelection from '../components/AlgorithmSelection';
import axios from 'axios';
import { LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { CHENNAI_LOCATIONS } from '../utils/constants';
import Image from 'next/image';

type AlgorithmType = 'dijkstra' | 'astar' | 'ant' | 'fringe';

const ROUTE_COLORS: Record<AlgorithmType, { color: string; name: string }> = {
  dijkstra: { color: '#2563eb', name: "Dijkstra's Algorithm" },
  astar: { color: '#16a34a', name: "A* Algorithm" },
  ant: { color: '#dc2626', name: "Ant Colony Optimization" },
  fringe: { color: '#9333ea', name: "Fringe Search" }
};

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

// Define a type for the route results
type RouteResults = {
  results: Array<{
    name: string;
    route: {
      path: [number, number][];
      distance: number;
      duration: number;
      timeComplexity: string;
    };
    isBest: boolean;
  }>;
  bestAlgorithm: string;
};

interface RouteData {
  path: LatLngTuple[];
  distance: number;
  duration: number;
}

interface AlgorithmPath {
  path: LatLngTuple[];
  distance: number;
  duration: number;
  timeComplexity: string;
}

export default function Home() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [shortestPath, setShortestPath] = useState<LatLngTuple[]>([]);
  const [algorithm, setAlgorithm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [startPoint, setStartPoint] = useState<{lat: number, lng: number} | null>(null);
  const [endPoint, setEndPoint] = useState<{lat: number, lng: number} | null>(null);
  const [waypoints, setWaypoints] = useState<{lat: number, lng: number}[]>([]);
  const [routeResults, setRouteResults] = useState<RouteResults | null>(null);
  const [algorithmPaths, setAlgorithmPaths] = useState<Partial<Record<AlgorithmType, AlgorithmPath>>>({});

  const fetchRoute = async (algo: string) => {
    if (!source || !destination) {
      alert("Please select both source and destination locations");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/calculate-route', {
        algorithm: algo,
        source,
        destination
      });
      setShortestPath(response.data.path);
      setAlgorithm(algo);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRoutes = async () => {
    if (!source || !destination) {
      alert("Please select both source and destination locations");
      return;
    }

    setLoading(true);
    try {
      const algorithms: AlgorithmType[] = ['dijkstra', 'astar', 'ant', 'fringe'];
      const results = await Promise.all(
        algorithms.map(algo => 
          axios.post('/api/calculate-route', {
            algorithm: algo,
            source,
            destination
          })
        )
      );

      const paths: Partial<Record<AlgorithmType, AlgorithmPath>> = {};
      
      results.forEach((res, index) => {
        paths[algorithms[index]] = {
          path: res.data.path,
          distance: res.data.distance,
          duration: res.data.duration,
          timeComplexity: res.data.timeComplexity
        };
      });
      
      setAlgorithmPaths(paths);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map click handler to set start/end points
  const handleMapClick = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    if (!startPoint) {
      setStartPoint({ lat, lng });
    } else if (!endPoint) {
      setEndPoint({ lat, lng });
    } else {
      // Add as waypoint if both start and end are set
      setWaypoints([...waypoints, { lat, lng }]);
    }
  };

  // Handle the route results
  const handleRouteCalculated = (results: RouteResults) => {
    setRouteResults(results);
    // You can also update your map to show the routes here
  };

  useEffect(() => {
    if (source && CHENNAI_LOCATIONS[source]) {
      const [lat, lng] = CHENNAI_LOCATIONS[source];
      setStartPoint({ lat, lng });
    }
    
    if (destination && CHENNAI_LOCATIONS[destination]) {
      const [lat, lng] = CHENNAI_LOCATIONS[destination];
      setEndPoint({ lat, lng });
    }
  }, [source, destination]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚦</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Chennai Smart Traffic</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Smart Route Planning
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Navigate Chennai efficiently with our advanced pathfinding algorithms
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg backdrop-filter">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-2xl mr-2">📍</span>
                    Route Details
                  </h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Starting Point
                      </label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-blue-500 focus:border-blue-500 transition-all
                                 appearance-none bg-white"
                      >
                        <option value="">Select starting point</option>
                        {Object.keys(CHENNAI_LOCATIONS).map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-[38px] text-gray-400">
                        🏁
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-blue-500 focus:border-blue-500 transition-all
                                 appearance-none bg-white"
                      >
                        <option value="">Select destination</option>
                        {Object.keys(CHENNAI_LOCATIONS).map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-[38px] text-gray-400">
                        📍
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <AlgorithmSelection
                    startPoint={startPoint}
                    endPoint={endPoint}
                    waypoints={waypoints}
                    onRouteCalculated={handleRouteCalculated}
                    onCalculate={fetchAllRoutes}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Map Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px]">
              <MapComponent
                source={source}
                destination={destination}
                algorithmPaths={algorithmPaths as Partial<Record<AlgorithmType, AlgorithmPath & { timeComplexity: string }>>}
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {shortestPath.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg backdrop-filter">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Route Summary</h3>
                  <p className="text-gray-600">Using {algorithm} Algorithm</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {(shortestPath.length * 0.5).toFixed(1)} km
                  </p>
                  <p className="text-gray-500">Total Distance</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(shortestPath.length * 2)} min
                  </p>
                  <p className="text-gray-500">Estimated Time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-lg text-gray-700">Calculating optimal route...</p>
                <p className="text-sm text-gray-500 mt-2">Using {algorithm} Algorithm</p>
              </div>
            </div>
          </div>
        )}

        {Object.keys(algorithmPaths).length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Route Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(ROUTE_COLORS).map(([algo, { color, name }]) => {
                  const routeData = algorithmPaths[algo as keyof typeof algorithmPaths];
                  return routeData && (
                    <div key={algo} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <h4 className="font-semibold">{name}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-gray-800">
                          {routeData.distance.toFixed(2)} km
                        </p>
                        <p className="text-sm text-gray-500">
                          Est. {Math.round(routeData.duration * 60)} min
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
