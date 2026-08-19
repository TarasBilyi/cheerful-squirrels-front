import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_NEXT_URL}/api`,
  withCredentials: true,
});

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const isAuthRoute = (url?: string) =>
  !!url && (url.includes('/auth/login') || url.includes('/auth/refresh'));

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isAuthRoute(originalRequest.url) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= api.post('/auth/refresh').then(() => undefined);
      await refreshPromise;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);
