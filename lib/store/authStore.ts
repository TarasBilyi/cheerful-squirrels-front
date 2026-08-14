import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getCurrentUser, refreshSession } from '@/lib/api/clientApi';
import type { User } from '@/types/user';

interface AuthStore {
  isAuthenticated: boolean;
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

      setUser: user =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false, // ← виправлено
        }),

      setAuthAuthenticated: isAuthenticated =>
        // ← правильна назва
        set({
          isAuthenticated,
        }),

      initializeAuth: async () => {
        set({ isAuthenticated: false });

        try {
          const user = await getCurrentUser();

          set({
            user,
            isAuthenticated: true,
          });
        } catch {
          try {
            await refreshSession();

            const user = await getCurrentUser();

            set({
              user,
              isAuthenticated: true,
            });
          } catch {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
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
