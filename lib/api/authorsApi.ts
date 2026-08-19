import { nextServer } from './api';
import type { ApiResponse } from '@/types/api';
import type { Article } from '@/types/article';
import type { Author } from '@/types/author';

export const getAuthorById = async (authorId: string): Promise<Author> => {
  const { data } = await nextServer.get<ApiResponse<{ user: Author }>>(`/users/${authorId}`);
  return data.data.user;
};

interface ArticlesPagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface GetArticlesByAuthorResponseData {
  articles: Article[];
  pagination: ArticlesPagination;
}

export const getArticlesByAuthor = async (
  authorId: string,
  page = 1,
  perPage = 12
): Promise<GetArticlesByAuthorResponseData> => {
  const { data } = await nextServer.get<ApiResponse<GetArticlesByAuthorResponseData>>(
    `/users/${authorId}/articles`,
    { params: { page, perPage } }
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
  const { data } = await nextServer.get<ApiResponse<GetAuthorsResponseData>>('/users', {
    params: { page, perPage },
  });

  return { authors: data.data.users, pagination: data.data.pagination };
};
