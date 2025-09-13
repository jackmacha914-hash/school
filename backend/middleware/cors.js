
// backend/middleware/cors.js
const { allowedOrigins } = require('../config/cors');

module.exports = (req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization'
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
  } else if (origin) {
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  next();
};

