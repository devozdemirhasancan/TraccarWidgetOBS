import ServiceRegistry from './services/serviceRegistry.js';

const CONFIG = {
    UPDATE_INTERVAL: 1000,
    WEATHER_CACHE_TIME: 1800000,
    HIGH_SPEED_THRESHOLD: 60,
    MAP_ZOOM: 13,
    ANIMATION_DURATION: 0.3
};

let TRACCAR_CONFIG = null;

const UI = {
    map: null,
    vehicleMarker: null,
    elements: {
        speedBox: createUIElement('div', 'speed-box'),
        compass: createUIElement('div', 'compass'),
        streetName: createUIElement('div', 'street-name'),
        weatherBox: createUIElement('div', 'weather-box'),
        speedEffect: createUIElement('div', 'speed-effect', true)
    }
};

const Cache = {
    weather: null,
    weatherLastUpdate: 0,
    lastPosition: null,
    lastUpdateTime: 0
};

function createUIElement(type, id, isClass = false) {
    const element = document.createElement(type);
    isClass ? element.className = id : element.id = id;
    document.body.appendChild(element);
    return element;
}

async function initializeMap() {
    UI.map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    });

    const latitude = 37.7749; // Example: San Francisco latitude
    const longitude = -122.4194; // Example: San Francisco longitude

    UI.map.setView([latitude, longitude], CONFIG.MAP_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(UI.map);

    await loadConfig();
    await updateWeather(latitude, longitude);
    await updatePositions();

    setInterval(() => {
        updatePositions();
    }, CONFIG.UPDATE_INTERVAL);
}

async function loadConfig() {
    try {
        const response = await fetch('/config');
        if (!response.ok) throw new Error('Config could not be loaded');
        const config = await response.json();
        //console.log('Loaded config:', config);
        TRACCAR_CONFIG = {
            TRACCAR_API_URL: config.TRACCAR_API_URL,
            TRACCAR_TOKEN: config.TRACCAR_TOKEN,
            TRACCAR_DEVICE_ID: config.TRACCAR_DEVICE_ID
        };
    } catch (error) {
        console.error('Config loading error:', error);
    }
}

async function updateWeather(latitude, longitude) {
    try {
        const weather = await ServiceRegistry.WeatherService.get(latitude, longitude);
        UI.elements.weatherBox.innerHTML = `
            <div class="weather-icon">${weather.current_condition[0].weatherDesc[0].value}</div>
            <div class="weather-temp">${weather.current_condition[0].temp_C}°C</div>
        `;
    } catch (error) {
        console.error('Weather update error:', error);
    }
}

async function updatePositions() {
    try {
        const positions = await ServiceRegistry.TraccarService.fetchPositions(
            TRACCAR_CONFIG.TRACCAR_API_URL,
            TRACCAR_CONFIG.TRACCAR_TOKEN
        );

        console.log('Fetched positions:', positions);

        const filteredPosition = positions.find(position => position.deviceId === TRACCAR_CONFIG.TRACCAR_DEVICE_ID);

        if (filteredPosition) {
            const { latitude, longitude, speed } = filteredPosition;

            if (UI.vehicleMarker) {
                console.log("Updating vehicle marker position");
                UI.vehicleMarker.setLatLng([latitude, longitude]);
            } else {
                console.log("Adding new vehicle marker");
                UI.vehicleMarker = L.marker([latitude, longitude]).addTo(UI.map);
            }

            UI.elements.speedBox.innerHTML = `Speed: ${speed} km/h`;
            UI.map.setView([latitude, longitude], CONFIG.MAP_ZOOM);
        } else {
            console.error('No position found for the selected device:', positions);
        }
    } catch (error) {
        console.error('Position fetching error:', error);
    }
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMap);