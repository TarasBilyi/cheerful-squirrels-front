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
          ? { name: state.draft.name, email: state.draft.email, password: '' }
          : null,
      }),
    }
  )
);
