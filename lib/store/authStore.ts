import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getCurrentUser, refreshSession } from '@/lib/api/clientApi';
import { setAuthHintCookie, clearAuthHintCookie } from '@/lib/utils/authHint';
import type { User } from '@/types/user';

interface AuthStore {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;
  setAuthAuthenticated: (isAuthenticated: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,

      setUser: user => {
        setAuthHintCookie();
        set({ user, isAuthenticated: true });
      },

      clearUser: () => {
        clearAuthHintCookie();
        set({ user: null, isAuthenticated: false });
      },

      setAuthAuthenticated: isAuthenticated =>
        set({
          isAuthenticated,
        }),

      initializeAuth: async () => {
        set({ isAuthenticated: false });

        try {
          const user = await getCurrentUser();
          setAuthHintCookie();
          set({ user, isAuthenticated: true });
        } catch {
          try {
            await refreshSession();
            const user = await getCurrentUser();
            setAuthHintCookie();
            set({ user, isAuthenticated: true });
          } catch {
            clearAuthHintCookie();
            set({ user: null, isAuthenticated: false });
          }
        } finally {
          set({ isInitializing: false });
        }
      },
    }),
    {
      name: 'harmoniq',
      skipHydration: true,
      partialize: state => ({
        user: state.user,
      }),
    }
  )
);
