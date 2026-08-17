import { nextServer } from './api';
import type { ApiResponse } from '@/types/api';
import type { Article } from '@/types/article';

export const getArticleById = async (articleId: string) => {
  const { data } = await nextServer.get<ApiResponse<{ article: Article }>>(
    `/articles/${articleId}`
  );
  return data.data.article;
};

export const deleteArticle = async (articleId: string): Promise<void> => {
  await api.delete<ApiResponse<{ article: Article }>>(`/articles/${articleId}`);
};

export interface UpdateArticlePayload {
  title?: string;
  desc?: string;
  article?: string;
  photo?: File;
}

export const updateArticle = async (
  articleId: string,
  payload: UpdateArticlePayload,
): Promise<Article> => {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append('title', payload.title);
  if (payload.desc !== undefined) formData.append('desc', payload.desc);
  if (payload.article !== undefined) formData.append('article', payload.article);
  if (payload.photo) formData.append('photo', payload.photo);

  const { data } = await api.patch<ApiResponse<{ article: Article }>>(
    `/articles/${articleId}`,
    formData,
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
  const { data } = await nextServer.get<ApiResponse<GetArticlesResponseData>>('/articles', {
    params: {
      category: 'recommended',
      perPage: limit + 1,
      page: 1,
    },
  });

  return data.data.articles.filter(article => article._id !== excludeId).slice(0, limit);
};

export const getPopularArticles = async (limit = 4) => {
  const { data } = await nextServer.get<ApiResponse<GetArticlesResponseData>>('/articles', {
    params: {
      category: 'popular',
      page: 1,
      perPage: limit,
    },
  });

  return data.data.articles;
};
