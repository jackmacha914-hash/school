// apiFetch.js
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_CONFIG.API_BASE_URL}${endpoint}`;

    const headers = {
        'Accept': 'application/json',
        ...(options.body && !(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const config = { ...options, headers, credentials: 'include', mode: 'cors' };

    const response = await fetch(url, config);

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login.html';
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return response.status === 204 ? null : await response.json();
}

window.apiFetch = apiFetch;
// 🟢 Intercept all fetch calls (even hardcoded ones)
const originalFetch = window.fetch;
window.fetch = (input, options = {}) => {
    // If the request already starts with your domain, leave it
    if (typeof input === "string" && input.startsWith("http")) {
        // replace old hardcoded domain with the new one
        input = input.replace("https://school-management-system-av07.onrender.com", API_CONFIG.API_BASE_URL);
    } else if (typeof input === "string") {
        // prepend base URL to relative paths
        input = `${API_CONFIG.API_BASE_URL}${input}`;
    }
    return originalFetch(input, options);
};
