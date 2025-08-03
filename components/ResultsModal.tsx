import React from 'react';

type Route = {
  path: [number, number][];
  distance: number;
  duration: number;
  timeComplexity: string;
};

type AlgorithmResult = {
  name: string;
  route: Route;
  isBest: boolean;
};

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: AlgorithmResult[];
  bestAlgorithm: string;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, results, bestAlgorithm }) => {
  if (!isOpen) return null;
  
  // Map old algorithm names to new ones
  const getDisplayName = (name: string) => {
    switch (name.toLowerCase()) {
      case 'bellman-ford':
        return 'Ant Colony Optimization';
      default:
        return name;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Algorithm Comparison</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <p className="text-lg mb-4">
            Best Algorithm: <span className="font-semibold text-blue-600">{bestAlgorithm}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result) => (
              <div 
                key={result.name} 
                className={`p-4 rounded-lg border ${result.isBest ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}
              >
                <h3 className="text-lg font-semibold flex items-center">
                  {getDisplayName(result.name)} {result.isBest && <span className="ml-2 text-blue-600">★</span>}
                </h3>
                <div className="mt-2 space-y-1">
                  <p>Distance: {result.route.distance.toFixed(2)} km</p>
                  <p>Duration: {Math.round(result.route.duration * 60)} min</p>
                  <p>Time Complexity: {result.route.timeComplexity}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal; 