// List of allowed origins for CORS
const allowedOrigins = [
    // Development
    /^http:\/\/localhost(:\d+)?$/,  // All localhost ports
    /^http:\/\/127\.0\.0\.1(:\d+)?$/,  // All 127.0.0.1 ports
    
    // Production
    'https://school-management-system-av07.onrender.com',
    'http://school-management-system-av07.onrender.com',
    
    // Add any other production domains here
];

module.exports = {
    allowedOrigins
};
