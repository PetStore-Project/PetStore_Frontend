import axios from 'axios';

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: 'https://petstore-backend-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attaches the token to every request
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    // Check for token in alternative storage locations
    if (!token) {
        try {
            const userStr = localStorage.getItem('user');
            const userInfoStr = localStorage.getItem('userInfo');

            if (userStr) {
                 const parsed = JSON.parse(userStr);
                 if (parsed && parsed.token) token = parsed.token;
            } else if (userInfoStr) {
                 const parsed = JSON.parse(userInfoStr);
                 if (parsed && parsed.token) token = parsed.token;
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (session expiry)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or invalid token. Logging out...");

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Force redirect to login page
      if (window.location.pathname !== '/login') {
          window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
