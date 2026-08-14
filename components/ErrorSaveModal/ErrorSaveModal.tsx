'use client';

import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/useModalStore';
import Modal, { useModalClose } from '@/components/Modal/Modal';
import styles from './ErrorSaveModal.module.css';

const ErrorSaveModalContent = () => {
  const router = useRouter();
  const close = useModalClose();

  const goTo = (path: string) => {
    close();
    router.push(path);
  };

  return (
    <>
      <button type="button" className={styles.closeButton} onClick={close} aria-label="Close">
        <svg width="24" height="24" aria-hidden>
          <use href="/icons/sprite.svg#close" />
        </svg>
      </button>

      <h2 className={styles.title}>Error while saving</h2>
      <p className={styles.text}>To save this article, you need to authorize first</p>

      <div className={styles.actions}>
        <button type="button" className={styles.login} onClick={() => goTo('/login')}>
          Login
        </button>
        <button type="button" className={styles.register} onClick={() => goTo('/register')}>
          Register
        </button>
      </div>
    </>
  );
};

const ErrorSaveModal = () => {
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <Modal onClose={closeModal} contentClassName={styles.modalContent}>
      <ErrorSaveModalContent />
    </Modal>
  );
};

export default ErrorSaveModal;
