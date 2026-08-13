'use client';

import { useModalStore } from '@/store/useModalStore';
import ErrorSaveModal from '@/components/modals/ErrorSaveModal/ErrorSaveModal';

const ModalRoot = () => {
  const activeModal = useModalStore(state => state.activeModal);

  switch (activeModal) {
    case 'error-save':
      return <ErrorSaveModal />;
    default:
      return null;
  }
};

export default ModalRoot;
