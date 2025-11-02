import { apiClient } from '@/lib/axios-client';
import { endpoints } from '../endpoints';
import type {
  ListTransactionsQuery,
  ListTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} from '@/types';

/**
 * Servicio de API para transacciones
 */
export const transactionsApi = {
  /**
   * GET /finance/transactions
   * Lista transacciones con filtros y paginación
   */
  list: async (query?: ListTransactionsQuery): Promise<ListTransactionsResponse> => {
    const response = await apiClient.get<ListTransactionsResponse>(
      endpoints.transactions.list,
      { params: query }
    );
    return response.data;
  },

  /**
   * POST /finance/transactions
   * Crea una nueva transacción
   */
  create: async (data: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
    const response = await apiClient.post<CreateTransactionResponse>(
      endpoints.transactions.create,
      data
    );
    return response.data;
  },

  /**
   * PATCH /finance/transactions/:id
   * Actualiza una transacción
   */
  update: async (
    id: string,
    data: UpdateTransactionRequest
  ): Promise<UpdateTransactionResponse> => {
    const response = await apiClient.patch<UpdateTransactionResponse>(
      endpoints.transactions.update(id),
      data
    );
    return response.data;
  },

  /**
   * DELETE /finance/transactions/:id
   * Elimina una transacción
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.transactions.delete(id));
  },
};
