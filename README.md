# Traccar OBS Widget with NODE

Real-time vehicle tracking system with an interactive map interface. This project provides a game-like overlay displaying vehicle location, speed, weather, and street information.

## Features

- Real-time vehicle tracking
- Dynamic map rotation based on vehicle direction
- Weather information updates every 30 minutes
- Street name display
- Speed indicator with visual effects
- Compass showing vehicle direction
- Dark theme map
- Responsive 600x400 overlay design

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Traccar Server API access

## Installation

1. Clone the repository: 
git clone [repository-url]
cd TraccarWidgetOBS


2. Install dependencies:
npm install

3. Create a `.env` file in the root directory with the following content:

TRACCAR_API_URL=your_traccar_api_url
TRACCAR_TOKEN=your_traccar_token
TRACCAR_DEVICE_ID=your_device_id
PORT=3000

4. Start the development server:
npm run dev

## Configuration

The application uses several configuration parameters that can be modified:

- `UPDATE_INTERVAL`: Position update interval (1000ms default)
- `WEATHER_CACHE_TIME`: Weather data cache duration (30 minutes default)
- `HIGH_SPEED_THRESHOLD`: Speed threshold for visual effects (60 km/h default)
- `MAP_ZOOM`: Map zoom level (300 default)
- `ANIMATION_DURATION`: Animation duration for transitions (0.3s default)


## API Integration

The application integrates with:
- Traccar API for vehicle tracking
- wttr.in API for weather information
- OpenStreetMap for map tiles

## Environment Variables

- `TRACCAR_API_URL`: Base URL for Traccar API
- `TRACCAR_TOKEN`: Authentication token for Traccar API
- `TRACCAR_DEVICE_ID`: ID of the tracked device
- `PORT`: Server port (default: 3000)

## Development

For development, the project uses:
- Express.js for the server
- Leaflet.js for map rendering
- dotenv for environment variables
- nodemon for development auto-reload

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Traccar for vehicle tracking platform
- OpenStreetMap contributors
- wttr.in for weather data
- Leaflet.js team

## Support

For support, email devozdemirhasancan@gmail.com or create an issue in the repository.