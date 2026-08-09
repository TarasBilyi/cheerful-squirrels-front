import { create } from 'zustand';

interface LogoutModalStore {
  isOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
}

export const useLogoutModalStore = create<LogoutModalStore>(set => ({
  isOpen: false,
  openLogoutModal: () => set({ isOpen: true }),
  closeLogoutModal: () => set({ isOpen: false }),
}));
