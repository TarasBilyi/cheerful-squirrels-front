import { create } from 'zustand';

export type ModalType = 'error-save' | null;

interface ModalState {
  activeModal: ModalType;
  openModal: (modal: Exclude<ModalType, null>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  activeModal: null,
  openModal: modal => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));
