// middleware/cors.js
const { allowedOrigins } = require('../config/cors');

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');

  // If request has an Origin, check if it's allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,X-Requested-With,Cache-Control'
    );
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
    res.setHeader('Access-Control-Max-Age', '86400'); // cache preflight

    console.log(`[CORS ALLOWED] ${req.method} ${req.originalUrl} <- ${origin}`);

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204); // preflight success
    }
  } else if (origin) {
    // Origin present but not allowed
    console.warn(`[CORS BLOCKED] ${req.method} ${req.originalUrl} <- ${origin}`);
    return res.status(403).json({ message: 'Not allowed by CORS' });
  } else {
    // Requests without Origin (like favicon or same-site assets)
    console.log(`[NO ORIGIN] ${req.method} ${req.originalUrl}`);
  }

  next();
}

module.exports = corsMiddleware;
