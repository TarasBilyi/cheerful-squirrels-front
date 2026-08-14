'use client';

import { useModalStore } from '@/store/useModalStore';
import Modal, { useModalClose } from '@/components/Modal/Modal';
import styles from './ErrorSaveModal.module.css';

const ErrorSaveModalContent = () => {
  const close = useModalClose();

  return (
    <>
      <h2 className={styles.title}>Sign in required</h2>
      <p className={styles.text}>Please log in to your account to save articles to bookmarks.</p>
      <button type="button" className={styles.confirm} onClick={close}>
        Got it
      </button>
    </>
  );
};

const ErrorSaveModal = () => {
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <Modal onClose={closeModal}>
      <ErrorSaveModalContent />
    </Modal>
  );
};

export default ErrorSaveModal;
