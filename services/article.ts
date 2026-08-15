import { api } from '@/lib/api/api';
import type { ApiResponse } from '@/types/api';

export interface Article {
  _id: string;
  title: string;
  article: string;
  img: string;
  date: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export async function createArticle(formData: FormData): Promise<Article> {
  const { data } = await api.post<ApiResponse<{ article: Article }>>('/articles', formData);
  return data.data.article;
}
