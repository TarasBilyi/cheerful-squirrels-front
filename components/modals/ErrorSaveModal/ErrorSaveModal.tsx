'use client';

import { useModalStore } from '@/store/useModalStore';
import Modal from '@/components/Modal/Modal';
import styles from './ErrorSaveModal.module.css';

const ErrorSaveModal = () => {
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <Modal onClose={closeModal}>
      <h2 className={styles.title}>Sign in required</h2>
      <p className={styles.text}>Please log in to your account to save articles to bookmarks.</p>
      <button type="button" className={styles.confirm} onClick={closeModal}>
        Got it
      </button>
    </Modal>
  );
};

export default ErrorSaveModal;
