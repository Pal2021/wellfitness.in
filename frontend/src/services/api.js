import axios from 'axios';

/**
 * Pre-configured Axios instance for communicating with the Spring Boot backend.
 *
 * - Base URL: http://localhost:8080/api
 * - Automatically attaches JWT bearer tokens from localStorage
 * - Handles 401 (redirect to login), 403 (log warning), and network errors
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ──────────────────────────────────────────────
// REQUEST interceptor — attach JWT if available
// ──────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ──────────────────────────────────────────────
// RESPONSE interceptor — handle auth & network errors
// ──────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      const networkError = new Error(
        'Network error — please check your connection and try again.',
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    const { status } = error.response;

    // 401 Unauthorized — token expired or invalid
    if (status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 403 Forbidden — insufficient permissions
    if (status === 403) {
      console.warn('[API] Forbidden — you do not have permission to access this resource.');
    }

    return Promise.reject(error);
  },
);

export default api;
