import axios from 'axios';
import { getToken } from '../services/authService';

const apiClient = axios.create({
    baseURL: 'https://mockwebapi.bsospace.com',
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;