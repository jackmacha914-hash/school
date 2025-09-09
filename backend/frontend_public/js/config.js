// API Configuration - Works for local development and Render production
const API_CONFIG = (() => {
    // Check if running in production or development
    const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);

    const baseConfig = {
        PRODUCTION: {
            BASE_URL: 'https://school-93dy.onrender.com',
            API_BASE_URL: 'https://school-93dy.onrender.com/api'
        },
        DEVELOPMENT: {
            BASE_URL: 'http://localhost:5000',
            API_BASE_URL: 'http://localhost:5000/api'
        }
    };

    const envConfig = isProduction ? baseConfig.PRODUCTION : baseConfig.DEVELOPMENT;

    return {
        ...envConfig,
        AUTH_URL: `${envConfig.API_BASE_URL}/auth`,
        PAYMENTS_URL: `${envConfig.API_BASE_URL}/payments`,
        CLASSES_URL: `${envConfig.API_BASE_URL}/classes`,
        CLUBS_URL: `${envConfig.API_BASE_URL}/clubs`,
        BOOKS_URL: `${envConfig.API_BASE_URL}/books`,
        EVENTS_URL: `${envConfig.API_BASE_URL}/events`,
        BACKUP_URL: `${envConfig.API_BASE_URL}/backups`,
        isProduction
    };
})();

// Make global
window.API_CONFIG = API_CONFIG;

// Helper function for resource URLs (profile photos, report cards, other uploads)
function getResourceUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    const cleanPath = path.replace(/^\/|^uploads\//, '');
    if (path.includes('profile-photos/')) {
        return `${API_CONFIG.BASE_URL}/uploads/profile-photos/${cleanPath}`;
    } else if (path.includes('report-cards/')) {
        return `${API_CONFIG.BASE_URL}/report-cards/${cleanPath}`;
    }
    return `${API_CONFIG.BASE_URL}/uploads/${cleanPath}`;
}

window.getResourceUrl = getResourceUrl;

// API fetch wrapper with authentication and error handling
async function apiFetch(endpoint, options = {}) {
    const isAuthEndpoint = endpoint.includes('/auth/');
    const token = isAuthEndpoint ? null : localStorage.getItem('token');

    const url = endpoint.startsWith('http')
        ? endpoint
        : `${endpoint.startsWith('/') ? '' : '/'}${endpoint}`.replace(/^\/api/, API_CONFIG.API_BASE_URL);

    const headers = new Headers({
        'Accept': 'application/json',
        ...(options.body && !(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {})
    });

    const config = { ...options, headers, credentials: 'include', mode: 'cors' };

    if (!API_CONFIG.isProduction) {
        console.log(`[API] ${config.method || 'GET'} ${url}`, { options });
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); } catch { errorData = await response.text(); }
            const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        if (response.status === 204) return null;

        const contentType = response.headers.get('content-type');
        return contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();

    } catch (error) {
        console.error('API request failed:', { endpoint, error: error.message, status: error.status, data: error.data });
        if (error.status === 401) window.location.href = '/pages/login.html';
        throw error;
    }
}

window.apiFetch = apiFetch;
