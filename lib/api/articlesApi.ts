import { nextServer } from './api';
import type { ApiResponse } from '@/types/api';
import type { Article, GetArticlesResponseData } from '@/types/article';

export const getArticleById = async (articleId: string) => {
  const { data } = await nextServer.get<ApiResponse<{ article: Article }>>(
    `/articles/${articleId}`,
  );
  return data.data.article;
};

interface GetRecommendedArticlesOptions {
  excludeId?: string;
  limit?: number;
}

/**
 * "You can also interested" block — backend picks random articles via
 * ?category=recommended (Mongo $sample), so we just ask for a couple extra
 * and filter out the current article client-side in case it gets sampled.
 */
export const getRecommendedArticles = async ({
  excludeId,
  limit = 3,
}: GetRecommendedArticlesOptions = {}) => {
  const { data } = await nextServer.get<ApiResponse<GetArticlesResponseData>>(
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

export const saveArticle = async (articleId: string) => {
  const { data } = await nextServer.post<
    ApiResponse<{ savedArticles: string[] }>
  >('/saved', { articleId });
  return data.data.savedArticles;
};

export const unsaveArticle = async (articleId: string) => {
  const { data } = await nextServer.delete<
    ApiResponse<{ savedArticles: string[] }>
  >('/saved', { data: { articleId } });
  return data.data.savedArticles;
};
