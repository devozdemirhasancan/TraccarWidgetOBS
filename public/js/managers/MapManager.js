import { CONFIG } from '../config/config.js';
import UIManager from '../ui/UIManager.js';
import TraccarManager from './TraccarManager.js';
import WeatherManager from './WeatherManager.js';
import ThemeLoader from '../config/themeLoader.js';

class MapManager {
    async initialize() {
        // Load theme first
        const response = await fetch('/config');
        const config = await response.json();
        await ThemeLoader.loadTheme(config.MAP_THEME);

        // Initialize map and other components
        UIManager.map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        });

        const initialCoords = { latitude: 37.7749, longitude: -122.4194 };
        UIManager.map.setView([initialCoords.latitude, initialCoords.longitude], CONFIG.MAP_ZOOM);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(UIManager.map);

        await TraccarManager.initialize();
        await WeatherManager.updateWeather(initialCoords.latitude, initialCoords.longitude);
        
        this.startUpdateLoop();
    }

    startUpdateLoop() {
        setInterval(() => {
            TraccarManager.updatePosition();
        }, CONFIG.UPDATE_INTERVAL);
    }
}

export default new MapManager(); 