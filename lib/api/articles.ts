import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Article {
  _id: string;
  img: string;
  title: string;
  desc: string;
  article: string;
  rate: number;
  ownerId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

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
  const response = await axios.get(`${API_URL}/articles`, {
    params: {
      category,
      page,
      perPage,
    },
  });

  return response.data.data;
};