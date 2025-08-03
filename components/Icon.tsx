import React from 'react';

interface IconProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name }) => {
  // Simple icon mapping
  const getIcon = () => {
    switch (name) {
      case 'algorithm':
        return '🧠';
      case 'dijkstra':
        return '🧭';
      case 'astar':
        return '⭐';
      case 'ant':
        return '🐜';
      case 'fringe':
        return '🌀';
      case 'route':
        return '🗺️';
      case 'check':
        return '✓';
      default:
        return '📍';
    }
  };

  return <span className="icon">{getIcon()}</span>;
};

export default Icon; 