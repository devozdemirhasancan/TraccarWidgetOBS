describe('Map functionality', () => {
  test('should create UI elements', () => {
    document.body.innerHTML = `
      <div id="map"></div>
      <div id="error-log"></div>
    `;

    const createUIElement = require('../public/js/map').createUIElement;
    
    const element = createUIElement('div', 'test-element');
    
    expect(element).toBeTruthy();
    expect(element.id).toBe('test-element');
    expect(document.getElementById('test-element')).toBeTruthy();
  });
}); 