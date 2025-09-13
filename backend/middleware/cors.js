// middleware/cors.js
const { allowedOrigins } = require('../config/cors');

const corsMiddleware = (req, res, next) => {
  let origin = req.headers.origin;

  // Always set Vary to avoid caching issues
  res.setHeader('Vary', 'Origin');

  if (origin) origin = origin.replace(/\/$/, ''); // normalize origin

  // Check if origin is allowed
  const isAllowed = allowedOrigins.some(o => {
    if (typeof o === 'string') return o.replace(/\/$/, '') === origin;
    if (o instanceof RegExp) return o.test(origin);
    return false;
  });

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,x-auth-token,X-Requested-With,Cache-Control'
    );
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
    res.setHeader('Access-Control-Max-Age', '86400'); // cache preflight 24 hours

    console.log(`[CORS ALLOWED] ${req.method} ${req.originalUrl} <- ${origin}`);

    if (req.method === 'OPTIONS') return res.sendStatus(204);
  } else if (origin) {
    console.warn(`[CORS BLOCKED] ${req.method} ${req.originalUrl} <- ${origin}`);
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  next();
};

module.exports = corsMiddleware;
