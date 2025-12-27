import axios from 'axios';

const apiClient = axios.create({
  // This picks up the URL from your .env file
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;