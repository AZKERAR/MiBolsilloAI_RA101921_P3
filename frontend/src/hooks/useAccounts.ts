import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/api';
import { useAppStore } from '@/store';
import { handleApiError } from '@/utils/error-handler';
import { QUERY_KEYS } from '@/config/constants';
import type {
  InitializeAccountRequest,
  CreateAccountRequest,
  UpdateAccountRequest,
  GetAccountBalanceQuery,
} from '@/types';

/**
 * Hook para cuentas financieras
 */
export const useAccounts = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useAppStore();

  // Listar cuentas
  const accountsQuery = useQuery({
    queryKey: QUERY_KEYS.accounts,
    queryFn: accountsApi.list,
  });

  // Inicializar cuenta (primer ingreso)
  const initializeMutation = useMutation({
    mutationFn: (data: InitializeAccountRequest) => accountsApi.initialize(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      showSnackbar('Cuenta creada exitosamente', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Crear cuenta adicional
  const createMutation = useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      showSnackbar('Cuenta creada exitosamente', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Actualizar cuenta
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      showSnackbar('Cuenta actualizada', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Eliminar cuenta
  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      showSnackbar('Cuenta eliminada', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  return {
    // Queries
    accounts: accountsQuery.data ?? [],
    isLoadingAccounts: accountsQuery.isLoading,
    isErrorAccounts: accountsQuery.isError,
    refetchAccounts: accountsQuery.refetch,

    // Mutations
    initializeAccount: initializeMutation.mutate,
    createAccount: createMutation.mutate,
    updateAccount: updateMutation.mutate,
    deleteAccount: deleteMutation.mutate,

    // Loading states
    isInitializing: initializeMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

/**
 * Hook para obtener balance de una cuenta específica
 */
export const useAccountBalance = (accountId: string, query?: GetAccountBalanceQuery) => {
  return useQuery({
    queryKey: QUERY_KEYS.accountBalance(accountId),
    queryFn: () => accountsApi.getBalance(accountId, query),
    enabled: !!accountId,
  });
};
