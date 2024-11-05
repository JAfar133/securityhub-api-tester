// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const instance = axios.create({
    baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
};

export default instance;
