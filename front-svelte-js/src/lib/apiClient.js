// src/lib/apiClient.js
import axios from 'axios';
import { authStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'https://mockwebapi.bsospace.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update Authorization header when token changes
authStore.subscribe((store) => {
  if (store.token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${store.token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
});

export default apiClient;