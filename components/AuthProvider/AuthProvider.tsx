'use client';

import { useEffect, type ReactNode } from 'react';

import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

let initializationPromise: Promise<void> | null = null;

const initializeAuthProvider = (): Promise<void> => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        await useAuthStore.persist.rehydrate();
        await useAuthStore.getState().initializeAuth();
      } catch {
        useAuthStore.getState().clearUser();
      }
    })();
  }

  return initializationPromise;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    void initializeAuthProvider();
  }, []);

  return children;
};

export default AuthProvider;