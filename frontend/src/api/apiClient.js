import axios from 'axios';

const apiClient = axios.create({
  // This picks up the URL from your .env file
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;