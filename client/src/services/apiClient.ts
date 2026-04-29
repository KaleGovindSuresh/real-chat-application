// src/services/apiClient.ts
import axios from 'axios';
import { store } from '../app/store';
import { getApiBaseUrl } from '../config/runtime';

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// Attach JWT on every request
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Log 401s (future: dispatch logout)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('[API] 401 Unauthorized — token may have expired');
    }
    return Promise.reject(err);
  },
);

export default apiClient;
