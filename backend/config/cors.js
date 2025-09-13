// config/cors.js
const allowedOrigins = [
  // Development
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,

  // Production: allow both with/without trailing slash, and optional www
  /^https:\/\/(www\.)?school-93dy\.onrender\.com\/?$/,
  /^https:\/\/(www\.)?school-management-system-av07\.onrender\.com\/?$/
];

module.exports = { allowedOrigins };
