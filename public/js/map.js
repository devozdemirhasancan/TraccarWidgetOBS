// Sabitler
const CONFIG = {
    UPDATE_INTERVAL: 1000,      // Güncelleme aralığı (ms)
    WEATHER_CACHE_TIME: 1800000, // Hava durumu cache süresi (30 dk)
    HIGH_SPEED_THRESHOLD: 60,    // Yüksek hız efekti için eşik (km/sa)
    MAP_ZOOM: 300,              // Harita zoom seviyesi
    ANIMATION_DURATION: 0.3      // Animasyon süresi (sn)
};

// Global config değişkeni
let TRACCAR_CONFIG = null;

// Config yükleme fonksiyonu
async function loadConfig() {
    try {
        const response = await fetch('/config');
        if (!response.ok) throw new Error('Config yüklenemedi');
        TRACCAR_CONFIG = await response.json();
    } catch (error) {
        console.error('Config yükleme hatası:', error);
    }
}

// UI Elementleri
const UI = {
    map: null,
    mapContainer: null,
    vehicleMarker: null,
    elements: {
        speedBox: createUIElement('div', 'speed-box'),
        compass: createUIElement('div', 'compass'),
        streetName: createUIElement('div', 'street-name'),
        weatherBox: createUIElement('div', 'weather-box'),
        speedEffect: createUIElement('div', 'speed-effect', true)
    }
};

// Cache
const Cache = {
    weather: null,
    weatherLastUpdate: 0,
    lastPosition: null,
    lastUpdateTime: 0
};

// UI Element oluşturucu
function createUIElement(type, id, isClass = false) {
    const element = document.createElement(type);
    isClass ? element.className = id : element.id = id;
    document.body.appendChild(element);
    return element;
}

// Harita başlatma
function initializeMap() {
    UI.map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([0, 0], 17);

    UI.mapContainer = createUIElement('div', 'map-rotate-container');
    document.getElementById('map').appendChild(UI.mapContainer);
    document.getElementById('map').classList.add('dark-theme');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(UI.map);
}

// Hava durumu işlemleri
const WeatherService = {
    async get(latitude, longitude) {
        const now = Date.now();
        if (this.isCacheValid(now)) return Cache.weather;

        try {
            const response = await fetch(`https://wttr.in/(${latitude}),(${longitude})?format=j1`);
            const data = await response.json();
            return this.processWeatherData(data, now);
        } catch (error) {
            console.error('Hava durumu alınamadı:', error);
            return this.getDefaultWeather();
        }
    },

    isCacheValid(now) {
        return Cache.weather && (now - Cache.weatherLastUpdate < CONFIG.WEATHER_CACHE_TIME);
    },

    processWeatherData(data, now) {
        const currentHour = new Date().getHours();
        const forecast = data.weather[0].hourly.find(h => parseInt(h.time) / 100 === currentHour) 
                        || data.current_condition[0];

        Cache.weather = {
            temp: forecast.temp_C,
            icon: this.getIcon(forecast.weatherCode)
        };
        Cache.weatherLastUpdate = now;
        return Cache.weather;
    },

    getDefaultWeather() {
        return { temp: '22', icon: '☀️' };
    },

    getIcon(code) {
        const icons = {
            '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️',
            '176': '🌦️', '200': '⛈️', '266': '🌧️', '293': '🌧️',
            '296': '🌧️', '299': '🌧️', '302': '🌧️', '311': '🌧️',
            '314': '🌧️', '317': '🌧️', '320': '🌨️', '323': '🌨️',
            '326': '🌨️', '329': '🌨️', '332': '🌨️', '338': '🌨️',
            '350': '🌧️', '353': '🌦️', '356': '🌧️', '359': '🌧️',
            '362': '🌧️', '365': '🌧️', '368': '🌨️', '371': '🌨️',
            '374': '🌧️', '377': '🌧️', '386': '⛈️', '389': '⛈️',
            '392': '⛈️', '395': '⛈️'
        };
        return icons[code] || '🌡️';
    }
};

