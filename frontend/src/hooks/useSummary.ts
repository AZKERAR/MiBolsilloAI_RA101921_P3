import { useQuery } from '@tanstack/react-query';
import { summaryApi } from '@/api';
import { QUERY_KEYS } from '@/config/constants';
import type { GetSummaryQuery } from '@/types';

/**
 * Hook para resumen financiero
 */
export const useSummary = (query?: GetSummaryQuery) => {
  const summaryQuery = useQuery({
    queryKey: [...QUERY_KEYS.summary, query],
    queryFn: () => summaryApi.get(query),
  });

  return {
    summary: summaryQuery.data,
    isLoadingSummary: summaryQuery.isLoading,
    isErrorSummary: summaryQuery.isError,
    refetchSummary: summaryQuery.refetch,
  };
};
