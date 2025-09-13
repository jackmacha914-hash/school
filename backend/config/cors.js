const allowedOrigins = [
  // Development
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  // Production
  'https://school-93dy.onrender.com',
  'https://school-management-system-av07.onrender.com',
];

module.exports = { allowedOrigins };
