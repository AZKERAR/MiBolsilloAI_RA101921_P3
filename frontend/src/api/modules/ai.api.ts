import { apiClient } from '@/lib/axios-client';
import { endpoints } from '../endpoints';
import type {
  AITipsRequest,
  AITipsResponseWrapper,
  AICategorizeRequest,
  AICategorizeResponseWrapper,
} from '@/types';

/**
 * Servicio de API para inteligencia artificial
 */
export const aiApi = {
  /**
   * POST /ai/tips
   * Obtiene consejos de ahorro personalizados
   */
  getTips: async (data: AITipsRequest): Promise<AITipsResponseWrapper> => {
    const response = await apiClient.post<AITipsResponseWrapper>(
      endpoints.ai.tips,
      data,
      {
        timeout: 60000, // 60 segundos para IA
      }
    );
    return response.data;
  },

  /**
   * POST /ai/categorize
   * Categoriza un gasto automáticamente
   */
  categorize: async (data: AICategorizeRequest): Promise<AICategorizeResponseWrapper> => {
    const response = await apiClient.post<AICategorizeResponseWrapper>(
      endpoints.ai.categorize,
      data,
      {
        timeout: 30000, // 30 segundos
      }
    );
    return response.data;
  },
};
