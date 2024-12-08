const services = {
    WeatherService: require('./weatherService'),
    TraccarService: require('./traccarService'),
    // Add more services here as needed
};

const getService = (serviceName) => {
    return services[serviceName];
};

module.exports = {
    getService,
};