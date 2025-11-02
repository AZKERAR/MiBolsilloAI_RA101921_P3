import { apiClient } from '@/lib/axios-client';
import { endpoints } from '../endpoints';
import type {
  ListAccountsResponse,
  InitializeAccountRequest,
  InitializeAccountResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
  GetAccountBalanceQuery,
  GetAccountBalanceResponse,
} from '@/types';

/**
 * Servicio de API para cuentas financieras
 */
export const accountsApi = {
  /**
   * GET /finance/accounts
   * Lista todas las cuentas del usuario
   */
  list: async (): Promise<ListAccountsResponse> => {
    const response = await apiClient.get<ListAccountsResponse>(
      endpoints.accounts.list
    );
    return response.data;
  },

  /**
   * POST /finance/accounts/initialize
   * Inicializa la primera cuenta (solo una vez)
   */
  initialize: async (data: InitializeAccountRequest): Promise<InitializeAccountResponse> => {
    const response = await apiClient.post<InitializeAccountResponse>(
      endpoints.accounts.initialize,
      data
    );
    return response.data;
  },

  /**
   * POST /finance/accounts
   * Crea una cuenta adicional
   */
  create: async (data: CreateAccountRequest): Promise<CreateAccountResponse> => {
    const response = await apiClient.post<CreateAccountResponse>(
      endpoints.accounts.create,
      data
    );
    return response.data;
  },

  /**
   * PUT /finance/accounts/:id
   * Actualiza una cuenta
   */
  update: async (id: string, data: UpdateAccountRequest): Promise<UpdateAccountResponse> => {
    const response = await apiClient.put<UpdateAccountResponse>(
      endpoints.accounts.update(id),
      data
    );
    return response.data;
  },

  /**
   * DELETE /finance/accounts/:id
   * Elimina una cuenta
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.accounts.delete(id));
  },

  /**
   * GET /finance/accounts/:id/balance
   * Obtiene el balance de una cuenta
   */
  getBalance: async (
    id: string,
    query?: GetAccountBalanceQuery
  ): Promise<GetAccountBalanceResponse> => {
    const response = await apiClient.get<GetAccountBalanceResponse>(
      endpoints.accounts.balance(id),
      { params: query }
    );
    return response.data;
  },
};
