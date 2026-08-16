import { api } from './api';
import type { Article } from '@/types/article';

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const getArticles = async (
  category: 'general' | 'popular',
  page = 1,
  perPage = 10,
): Promise<ArticlesResponse> => {
  const { data } = await api.get('/articles', {
    params: {
      category,
      page,
      perPage,
    },
  });

  return data.data;
};