import { api } from './api';
import { User } from '@/types/user';

interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export type LoginRequest = { email: string; password: string };

export const login = async (user: LoginRequest): Promise<User> => {
  const { data } = await api.post<ApiEnvelope<{ user: User }>>('/auth/login', user);
  return data.data.user;
};

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<ApiEnvelope<{ user: User }>>('/users/me');
  return data.data.user;
}

export async function refreshSession(): Promise<void> {
  await api.post('/auth/refresh');
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export const addSavedArticle = async (articleId: string) => {
  const { data } = await api.post<ApiEnvelope<{ savedArticles: string[] }>>('/saved', {
    articleId,
  });
  return data.data;
};

export const removeSavedArticle = async (articleId: string) => {
  const { data } = await api.delete<ApiEnvelope<{ savedArticles: string[] }>>('/saved', {
    data: { articleId },
  });
  return data.data;
};

export type RegisterRequest = { name: string; email: string; password: string };

export const register = async (user: RegisterRequest): Promise<User> => {
  const { data } = await api.post<ApiEnvelope<{ user: User }>>('/auth/register', user);
  return data.data.user;
};

export const updateAvatar = async (avatar: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append('avatar', avatar);
  const { data } = await api.patch<ApiEnvelope<{ avatarUrl: string }>>(
    '/users/me/avatar',
    formData
  );
  return data.data;
};
