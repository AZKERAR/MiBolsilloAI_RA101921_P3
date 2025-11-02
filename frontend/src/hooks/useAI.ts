import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/api';
import { useAppStore } from '@/store';
import { handleApiError } from '@/utils/error-handler';
import type {
  AITipsRequest,
  AICategorizeRequest,
} from '@/types';

/**
 * Hook para funcionalidades de IA
 */
export const useAI = () => {
  const { showSnackbar } = useAppStore();

  // Obtener consejos de ahorro
  const tipsMutation = useMutation({
    mutationFn: (data: AITipsRequest) => aiApi.getTips(data),
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Categorizar gasto
  const categorizeMutation = useMutation({
    mutationFn: async (data: AICategorizeRequest) => {
      console.log('🤖 [useAI] Categorizing with data:', JSON.stringify(data, null, 2));
      try {
        const result = await aiApi.categorize(data);
        console.log('✅ [useAI] Categorization result:', JSON.stringify(result, null, 2));
        return result;
      } catch (error: any) {
        console.error('❌ [useAI] Categorization error:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          fullError: JSON.stringify(error, null, 2)
        });
        throw error;
      }
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  return {
    // Mutations
    getTips: tipsMutation.mutate,
    categorize: categorizeMutation.mutate,

    // Data
    tipsData: tipsMutation.data,
    categorizeData: categorizeMutation.data,

    // Loading states
    isLoadingTips: tipsMutation.isPending,
    isLoadingCategorize: categorizeMutation.isPending,

    // Success states
    isTipsSuccess: tipsMutation.isSuccess,
    isCategorizeSuccess: categorizeMutation.isSuccess,
  };
};
