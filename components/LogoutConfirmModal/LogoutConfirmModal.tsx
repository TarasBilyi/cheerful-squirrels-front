'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/useModalStore';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import Modal, { useModalClose } from '@/components/Modal/Modal';
import styles from './LogoutConfirmModal.module.css';

const LogoutConfirmModalContent = () => {
  const router = useRouter();
  const close = useModalClose();
  const clearUser = useAuthStore(state => state.clearUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearUser();
      setIsLoading(false);
      close();
      router.push('/');
    }
  };

  return (
    <>
      <button type="button" className={styles.closeButton} onClick={close} aria-label="Close">
        <svg width="24" height="24" aria-hidden>
          <use href="/icons/sprite.svg#close" />
        </svg>
      </button>

      <h2 className={styles.title}>Are you sure?</h2>
      <p className={styles.text}>We will miss you!</p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.confirm}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out…' : 'Log out'}
        </button>
        <button type="button" className={styles.cancel} onClick={close}>
          Cancel
        </button>
      </div>
    </>
  );
};

const LogoutConfirmModal = () => {
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <Modal onClose={closeModal} contentClassName={styles.modalContent}>
      <LogoutConfirmModalContent />
    </Modal>
  );
};

export default LogoutConfirmModal;
