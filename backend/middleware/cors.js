// middleware/cors.js
const { allowedOrigins } = require('../config/cors');

const corsMiddleware = (req, res, next) => {
  let origin = req.headers.origin || null;

  // Always prevent caching of CORS decisions
  res.setHeader('Vary', 'Origin');

  // Normalize origin if present
  if (origin) {
    origin = origin.replace(/\/$/, '');
  }

  // Check if origin is in allowed list
  const isAllowed = origin
    ? allowedOrigins.some(o => {
        if (typeof o === 'string') return o.replace(/\/$/, '') === origin;
        if (o instanceof RegExp) return o.test(origin);
        return false;
      })
    : false;

  if (isAllowed) {
    // ✅ Allow request
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,x-auth-token,X-Requested-With,Cache-Control'
    );
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
    res.setHeader('Access-Control-Max-Age', '86400'); // cache preflight for 24h

    console.log(`[CORS ALLOWED] ${req.method} ${req.originalUrl} <- ${origin}`);

    // Short-circuit preflight
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
  } else if (origin) {
    // ❌ Block only if Origin exists and is not allowed
    console.warn(`[CORS BLOCKED] ${req.method} ${req.originalUrl} <- ${origin}`);
    return res.status(403).json({ message: 'Not allowed by CORS' });
  } else {
    // No Origin header (same-site request, favicon, assets, etc.)
    console.log(`[NO ORIGIN] ${req.method} ${req.originalUrl}`);
  }

  next();
};

module.exports = corsMiddleware;