// Marker güncelleme
async function updateMarker(position) {
    const { latitude, longitude, speed, course, address } = position;
    Cache.lastPosition = position;

    // Hava durumu güncelleme
    if (!WeatherService.isCacheValid(Date.now())) {
        const weather = await WeatherService.get(latitude, longitude);
        UI.elements.weatherBox.innerHTML = `
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${weather.temp}°C</div>
        `;
    }

    // Sokak adı güncelleme
    UI.elements.streetName.textContent = address || 'Bilinmeyen Konum';

    // Hız göstergesi güncelleme
    const speedKmh = Math.round(speed * 1.852);
    UI.elements.speedBox.innerHTML = `
        <div class="speed-value">${speedKmh}</div>
        <div class="speed-unit">km/sa</div>
    `;

    // Harita güncellemeleri
    requestAnimationFrame(() => {
        updateMapView(latitude, longitude, course, speedKmh);
    });
}

// Harita görünümü güncelleme
function updateMapView(latitude, longitude, course, speed) {
    UI.map.setView([latitude, longitude], CONFIG.MAP_ZOOM, {
        animate: true,
        duration: CONFIG.ANIMATION_DURATION
    });

    if (UI.vehicleMarker) {
        UI.map.removeLayer(UI.vehicleMarker);
    }

    UI.vehicleMarker = L.marker([latitude, longitude], {
        icon: createVehicleIcon()
    }).addTo(UI.map);

    UI.mapContainer.style.transform = `translate(-50%, -50%) rotate(${-course}deg)`;
    UI.elements.compass.style.transform = `rotate(${course}deg)`;
    UI.elements.speedEffect.classList.toggle('active', speed > CONFIG.HIGH_SPEED_THRESHOLD);
}

// Araç ikonu oluşturma
function createVehicleIcon() {
    return L.divIcon({
        className: 'vehicle-icon',
        html: `
            <div style="
                width: 60px; 
                height: 60px; 
                background: url('/images/car.svg') no-repeat center;
                background-size: contain;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
            "></div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });
}

// Konum polling
function startPolling() {
    setInterval(async () => {
        if (Date.now() - Cache.lastUpdateTime < CONFIG.UPDATE_INTERVAL) return;

        try {
            const positions = await fetchPositions();
            const lastPosition = positions.find(pos => 
                pos.deviceId === parseInt(TRACCAR_CONFIG.TRACCAR_DEVICE_ID)
            );

            if (shouldUpdatePosition(lastPosition)) {
                Cache.lastUpdateTime = Date.now();
                await updateMarker(lastPosition);
            }
        } catch (error) {
            console.error('Polling hatası:', error);
        }
    }, CONFIG.UPDATE_INTERVAL);
}

// Pozisyon verisi çekme
async function fetchPositions() {
    const response = await fetch(`${TRACCAR_CONFIG.TRACCAR_API_URL}/positions`, {
        headers: {
            'Authorization': `Bearer ${TRACCAR_CONFIG.TRACCAR_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Konum verisi çekilemedi');
    return response.json();
}

// Pozisyon güncelleme kontrolü
function shouldUpdatePosition(newPosition) {
    if (!newPosition) return false;
    if (!Cache.lastPosition) return true;

    return newPosition.latitude !== Cache.lastPosition.latitude ||
           newPosition.longitude !== Cache.lastPosition.longitude ||
           newPosition.course !== Cache.lastPosition.course;
}

// Uygulama başlatma
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig(); // Config'i yükle
    if (!TRACCAR_CONFIG) {
        console.error('Config yüklenemedi, uygulama başlatılamıyor');
        return;
    }
    
    initializeMap();
    fetchPositions()
        .then(positions => {
            const lastPosition = positions.find(pos => 
                pos.deviceId === parseInt(TRACCAR_CONFIG.TRACCAR_DEVICE_ID)
            );
            if (lastPosition) updateMarker(lastPosition);
        })
        .catch(error => console.error('Başlangıç yüklemesi hatası:', error));
    startPolling();
}); 