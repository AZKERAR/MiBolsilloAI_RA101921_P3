import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types';

/**
 * Helper para manejar errores de API y convertirlos a mensajes user-friendly
 */
export const handleApiError = (error: any): string => {
  // Error de Axios con respuesta del servidor
  if (error.response) {
    const data = error.response.data as ErrorResponse;
    
    // Error de validación con issues detallados
    if (data.issues && data.issues.length > 0) {
      const issueMessages = data.issues
        .map(issue => {
          const field = issue.path || 'Campo';
          return `${field}: ${issue.message}`;
        })
        .join('\n');
      
      return issueMessages;
    }
    
    // Error con mensaje del backend
    if (data.message) {
      return data.message;
    }
    
    // Error HTTP sin mensaje específico
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Solicitud inválida. Verifica los datos ingresados.';
      case 401:
        return 'No autorizado. Por favor inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'Conflicto con el estado actual del recurso.';
      case 422:
        return 'Datos no procesables. Verifica la información.';
      case 429:
        return 'Demasiadas solicitudes. Intenta de nuevo más tarde.';
      case 500:
        return 'Error del servidor. Intenta de nuevo más tarde.';
      case 503:
        return 'Servicio no disponible. Intenta de nuevo más tarde.';
      default:
        return `Error del servidor (${status}). Intenta de nuevo.`;
    }
  }
  
  // Error de red (sin conexión a internet)
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return 'Sin conexión a internet. Verifica tu conexión.';
  }
  
  // Timeout
  if (error.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Verifica tu conexión.';
  }
  
  // Error de request cancelado
  if (error.message && error.message.includes('cancel')) {
    return 'Solicitud cancelada.';
  }
  
  // Error desconocido
  if (error.message) {
    return error.message;
  }
  
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
};

/**
 * Determina si el error es de autenticación (401)
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

/**
 * Determina si el error es de validación (400 con issues)
 */
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 400 && error.response?.data?.issues;
};

/**
 * Determina si el error es de red (sin conexión)
 */
export const isNetworkError = (error: any): boolean => {
  return error.message === 'Network Error' || error.code === 'ERR_NETWORK';
};

/**
 * Extrae los issues de un error de validación
 */
export const getValidationIssues = (error: any): ErrorResponse['issues'] => {
  if (isValidationError(error)) {
    return error.response.data.issues;
  }
  return undefined;
};

/**
 * Formatea múltiples errores de validación en un solo string
 */
export const formatValidationErrors = (issues?: ErrorResponse['issues']): string => {
  if (!issues || issues.length === 0) {
    return 'Error de validación.';
  }
  
  return issues
    .map(issue => `• ${issue.path}: ${issue.message}`)
    .join('\n');
};
