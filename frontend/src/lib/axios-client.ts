import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_URL, API_TIMEOUT, IS_DEV } from '@/config/env';
import { getToken } from './storage';
import { handleApiError, isAuthError } from '@/utils/error-handler';

/**
 * Cliente Axios configurado con interceptores para:
 * - Agregar token de autenticación automáticamente
 * - Logging en desarrollo
 * - Manejo global de errores
 */

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================================
// REQUEST INTERCEPTOR
// ===================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Agregar token de autenticación si existe
    const token = await getToken();
    
    console.log('🔧 [Axios] Request interceptor:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'none',
    });
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Logging en desarrollo
    if (IS_DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    if (IS_DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// ===================================
// RESPONSE INTERCEPTOR
// ===================================

apiClient.interceptors.response.use(
  (response) => {
    // Logging en desarrollo
    if (IS_DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Logging en desarrollo
    if (IS_DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    
    // Si es error 401 (no autorizado), se podría limpiar el token
    // y redirigir al login (esto se maneja mejor en los hooks/store)
    if (isAuthError(error)) {
      // Emitir evento o limpiar estado (implementar según necesidad)
      if (IS_DEV) {
        console.warn('⚠️ Auth error detected - token might be invalid');
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper para hacer requests con manejo de errores simplificado
 */
export const makeRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};
