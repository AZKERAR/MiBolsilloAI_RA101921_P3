import { apiClient } from '@/lib/axios-client';
import { endpoints } from '../endpoints';
import type {
  ListCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '@/types';

/**
 * Servicio de API para categorías
 */
export const categoriesApi = {
  /**
   * GET /finance/categories
   * Lista todas las categorías del usuario
   */
  list: async (): Promise<ListCategoriesResponse> => {
    const response = await apiClient.get<ListCategoriesResponse>(
      endpoints.categories.list
    );
    return response.data;
  },

  /**
   * POST /finance/categories
   * Crea una nueva categoría
   */
  create: async (data: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    const response = await apiClient.post<CreateCategoryResponse>(
      endpoints.categories.create,
      data
    );
    return response.data;
  },

  /**
   * PUT /finance/categories/:id
   * Actualiza una categoría
   */
  update: async (
    id: string,
    data: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> => {
    const response = await apiClient.put<UpdateCategoryResponse>(
      endpoints.categories.update(id),
      data
    );
    return response.data;
  },

  /**
   * DELETE /finance/categories/:id
   * Elimina una categoría
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.categories.delete(id));
  },
};
