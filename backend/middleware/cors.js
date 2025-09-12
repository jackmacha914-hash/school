const { allowedOrigins } = require('../config/cors');

const corsMiddleware = (req, res, next) => {
  let origin = req.headers.origin;

  // Log incoming request for debugging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Origin header:', origin);

  // Always set Vary header to avoid caching issues
  res.header('Vary', 'Origin');

  // Normalize origin (remove trailing slash)
  if (origin) origin = origin.replace(/\/$/, "");

  // Check if the origin is allowed
  const isOriginAllowed = !origin || allowedOrigins.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') return allowedOrigin.replace(/\/$/, "") === origin;
    if (allowedOrigin instanceof RegExp) return allowedOrigin.test(origin);
    return false;
  });

  if (isOriginAllowed) {
    // Echo the origin if credentials are included
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-auth-token,X-Requested-With,Cache-Control');
    res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (req.method === 'OPTIONS') return res.sendStatus(204);
  } else if (origin) {
    // Block disallowed origins
    console.warn('CORS: Blocked request from origin:', origin);
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  next();
};

module.exports = corsMiddleware;
