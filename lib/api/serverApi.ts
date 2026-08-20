import 'server-only';
import axios from 'axios';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/types/api';
import type { Article } from '@/types/article';
import type { Author } from '@/types/author';

const backend = axios.create({
  baseURL: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL,
});

async function authHeaders() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

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

export const getArticleById = async (articleId: string): Promise<Article> => {
  const { data } = await backend.get<ApiResponse<{ article: Article }>>(
    `/articles/${articleId}`,
    { headers: await authHeaders() }
  );
  return data.data.article;
};

interface GetRecommendedArticlesOptions {
  excludeId?: string;
  limit?: number;
}

export const getRecommendedArticles = async ({
  excludeId,
  limit = 3,
}: GetRecommendedArticlesOptions = {}): Promise<Article[]> => {
  const { data } = await backend.get<ApiResponse<GetArticlesResponseData>>('/articles', {
    params: { category: 'recommended', perPage: limit + 1, page: 1 },
    headers: await authHeaders(),
  });

  return data.data.articles.filter(article => article._id !== excludeId).slice(0, limit);
};

export const getPopularArticles = async (limit = 4): Promise<Article[]> => {
  const { data } = await backend.get<ApiResponse<GetArticlesResponseData>>('/articles', {
    params: { category: 'popular', page: 1, perPage: limit },
    headers: await authHeaders(),
  });

  return data.data.articles;
};

export const getAuthorById = async (authorId: string): Promise<Author> => {
  const { data } = await backend.get<ApiResponse<{ user: Author }>>(`/users/${authorId}`, {
    headers: await authHeaders(),
  });
  return data.data.user;
};

interface GetArticlesByAuthorResponseData {
  articles: Article[];
  pagination: ArticlesPagination;
}

export const getArticlesByAuthor = async (
  authorId: string,
  page = 1,
  perPage = 12
): Promise<GetArticlesByAuthorResponseData> => {
  const { data } = await backend.get<ApiResponse<GetArticlesByAuthorResponseData>>(
    `/users/${authorId}/articles`,
    { params: { page, perPage }, headers: await authHeaders() }
  );
  return data.data;
};

interface AuthorsPagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

interface GetAuthorsResponseData {
  users: Author[];
  pagination: AuthorsPagination;
}

export interface GetAuthorsResult {
  authors: Author[];
  pagination: AuthorsPagination;
}

export const getAuthors = async (page = 1, perPage = 20): Promise<GetAuthorsResult> => {
  const { data } = await backend.get<ApiResponse<GetAuthorsResponseData>>('/users', {
    params: { page, perPage },
    headers: await authHeaders(),
  });

  return { authors: data.data.users, pagination: data.data.pagination };
};
