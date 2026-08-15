import { api } from "@/lib/api/api";


export interface Article {
  _id: string;
  title: string;
  article: string;
  img: string;
  date: string;
  ownerId: string
  createdAt: string;
  updatedAt: string;
}

export async function createArticle(formData: FormData): Promise<Article> {
  const response = await api.post<Article>('/articles', formData);
  return response.data;
}