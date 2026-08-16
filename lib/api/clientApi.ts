import { clearAuthHintCookie, setAuthHintCookie } from '../utils/authHint';
import { nextServer } from './api';
import { User } from '@/types/user';

interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export type LoginRequest = { email: string; password: string };

export const login = async (user: LoginRequest): Promise<User> => {
  const { data } = await nextServer.post<ApiEnvelope<{ user: User }>>('/auth/login', user);
  setAuthHintCookie();
  return data.data.user;
};

export async function getCurrentUser(): Promise<User> {
  const { data } = await nextServer.get<ApiEnvelope<{ user: User }>>('/users/me');
  return data.data.user;
}

export async function refreshSession(): Promise<void> {
  await nextServer.post('/auth/refresh');
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
  clearAuthHintCookie();
}

export const addSavedArticle = async (articleId: string) => {
  const { data } = await nextServer.post<ApiEnvelope<{ savedArticles: string[] }>>('/saved', {
    articleId,
  });
  return data.data;
};

export const removeSavedArticle = async (articleId: string) => {
  const { data } = await nextServer.delete<ApiEnvelope<{ savedArticles: string[] }>>('/saved', {
    data: { articleId },
  });
  return data.data;
};

export type RegisterRequest = { name: string; email: string; password: string };

export const register = async (user: RegisterRequest): Promise<User> => {
  const { data } = await nextServer.post<ApiEnvelope<{ user: User }>>('/auth/register', user);
  return data.data.user;
};

export const updateAvatar = async (avatar: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append('avatar', avatar);
  const { data } = await nextServer.patch<ApiEnvelope<{ avatarUrl: string }>>(
    '/users/me/avatar',
    formData
  );
  return data.data;
};
