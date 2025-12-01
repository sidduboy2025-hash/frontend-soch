import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:1000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100000, // 100 seconds timeout
});

// Request interceptor to add auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available in cookies
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      Cookies.remove('authToken');
      Cookies.remove('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;