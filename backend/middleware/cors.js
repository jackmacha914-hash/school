const { allowedOrigins } = require('../config/cors');

const corsMiddleware = (req, res, next) => {
  let origin = req.headers.origin;

  // Always set Vary to avoid caching
  res.header('Vary', 'Origin');

  if (origin) origin = origin.replace(/\/$/, ''); // normalize

  // Check if origin matches allowed origins
  const isAllowed = allowedOrigins.some(o => {
    if (typeof o === 'string') return o.replace(/\/$/, '') === origin;
    if (o instanceof RegExp) return o.test(origin);
    return false;
  });

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin); // echo origin
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,x-auth-token,X-Requested-With,Cache-Control'
    );
    res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
  } else if (origin) {
    console.warn('CORS blocked:', origin);
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  // Handle preflight
  if (req.method === 'OPTIONS') return res.sendStatus(204);

  next();
};

module.exports = corsMiddleware;
