class UIManager {
    constructor() {
        this.map = null;
        this.vehicleMarker = null;
        this.elements = {
            speedBox: this.createUIElement('div', 'speed-box'),
            compass: this.createUIElement('div', 'compass'),
            streetName: this.createUIElement('div', 'street-name'),
            weatherBox: this.createUIElement('div', 'weather-box'),
            speedEffect: this.createUIElement('div', 'speed-effect', true)
        };
    }

    createUIElement(type, id, isClass = false) {
        const element = document.createElement(type);
        isClass ? element.className = id : element.id = id;
        document.body.appendChild(element);
        return element;
    }

    updateSpeed(speed) {
        this.elements.speedBox.innerHTML = `Speed: ${Math.round((speed || 0) * 3.6)} km/h`;
    }

    updateCompass(course) {
        if (course !== undefined) {
            this.elements.compass.style.transform = `rotate(${course}deg)`;
        }
    }

    updateMarker(latitude, longitude) {
        if (this.vehicleMarker) {
            this.vehicleMarker.setLatLng([latitude, longitude]);
        } else {
            this.vehicleMarker = L.marker([latitude, longitude]).addTo(this.map);
        }
    }

    updateWeather(weather) {
        this.elements.weatherBox.innerHTML = `
            <div class="weather-icon">${weather.current_condition[0].weatherDesc[0].value}</div>
            <div class="weather-temp">${weather.current_condition[0].temp_C}°C</div>
        `;
    }
}

export default new UIManager(); 