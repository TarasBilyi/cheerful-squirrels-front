'use client';

import { useModalStore } from '@/lib/store/useModalStore';
import ErrorSaveModal from '@/components/ErrorSaveModal/ErrorSaveModal';
import LogoutConfirmModal from '@/components/LogoutConfirmModal/LogoutConfirmModal';
import UserModal from '@/components/UserModal/UserModal';

const ModalRoot = () => {
  const activeModal = useModalStore(state => state.activeModal);

  switch (activeModal) {
    case 'error-save':
      return <ErrorSaveModal />;
    case 'confirm-logout':
      return <LogoutConfirmModal />;
    case 'user-profile':
      return <UserModal />;
    default:
      return null;
  }
};

export default ModalRoot;
