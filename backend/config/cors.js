// config/cors.js

/**
 * List of allowed origins for CORS.
 * Supports regex (for localhost/127.0.0.1) and exact strings (for production domains).
 */
const allowedOrigins = [
  // Development: allow any localhost port
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,

  // Production: exact frontend and backend domains
  'https://school-93dy.onrender.com',
  'https://school-management-system-av07.onrender.com'
];

module.exports = { allowedOrigins };
