import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

// Every request goes through this app's own /api/* Route Handlers (see
// app/api/**/route.ts), which forward it to the real backend server-side.
// This makes every cookie the backend sets first-party for the frontend's
// own domain, which fixes logins being lost on reload on browsers that
// block third-party cookies (iOS Safari does this by default, unlike most
// desktop browsers - hence the mobile-only symptom).
export const api = axios.create({
  baseURL: '/api',
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