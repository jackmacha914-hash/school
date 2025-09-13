const { allowedOrigins } = require('../config/cors');

const corsMiddleware = (req, res, next) => {
  let origin = req.headers.origin;

  // Always set Vary for caching proxies
  res.header('Vary', 'Origin');

  if (origin) origin = origin.replace(/\/$/, ''); // normalize

  // Check if origin matches allowed origins
  const isAllowed = !origin || allowedOrigins.some(o => {
    if (typeof o === 'string') return o.replace(/\/$/, '') === origin;
    if (o instanceof RegExp) return o.test(origin);
    return false;
  });

  if (isAllowed && origin) {
    // Echo exact origin for credentials
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Common CORS headers
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-auth-token,X-Requested-With,Cache-Control');
  res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Preflight requests
  if (req.method === 'OPTIONS') {
    if (!isAllowed && origin) {
      console.warn('CORS preflight blocked:', origin);
      return res.status(403).json({ message: 'Not allowed by CORS' });
    }
    return res.sendStatus(204);
  }

  if (!isAllowed && origin) {
    console.warn('CORS blocked:', origin);
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  next();
};

module.exports = corsMiddleware;
