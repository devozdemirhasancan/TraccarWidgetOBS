import 'dotenv/config'; // Use import for dotenv
import express from 'express'; // Use import for express
import path from 'path'; // Use import for path
import ServiceRegistry from './public/js/services/serviceRegistry.js'; // Use import for ServiceRegistry

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Send config values to the client
app.get('/config', (req, res) => {
    res.json({
        TRACCAR_API_URL: process.env.TRACCAR_API_URL,
        TRACCAR_TOKEN: process.env.TRACCAR_TOKEN,
        TRACCAR_DEVICE_ID: process.env.TRACCAR_DEVICE_ID,
        MAP_THEME: process.env.MAP_THEME || 'default'
    });
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});