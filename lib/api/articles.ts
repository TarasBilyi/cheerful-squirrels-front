import type { Article } from '@/types/article';
import { nextServer } from './api';

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
  perPage = 10
): Promise<ArticlesResponse> => {
  const response = await nextServer.get('/articles', {
    params: {
      category,
      page,
      perPage,
    },
  });

  return response.data.data;
};
