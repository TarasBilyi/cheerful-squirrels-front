import { nextServer } from './api';
import { User } from '@/types/user';

export type LoginRequest = { email: string; password: string };

export const login = async (user: LoginRequest) => {
  const { data } = await nextServer.post<User>('/auth/login', user);
  return data;
};

export type RegisterRequest = { name: string; email: string; password: string };

export const register = async (user: RegisterRequest) => {
  const { data } = await nextServer.post<User>('/auth/register', user);
  return data;
};

export const updateAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  const { data } = await nextServer.patch<User>('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};