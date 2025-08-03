const CHENNAI_GRAPH = {
  'T Nagar': {
    'Adyar': 5,
    'Anna Nagar': 7,
    'Velachery': 8
  },
  'Adyar': {
    'T Nagar': 5,
    'Velachery': 4,
    'OMR': 6
  },
  'Velachery': {
    'T Nagar': 8,
    'Adyar': 4,
    'Tambaram': 7,
    'OMR': 3
  },
  'Tambaram': {
    'Velachery': 7,
    'OMR': 9
  },
  // Add other locations and their connections
};

const CHENNAI_COORDINATES = {
  'Chennai Central': [13.0827, 80.2707],
  'Marina Beach': [13.0500, 80.2824],
  'T Nagar': [13.0418, 80.2341],
  'Anna Nagar': [13.0850, 80.2101],
  'Velachery': [12.9815, 80.2180],
  'Tambaram': [12.9249, 80.1000],
  'Adyar': [13.0012, 80.2565],
  'Porur': [13.0359, 80.1567],
  'OMR': [12.9010, 80.2279],
  'ECR': [12.9516, 80.2940]
};

module.exports = { CHENNAI_GRAPH, CHENNAI_COORDINATES }; 