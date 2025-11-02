import { apiClient } from '@/lib/axios-client';
import { endpoints } from '../endpoints';
import type { GetSummaryQuery, GetSummaryResponse } from '@/types';

/**
 * Servicio de API para resumen financiero
 */
export const summaryApi = {
  /**
   * GET /finance/summary
   * Obtiene resumen financiero con totales y gastos por categoría
   */
  get: async (query?: GetSummaryQuery): Promise<GetSummaryResponse> => {
    const response = await apiClient.get<GetSummaryResponse>(
      endpoints.summary.get,
      { params: query }
    );
    return response.data;
  },
};
