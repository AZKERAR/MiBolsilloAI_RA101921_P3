import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api';
import { useAppStore } from '@/store';
import { handleApiError } from '@/utils/error-handler';
import { QUERY_KEYS } from '@/config/constants';
import { useCategories } from '@/hooks/useCategories';
import type {
  ListTransactionsQuery,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '@/types';

/**
 * Hook para transacciones
 */
export const useTransactions = (query?: ListTransactionsQuery) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useAppStore();

  // Obtener categorías (fallback client-side mapping si backend no las incluye)
  const { categories } = useCategories();

  // Listar transacciones con filtros
  const transactionsQuery = useQuery({
    queryKey: [...QUERY_KEYS.transactions, query],
    queryFn: async () => {
      console.log('🔍 [useTransactions] Fetching transactions with params:', JSON.stringify(query, null, 2));
      const result = await transactionsApi.list(query);
      console.log('✅ [useTransactions] Transactions received:', JSON.stringify(result, null, 2));
      console.log('📊 [useTransactions] Total transactions:', result?.items?.length || 0);

      // Si backend no devuelve el objeto category, intentamos mapearlo desde las categorías ya cargadas
      if (result?.items && result.items.length > 0) {
        let mappedCount = 0;
        result.items = result.items.map((tx: any) => {
          if (!tx.category && tx.categoryId) {
            const found = categories.find((c: any) => c.id === tx.categoryId);
            if (found) {
              mappedCount++;
              return { ...tx, category: found };
            }
          }
          return tx;
        });

        console.log(`🛠️ [useTransactions] Mapped ${mappedCount} transactions' category from client categories`);

        // Log específico para categorías
        result.items.forEach((tx: any, index: number) => {
          console.log(`📝 Transaction ${index + 1}:`, {
            note: tx.note,
            categoryId: tx.categoryId,
            category: tx.category,
            hasCategoryObject: !!tx.category,
            categoryName: tx.category?.name || 'NO CATEGORY OBJECT'
          });
        });
      }

      return result;
    },
  });

  // Crear transacción
  const createMutation = useMutation({
    mutationFn: async (data: CreateTransactionRequest) => {
      console.log('➕ [useTransactions] Creating transaction:', JSON.stringify(data, null, 2));
      const result = await transactionsApi.create(data);
      console.log('✅ [useTransactions] Transaction created:', JSON.stringify(result, null, 2));
      console.log('📝 Category in response:', result.category ? result.category : 'NO CATEGORY OBJECT');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
      showSnackbar('Transacción creada exitosamente', 'success');
    },
    onError: (error) => {
      console.error('❌ [useTransactions] Create error:', error);
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Actualizar transacción
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
      showSnackbar('Transacción actualizada', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Eliminar transacción
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
      showSnackbar('Transacción eliminada', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  return {
    // Queries
    transactions: transactionsQuery.data?.items ?? [],
    pagination: {
      page: transactionsQuery.data?.page ?? 1,
      pageSize: transactionsQuery.data?.pageSize ?? 20,
      total: transactionsQuery.data?.total ?? 0,
    },
    isLoadingTransactions: transactionsQuery.isLoading,
    isErrorTransactions: transactionsQuery.isError,
    refetchTransactions: transactionsQuery.refetch,

    // Mutations
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
