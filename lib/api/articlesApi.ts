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

/**
 * "You can also interested" block — backend picks random articles via
 * ?category=recommended (Mongo $sample), so we just ask for a couple extra
 * and filter out the current article client-side in case it gets sampled.
 *
 * NOTE: this list endpoint doesn't populate `ownerId` (stays a plain string
 * id) — see the `getAuthorName`-style guard used wherever we render it.
 */
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
