const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dijkstra = require('./algorithms/dijkstra');
const astar = require('./algorithms/astar');
const aco = require('./algorithms/aco');
const fringeSearch = require('./algorithms/fringe');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/calculate-route', async (req, res) => {
    try {
        const { algorithm, source, destination } = req.body;
        
        if (!source || !destination) {
            return res.status(400).json({ error: "Source and destination are required!" });
        }

        let path;
        switch (algorithm) {
            case "dijkstra":
                path = dijkstra(source, destination);
                break;
            case "astar":
                path = astar(source, destination);
                break;
            case "aco":
                path = aco(source, destination);
                break;
            case "fringe":
                path = fringeSearch(source, destination);
                break;
            default:
                return res.status(400).json({ error: "Invalid algorithm!" });
        }

        res.json({ path });
    } catch (error) {
        console.error('Route calculation error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
