const { 
    createUIElement, 
    WeatherService, 
    shouldUpdatePosition 
} = require('../public/js/map');

describe('Map functionality', () => {
    beforeEach(() => {
        // Setup a fresh DOM for each test
        document.body.innerHTML = `
            <div id="map"></div>
            <div id="error-log"></div>
        `;
    });

    test('should create UI elements', () => {
        const element = createUIElement('div', 'test-element');
        expect(element).toBeTruthy();
        expect(element.id).toBe('test-element');
        expect(document.getElementById('test-element')).toBeTruthy();
    });

    test('should create UI elements with class', () => {
        const element = createUIElement('div', 'test-class', true);
        expect(element).toBeTruthy();
        expect(element.className).toBe('test-class');
    });

    test('should determine if position update is needed', () => {
        const oldPosition = {
            latitude: 41.0082,
            longitude: 28.9784,
            course: 180
        };

        const newPosition = {
            latitude: 41.0082,
            longitude: 28.9784,
            course: 180
        };

        const differentPosition = {
            latitude: 41.0083,
            longitude: 28.9785,
            course: 185
        };

        expect(shouldUpdatePosition(null)).toBeFalsy();
        expect(shouldUpdatePosition(newPosition)).toBeTruthy();
        
        global.Cache = { lastPosition: oldPosition };
        expect(shouldUpdatePosition(newPosition)).toBeFalsy();
        expect(shouldUpdatePosition(differentPosition)).toBeTruthy();
    });

    test('weather service should provide default weather', () => {
        const defaultWeather = WeatherService.getDefaultWeather();
        expect(defaultWeather).toEqual({
            temp: '22',
            icon: '☀️'
        });
    });
}); 