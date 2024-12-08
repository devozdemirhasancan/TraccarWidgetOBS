const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    log: function(message, data) {
        if (this.isDevelopment) {
            console.log(message, data);
        }
    },
    
    error: function(message, error) {
        if (this.isDevelopment) {
            console.error(message, error);
        }
    }
};

export default ENV; 