import ENV from '../config/environment.js';
import UIManager from '../ui/UIManager.js';
import { CONFIG, Cache } from '../config/config.js';
import WeatherManager from './WeatherManager.js';

class TraccarManager {
    constructor() {
        this.config = null;
    }

    async initialize() {
        await this.loadConfig();
    }

    async loadConfig() {
        try {
            const response = await fetch('/config');
            if (!response.ok) throw new Error('Config could not be loaded');
            const config = await response.json();
            this.config = {
                TRACCAR_API_URL: config.TRACCAR_API_URL,
                TRACCAR_TOKEN: config.TRACCAR_TOKEN,
                TRACCAR_DEVICE_ID: config.TRACCAR_DEVICE_ID
            };
        } catch (error) {
            ENV.error('Config loading error:', error);
        }
    }

    async updatePosition() {
        try {
            if (!this.config || !this.config.TRACCAR_DEVICE_ID) {
                ENV.error('Traccar configuration is missing');
                return;
            }

            const position = await this.fetchPosition();
            if (position) {
                this.updateUI(position);
            }
        } catch (error) {
            ENV.error('Position update error:', error);
        }
    }

    async fetchPosition() {
        const response = await fetch(`${this.config.TRACCAR_API_URL}/positions`, {
            headers: {
                'Authorization': `Bearer ${this.config.TRACCAR_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Position data could not be retrieved');
        const positions = await response.json();
        return positions.find(pos => pos.deviceId === parseInt(this.config.TRACCAR_DEVICE_ID));
    }

    updateUI(position) {
        const { latitude, longitude, speed, course } = position;
        UIManager.updateMarker(latitude, longitude);
        UIManager.updateSpeed(speed);
        UIManager.updateCompass(course);
        UIManager.map.setView([latitude, longitude], CONFIG.MAP_ZOOM);

        if (this.shouldUpdateWeather(latitude, longitude)) {
            WeatherManager.updateWeather(latitude, longitude);
            Cache.lastPosition = { latitude, longitude };
        }
    }

    shouldUpdateWeather(latitude, longitude) {
        return !Cache.lastPosition || 
               Math.abs(Cache.lastPosition.latitude - latitude) > 0.01 || 
               Math.abs(Cache.lastPosition.longitude - longitude) > 0.01;
    }
}

export default new TraccarManager(); 