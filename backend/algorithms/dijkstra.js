const PriorityQueue = require('../utils/PriorityQueue');
const { CHENNAI_GRAPH, CHENNAI_COORDINATES } = require('../utils/constants');

function dijkstra(source, destination) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    Object.keys(CHENNAI_GRAPH).forEach(node => {
        distances[node] = Infinity;
        pq.enqueue(node, Infinity);
    });

    distances[source] = 0;
    pq.enqueue(source, 0);

    while (!pq.isEmpty()) {
        let { element: current } = pq.dequeue();

        if (current === destination) break;

        if (CHENNAI_GRAPH[current]) {
            for (let neighbor in CHENNAI_GRAPH[current]) {
                let newDist = distances[current] + CHENNAI_GRAPH[current][neighbor];

                if (newDist < (distances[neighbor] || Infinity)) {
                    distances[neighbor] = newDist;
                    previous[neighbor] = current;
                    pq.enqueue(neighbor, newDist);
                }
            }
        }
    }

    let path = [];
    let current = destination;
    
    while (current) {
        path.unshift(CHENNAI_COORDINATES[current]);
        current = previous[current];
    }

    return path;
}

module.exports = dijkstra;
