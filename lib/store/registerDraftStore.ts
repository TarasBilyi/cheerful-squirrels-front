import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegisterDraft {
  name: string;
  email: string;
  password: string;
}

interface RegisterDraftStore {
  draft: RegisterDraft | null;
  setDraft: (draft: RegisterDraft) => void;
  clearDraft: () => void;
}

export const useRegisterDraftStore = create<RegisterDraftStore>()(
  persist(
    set => ({
      draft: null,

      setDraft: draft => set({ draft }),

      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'harmoniq-register-draft',

      partialize: state => ({
        draft: state.draft
          ? {
              name: state.draft.name,
              email: state.draft.email,
            }
          : null,
      }),

      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          draft?: { name: string; email: string } | null;
        };

        if (currentState.draft?.password) {
          return {
            ...currentState,
            draft: {
              name: persisted?.draft?.name ?? currentState.draft.name,
              email: persisted?.draft?.email ?? currentState.draft.email,
              password: currentState.draft.password,
            },
          };
        }

        return {
          ...currentState,
          draft: persisted?.draft
            ? {
                name: persisted.draft.name,
                email: persisted.draft.email,
                password: '', // пароль відсутній
              }
            : null,
        };
      },
    }
  )
);
