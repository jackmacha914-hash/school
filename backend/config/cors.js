// config/cors.js

// ✅ Allowed origins (no regex, exact strings)
// backend/config/cors.js
const allowedOrigins = [
  'https://school-93dy.onrender.com',  // Render app URL
  'http://localhost:5000'              // Local dev
];

module.exports = { allowedOrigins };
