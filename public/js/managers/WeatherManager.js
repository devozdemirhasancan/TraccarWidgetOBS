import ENV from '../config/environment.js';
import UIManager from '../ui/UIManager.js';
import { CONFIG, Cache } from '../config/config.js';

class WeatherManager {
    constructor() {
        this.WEATHER_API_URL = 'https://wttr.in';
        this.cache = null;
        this.lastFetchTime = 0;
    }

    async updateWeather(latitude, longitude) {
        try {
            const weather = await this.getWeatherData(latitude, longitude);
            UIManager.updateWeather(weather);
        } catch (error) {
            ENV.error('Weather update error:', error);
        }
    }

    async getWeatherData(latitude, longitude) {
        const now = Date.now();
        if (this.cache && (now - this.lastFetchTime < CONFIG.WEATHER_CACHE_TIME)) {
            return this.cache;
        }

        try {
            const response = await fetch(`${this.WEATHER_API_URL}/${latitude},${longitude}?format=j1`);
            if (!response.ok) throw new Error('Weather data could not be retrieved');
            
            this.cache = await response.json();
            this.lastFetchTime = now;
            return this.cache;
        } catch (error) {
            ENV.error('Weather service error:', error);
            throw error;
        }
    }

    getDefaultWeather() {
        return {
            current_condition: [{
                temp_C: '22',
                weatherDesc: [{ value: '☀️' }]
            }]
        };
    }

    isCacheValid() {
        return (Date.now() - this.lastFetchTime) < CONFIG.WEATHER_CACHE_TIME;
    }
}

export default new WeatherManager(); 