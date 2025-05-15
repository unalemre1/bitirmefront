import axios, { AxiosError } from 'axios';
import config from './env';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
  // Add withCredentials for CORS requests if needed
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        config: error.config
      });
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection and try again.'));
    }
    
    // Handle 422 errors specifically
    if (error.response?.status === 422) {
      console.error('Validation Error:', error.response.data);
      const message = error.response.data.detail?.[0]?.msg || 'Form validation failed';
      return Promise.reject(new Error(message));
    }
    
    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;