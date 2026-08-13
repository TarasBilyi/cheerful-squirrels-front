import { nextServer } from './api';
import { User } from '@/types/user';

export type LoginRequest = { email: string; password: string };

export const login = async (user: LoginRequest) => {
  const { data } = await nextServer.post<User>('/auth/login', user);
  return data;
};
