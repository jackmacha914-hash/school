// config/cors.js

// ✅ Allowed origins (no regex, exact strings)
const allowedOrigins = [
  // Development
  'http://localhost:3000',
  'http://127.0.0.1:3000',

  // Production
  'https://school-93dy.onrender.com',
  'https://school-management-system-av07.onrender.com'
];

module.exports = { allowedOrigins };
