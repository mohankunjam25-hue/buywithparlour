import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://buywithparlour-3.onrender.com/api';

export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure default axios as well for direct calls
axios.defaults.baseURL = BASE_API_URL;
axios.defaults.withCredentials = true;

export default api;
