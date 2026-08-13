// components/ButtonAddToBookmarks/ButtonAddToBookmarks.tsx

'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addSavedArticle, removeSavedArticle } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useModalStore } from '@/store/useModalStore';
import styles from './ButtonAddToBookmarks.module.css';

interface ButtonAddToBookmarksProps {
  articleId: string;
}

const ButtonAddToBookmarks = ({ articleId }: ButtonAddToBookmarksProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const openModal = useModalStore(state => state.openModal);

  const isSaved = user?.savedArticles?.includes(articleId) ?? false;

  const { mutate, isPending } = useMutation({
    mutationFn: () => (isSaved ? removeSavedArticle(articleId) : addSavedArticle(articleId)),
    onSuccess: ({ savedArticles }) => {
      if (user) {
        setUser({ ...user, savedArticles });
      }
    },
    onError: error => {
      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Could not update saved articles. Please try again.'
      );
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      openModal('error-save');
      return;
    }
    mutate();
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isSaved}
      aria-busy={isPending}
      aria-label={isSaved ? 'Remove article from bookmarks' : 'Add article to bookmarks'}
    >
      <svg className={styles.icon} width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
        <use href="/icons/sprite.svg#bookmark-alternative" />
      </svg>
    </button>
  );
};

export default ButtonAddToBookmarks;
