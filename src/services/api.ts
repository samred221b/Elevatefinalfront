import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '../lib/firebase';

// API Configuration
// Priority: .env file -> localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.VITE_ENV || 'development');

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the current user from Firebase
      const user = auth.currentUser;
      
      if (user) {
        // Get the ID token
        const token = await user.getIdToken();
        
        // Add the token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Added Firebase token to request:', config.url);
      } else {
        console.warn('⚠️ No Firebase user found for request:', config.url);
      }
    } catch (error) {
      console.error('❌ Error getting Firebase token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Simple error logging - no auth redirects with Firebase
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  errors?: any[];
}

// Generic API methods
export const apiRequest = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.delete(url, config);
    return response.data;
  },
};

export default api;
