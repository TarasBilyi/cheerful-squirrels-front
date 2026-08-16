import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import { Article } from '@/types/article';

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.post('/auth/refresh', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

interface FetchArticlesResponse {
  articles: Article[];
  totalPages: number;
}

export const fetchServerArticles = async (
  category?: string,
  page?: number,
  perPage?: number
): Promise<FetchArticlesResponse> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/articles', {
    params: { search: String(category), page, perPage },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchServerArticleById = async (id: string) => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<Article>(`/articles/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
