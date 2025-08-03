import type { NextApiRequest, NextApiResponse } from 'next';

// Define types for our route calculations
type Point = [number, number]; // [latitude, longitude]
type Route = {
  path: Point[];
  distance: number;
  duration: number;
  timeComplexity: string;
}

type AlgorithmResult = {
  name: string;
  route: Route;
  isBest: boolean;
}

type RouteResponse = {
  results: AlgorithmResult[];
  bestAlgorithm: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RouteResponse | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { origin, destination, waypoints = [] } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    // Calculate routes using different algorithms
    const dijkstraResult = calculateDijkstra(origin, destination, waypoints);
    const aStarResult = calculateAStar(origin, destination, waypoints);
    const bellmanFordResult = calculateBellmanFord(origin, destination, waypoints);
    const floydWarshallResult = calculateFloydWarshall(origin, destination, waypoints);

    // Find the best algorithm based on distance
    const results = [
      { name: 'Dijkstra', route: dijkstraResult, isBest: false },
      { name: 'A*', route: aStarResult, isBest: false },
      { name: 'Bellman-Ford', route: bellmanFordResult, isBest: false },
      { name: 'Floyd-Warshall', route: floydWarshallResult, isBest: false }
    ];

    // Find the best algorithm (lowest distance)
    const bestAlgorithm = findBestAlgorithm(results);
    
    // Mark the best algorithm
    results.forEach(result => {
      if (result.name === bestAlgorithm) {
        result.isBest = true;
      }
    });

    return res.status(200).json({
      results,
      bestAlgorithm
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    return res.status(500).json({ message: 'Failed to calculate routes' });
  }
}

// Algorithm implementation functions
function calculateDijkstra(origin: Point, destination: Point, waypoints: Point[]): Route {
  // Example implementation - in a real app, implement the actual algorithm
  const path = generatePath(origin, destination, waypoints);
  const distance = calculateDistance(path);
  
  return {
    path,
    distance,
    duration: distance / 60, // Assuming 60 km/h average speed
    timeComplexity: 'O((V+E) log V)' // Where V is vertices and E is edges
  };
}

function calculateAStar(origin: Point, destination: Point, waypoints: Point[]): Route {
  // Similar implementation but with A* algorithm
  const path = generatePath(origin, destination, waypoints);
  // A* typically finds slightly different paths than Dijkstra
  const distance = calculateDistance(path) * 0.95; // Simulating potential efficiency
  
  return {
    path,
    distance,
    duration: distance / 60,
    timeComplexity: 'O(E)'
  };
}

function calculateBellmanFord(origin: Point, destination: Point, waypoints: Point[]): Route {
  const path = generatePath(origin, destination, waypoints);
  // Bellman-Ford might find different optimal paths compared to Dijkstra
  const distance = calculateDistance(path) * 1.05; // Simulating potential difference
  
  return {
    path,
    distance,
    duration: distance / 65, // Slightly different speed assumption
    timeComplexity: 'O(V*E)'
  };
}

function calculateFloydWarshall(origin: Point, destination: Point, waypoints: Point[]): Route {
  const path = generatePath(origin, destination, waypoints);
  const distance = calculateDistance(path) * 1.02;
  
  return {
    path,
    distance,
    duration: distance / 62,
    timeComplexity: 'O(V³)'
  };
}

// Helper functions
function generatePath(origin: Point, destination: Point, waypoints: Point[]): Point[] {
  const allPoints = [origin, ...waypoints, destination];
  const path: Point[] = [origin];
  
  // Create intermediary points between each point
  for (let i = 0; i < allPoints.length - 1; i++) {
    const current = allPoints[i];
    const next = allPoints[i + 1];
    
    // Create some points in between
    const intermediatePoints = generateIntermediatePoints(current, next);
    path.push(...intermediatePoints);
    
    if (i < allPoints.length - 2) {
      path.push(next);
    }
  }
  
  path.push(destination);
  return path;
}

function generateIntermediatePoints(start: Point, end: Point): Point[] {
  // Generate some random intermediate points between start and end
  const points: Point[] = [];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 intermediate points
  
  for (let i = 0; i < count; i++) {
    const ratio = (i + 1) / (count + 1);
    const lat = start[0] + (end[0] - start[0]) * ratio + (Math.random() - 0.5) * 0.01;
    const lng = start[1] + (end[1] - start[1]) * ratio + (Math.random() - 0.5) * 0.01;
    points.push([lat, lng]);
  }
  
  return points;
}

function calculateDistance(path: Point[]): number {
  let distance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    
    // Haversine formula for distance
    const R = 6371; // Earth radius in km
    const dLat = toRad(p2[0] - p1[0]);
    const dLon = toRad(p2[1] - p1[1]);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(p1[0])) * Math.cos(toRad(p2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    distance += d;
  }
  
  return parseFloat(distance.toFixed(2));
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

function findBestAlgorithm(results: AlgorithmResult[]): string {
  let bestAlgorithm = results[0].name;
  let minDistance = results[0].route.distance;
  
  for (let i = 1; i < results.length; i++) {
    if (results[i].route.distance < minDistance) {
      minDistance = results[i].route.distance;
      bestAlgorithm = results[i].name;
    }
  }
  
  return bestAlgorithm;
} 