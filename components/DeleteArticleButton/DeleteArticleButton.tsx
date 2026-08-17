'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { deleteArticle } from '@/lib/api/articlesApi';
import { useAuthStore } from '@/lib/store/authStore';
import Modal, { useModalClose } from '@/components/Modal/Modal';
import styles from './DeleteArticleButton.module.css';

// The shared `ApiError` type (lib/api/api.ts) expects `{ error: string }`.
// The backend now sends both `message` and `error` for the same value (see
// errorHandler.js), but this reads both defensively in case the backend
// change doesn't land — it still degrades gracefully either way.
type DeleteArticleError = AxiosError<{ message?: string; error?: string }>;

interface DeleteConfirmContentProps {
  articleId: string;
  onDeleted?: (articleId: string) => void;
}

const DeleteConfirmContent = ({ articleId, onDeleted }: DeleteConfirmContentProps) => {
  const close = useModalClose();
  const router = useRouter();
  const clearUser = useAuthStore(state => state.clearUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await deleteArticle(articleId);
      toast.success('Article deleted');
      onDeleted?.(articleId);
      close();
    } catch (error) {
      const axiosError = error as DeleteArticleError;
      const status = axiosError.response?.status;

      if (status === 401) {
        clearUser();
        close();
        toast.error('Your session has expired. Please log in again.');
        router.push('/login');
        return;
      }

      toast.error(
        axiosError.response?.data?.message ??
          axiosError.response?.data?.error ??
          axiosError.message ??
          'Could not delete the article. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.closeButton}
        onClick={close}
        disabled={isLoading}
        aria-label="Close"
      >
        <svg width="24" height="24" aria-hidden>
          <use href="/icons/sprite.svg#close" />
        </svg>
      </button>

      <h2 className={styles.title}>Delete this article?</h2>
      <p className={styles.text}>This action can’t be undone.</p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.confirm}
          onClick={handleConfirm}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading && <span className={styles.spinner} aria-hidden />}
          {isLoading ? 'Deleting…' : 'Delete'}
        </button>
        <button type="button" className={styles.cancel} onClick={close} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </>
  );
};

interface DeleteArticleButtonProps {
  articleId: string;
  onDeleted?: (articleId: string) => void;
}

const DeleteArticleButton = ({ articleId, onDeleted }: DeleteArticleButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsModalOpen(true)}
        aria-label="Delete article"
      >
        <svg className={styles.icon} width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
          <use href="/icons/sprite.svg#delete" />
        </svg>
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} contentClassName={styles.modalContent}>
          <DeleteConfirmContent articleId={articleId} onDeleted={onDeleted} />
        </Modal>
      )}
    </>
  );
};

export default DeleteArticleButton;
