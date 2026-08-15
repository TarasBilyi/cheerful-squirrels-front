'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModalStore } from '@/lib/store/useModalStore';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import type { ApiError } from '@/lib/api/api';
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
      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Failed to log out. Please try again.'
      );
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
          aria-busy={isLoading}
        >
          {isLoading && <span className={styles.spinner} aria-hidden />}
          {isLoading ? 'Logging out…' : 'Log out'}
        </button>
        <button type="button" className={styles.cancel} onClick={close} disabled={isLoading}>
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
