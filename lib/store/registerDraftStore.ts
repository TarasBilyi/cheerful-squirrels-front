import { create } from 'zustand';

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

export const useRegisterDraftStore = create<RegisterDraftStore>()((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));