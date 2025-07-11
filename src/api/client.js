import axios from 'axios';

const API_BASE_URL = 'https://iot-building-simulator-1.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60000ms (60 seconds) to handle slow API responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth header if needed (for now just logging)
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;