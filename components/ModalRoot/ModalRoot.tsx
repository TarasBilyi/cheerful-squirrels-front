'use client';

import { useModalStore } from '@/store/useModalStore';
import ErrorSaveModal from '@/components/ErrorSaveModal/ErrorSaveModal';
import LogoutConfirmModal from '@/components/LogoutConfirmModal/LogoutConfirmModal';

const ModalRoot = () => {
  const activeModal = useModalStore(state => state.activeModal);

  switch (activeModal) {
    case 'error-save':
      return <ErrorSaveModal />;
    case 'confirm-logout':
      return <LogoutConfirmModal />;
    default:
      return null;
  }
};

export default ModalRoot;
