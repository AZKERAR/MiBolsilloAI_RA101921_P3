import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuración de TanStack Query (React Query)
 * 
 * Features:
 * - Cache automático
 * - Refetch on window focus
 * - Retry en caso de error
 * - Persistencia offline (Nivel 2)
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "fresh" (no refetch automático)
      staleTime: 1000 * 60 * 5, // 5 minutos
      
      // Tiempo que los datos se mantienen en caché
      gcTime: 1000 * 60 * 60 * 24, // 24 horas (antes era cacheTime)
      
      // Refetch al enfocar ventana/app
      refetchOnWindowFocus: false,
      
      // Refetch al reconectar
      refetchOnReconnect: true,
      
      // Retry en caso de error
      retry: 1,
      
      // Mostrar datos cacheados mientras refetch en background
      refetchOnMount: 'always',
    },
    mutations: {
      // Retry en caso de error
      retry: 0,
    },
  },
});

/**
 * Persister para AsyncStorage
 * Permite mantener el cache offline (Nivel 2)
 */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
  throttleTime: 1000,
});

/**
 * Helper para invalidar queries específicas
 */
export const invalidateQueries = (queryKey: any[]) => {
  return queryClient.invalidateQueries({ queryKey });
};

/**
 * Helper para refetch queries específicas
 */
export const refetchQueries = (queryKey: any[]) => {
  return queryClient.refetchQueries({ queryKey });
};

/**
 * Helper para limpiar todo el cache
 */
export const clearCache = () => {
  return queryClient.clear();
};
