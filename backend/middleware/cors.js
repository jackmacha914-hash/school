const { allowedOrigins } = require('../config/cors');

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;

    // Log incoming request for debugging
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Origin header:', origin);

    // Always set Vary header to avoid caching issues
    res.header('Vary', 'Origin');

    let isOriginAllowed = false;

    if (!origin) {
        // No origin (e.g., server-to-server request or same-origin)
        isOriginAllowed = true;
    } else {
        // Check if the request origin matches allowed origins
        isOriginAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return allowedOrigin === origin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
    }

    if (isOriginAllowed) {
        // For requests with credentials, must echo the exact origin
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, x-auth-token, X-Requested-With, Cache-Control'
        );
        res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
        res.header('Access-Control-Max-Age', '86400'); // 24 hours

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }
    } else if (origin) {
        // Origin is not allowed
        console.warn('CORS: Blocked request from origin:', origin);
        return res.status(403).json({ message: 'Not allowed by CORS' });
    }

    // Continue to next middleware for allowed or no-origin requests
    next();
};

module.exports = corsMiddleware;
