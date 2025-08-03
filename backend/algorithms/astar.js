const heuristic = (a, b) => Math.abs(a.charCodeAt(0) - b.charCodeAt(0));

function astar(source, destination) {
    const graph = {
        "A": { "B": 1, "C": 4 },
        "B": { "A": 1, "C": 2, "D": 5 },
        "C": { "A": 4, "B": 2, "D": 1 },
        "D": { "B": 5, "C": 1 }
    };

    let openSet = [source];
    let cameFrom = {};
    let gScore = { [source]: 0 };
    let fScore = { [source]: heuristic(source, destination) };

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[a] - fScore[b]);
        let current = openSet.shift();

        if (current === destination) {
            let path = [];
            while (current) {
                path.unshift(current);
                current = cameFrom[current];
            }
            return path;
        }

        for (let neighbor in graph[current]) {
            let tentativeGScore = gScore[current] + graph[current][neighbor];

            if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, destination);
                if (!openSet.includes(neighbor)) openSet.push(neighbor);
            }
        }
    }
    return "No path found!";
}

module.exports = astar;
