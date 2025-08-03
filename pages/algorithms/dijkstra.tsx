import AlgorithmVisualization from '../../components/AlgorithmVisualization';
import { CHENNAI_LOCATIONS } from '../../utils/constants';
import { LatLngTuple } from 'leaflet';

const DijkstraPage = () => {
  const source = CHENNAI_LOCATIONS['T Nagar'];
  const destination = CHENNAI_LOCATIONS['Tambaram'];
  const steps = generateDijkstraSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <AlgorithmVisualization
          algorithm="Dijkstra's Algorithm"
          source={source}
          destination={destination}
          steps={steps}
          timeComplexity="O((V + E) log V)"
          description="Dijkstra's algorithm finds the shortest path between nodes in a graph by maintaining a set of unvisited nodes and continuously updating the shortest distance to each node."
        />
      </div>
    </div>
  );
};

const generateDijkstraSteps = (): LatLngTuple[] => {
  return [
    CHENNAI_LOCATIONS['T Nagar'],
    CHENNAI_LOCATIONS['Adyar'],
    CHENNAI_LOCATIONS['Velachery'],
    CHENNAI_LOCATIONS['Tambaram']
  ];
};

export default DijkstraPage; 