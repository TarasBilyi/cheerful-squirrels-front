import { api } from './api';
import type { ApiResponse } from '@/types/api';
import type { Article } from '@/types/article';

export const getArticleById = async (articleId: string) => {
  const { data } = await api.get<ApiResponse<{ article: Article }>>(
    `/articles/${articleId}`,
  );
  return data.data.article;
};

interface ArticlesPagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface GetArticlesResponseData {
  articles: Article[];
  pagination: ArticlesPagination;
}

interface GetRecommendedArticlesOptions {
  excludeId?: string;
  limit?: number;
}

export const getRecommendedArticles = async ({
  excludeId,
  limit = 3,
}: GetRecommendedArticlesOptions = {}) => {
  const { data } = await api.get<ApiResponse<GetArticlesResponseData>>(
    '/articles',
    {
      params: {
        category: 'recommended',
        perPage: limit + 1,
        page: 1,
      },
    },
  );

  return data.data.articles
    .filter(article => article._id !== excludeId)
    .slice(0, limit);
};
