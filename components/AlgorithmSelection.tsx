import React, { useState } from 'react';
import axios from 'axios';
import Icon from './Icon'; // Assuming you have this component
import ResultsModal from './ResultsModal';

// Define the component props
interface AlgorithmSelectionProps {
  startPoint: { lat: number, lng: number } | null;
  endPoint: { lat: number, lng: number } | null;
  waypoints: { lat: number, lng: number }[];
  onRouteCalculated?: (results: any) => void;
  onCalculate?: () => void;
}

// Define result types
type AlgorithmResult = {
  name: string;
  route: {
    path: [number, number][];
    distance: number;
    duration: number;
    timeComplexity: string;
  };
  isBest: boolean;
};

const AlgorithmSelection: React.FC<AlgorithmSelectionProps> = ({ 
  startPoint, 
  endPoint, 
  waypoints,
  onRouteCalculated,
  onCalculate
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AlgorithmResult[] | null>(null);
  const [bestAlgorithm, setBestAlgorithm] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasValidPoints = startPoint && endPoint;

  const handleAlgorithmSelect = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleCalculateRoute = async () => {
    if (!hasValidPoints) {
      setError('Please select start and end points');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      if (onCalculate) {
        await onCalculate();
      }
      
      const response = await axios.post('/api/route', {
        origin: [startPoint.lat, startPoint.lng],
        destination: [endPoint.lat, endPoint.lng],
        waypoints: waypoints.map(wp => [wp.lat, wp.lng])
      });
      
      setResults(response.data.results);
      setBestAlgorithm(response.data.bestAlgorithm);
      setIsModalOpen(true);
      
      if (onRouteCalculated) {
        onRouteCalculated(response.data);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setError('Failed to calculate route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="algorithm-selection-card">
        <div className="algorithm-header">
          <Icon name="algorithm" />
          <h2>Select Algorithm</h2>
        </div>
        
        <div className={`algorithm-card ${selectedAlgorithm === 'dijkstra' ? 'selected' : ''}`} 
             onClick={() => handleAlgorithmSelect('dijkstra')}>
          <Icon name="dijkstra" />
          <div className="algorithm-info">
            <h3>Dijkstra's Algorithm</h3>
            <p>Best for finding the shortest path between points</p>
            <span className="complexity">O((V + E) log V)</span>
          </div>
          {selectedAlgorithm === 'dijkstra' && <Icon name="check" />}
        </div>
        
        <div className={`algorithm-card ${selectedAlgorithm === 'astar' ? 'selected' : ''}`}
             onClick={() => handleAlgorithmSelect('astar')}>
          <Icon name="astar" />
          <div className="algorithm-info">
            <h3>A* Algorithm</h3>
            <p>Efficient pathfinding with heuristic approach</p>
            <span className="complexity">O(E)</span>
          </div>
          {selectedAlgorithm === 'astar' && <Icon name="check" />}
        </div>
        
        <div className={`algorithm-card ${selectedAlgorithm === 'ant' ? 'selected' : ''}`}
             onClick={() => handleAlgorithmSelect('ant')}>
          <Icon name="ant" />
          <div className="algorithm-info">
            <h3>Ant Colony Optimization</h3>
            <p>Nature-inspired algorithm for complex routes</p>
            <span className="complexity">O(n*m)</span>
          </div>
          {selectedAlgorithm === 'ant' && <Icon name="check" />}
        </div>
        
        <div className={`algorithm-card ${selectedAlgorithm === 'fringe' ? 'selected' : ''}`}
             onClick={() => handleAlgorithmSelect('fringe')}>
          <Icon name="fringe" />
          <div className="algorithm-info">
            <h3>Fringe Search</h3>
            <p>Memory-efficient pathfinding algorithm</p>
            <span className="complexity">O(bd)</span>
          </div>
          {selectedAlgorithm === 'fringe' && <Icon name="check" />}
        </div>
        
        <button 
          className="calculate-button" 
          onClick={handleCalculateRoute}
          disabled={!hasValidPoints || isLoading}
        >
          {isLoading ? (
            'Calculating...'
          ) : (
            <>
              <Icon name="route" /> Calculate Optimal Route
            </>
          )}
        </button>
        
        {!hasValidPoints && !error && (
          <p className="validation-message">Please select start and end points</p>
        )}
        
        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
      
      {results && (
        <ResultsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          results={results}
          bestAlgorithm={bestAlgorithm || ''}
        />
      )}
    </>
  );
};

export default AlgorithmSelection;
