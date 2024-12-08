const WEATHER_API_URL = 'https://wttr.in';
const CACHE_TIME = 1800000; // 30 minutes

const WeatherService = {
    WEATHER_API_URL,
    cache: null,
    lastFetchTime: 0,

    async get(latitude, longitude) {
        const now = Date.now();
        if (this.cache && (now - this.lastFetchTime < CACHE_TIME)) {
            return this.cache;
        }

        try {
            const response = await fetch(`${WEATHER_API_URL}/${latitude},${longitude}?format=j1`);
            if (!response.ok) throw new Error('Weather data could not be retrieved');
            this.cache = await response.json();
            this.lastFetchTime = now;
            return this.cache;
        } catch (error) {
            console.error('Weather service error:', error);
            throw error;
        }
    },

    isCacheValid(lastUpdateTime) {
        return (Date.now() - lastUpdateTime) < CACHE_TIME;
    }
};

export default WeatherService;