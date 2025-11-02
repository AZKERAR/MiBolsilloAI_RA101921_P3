import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api';
import { useAppStore } from '@/store';
import { handleApiError } from '@/utils/error-handler';
import { QUERY_KEYS } from '@/config/constants';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types';

/**
 * Hook para categorías
 */
export const useCategories = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useAppStore();

  // Listar categorías
  const categoriesQuery = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: async () => {
      console.log('🔍 [useCategories] Fetching categories...');
      const result = await categoriesApi.list();
      console.log('✅ [useCategories] Categories received:', JSON.stringify(result, null, 2));
      console.log('📊 [useCategories] Total categories:', result?.length || 0);
      return result;
    },
  });

  // Crear categoría
  const createMutation = useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      console.log('➕ [useCategories] Creating category:', data);
      const result = await categoriesApi.create(data);
      console.log('✅ [useCategories] Category created:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      showSnackbar('Categoría creada exitosamente', 'success');
    },
    onError: (error) => {
      console.error('❌ [useCategories] Create error:', error);
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Actualizar categoría
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      showSnackbar('Categoría actualizada', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Eliminar categoría
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      showSnackbar('Categoría eliminada', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  return {
    // Queries
    categories: categoriesQuery.data ?? [],
    isLoadingCategories: categoriesQuery.isLoading,
    isErrorCategories: categoriesQuery.isError,
    refetchCategories: categoriesQuery.refetch,

    // Mutations
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
