'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addSavedArticle, removeSavedArticle } from '@/lib/api/clientApi';
import type { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useModalStore } from '@/store/useModalStore';
import css from './SaveButton.module.css';

interface SaveButtonProps {
  articleId: string;
}

/**
 * Mirrors the pattern already used by ButtonAddToBookmarks (on ArticleItem
 * cards in the articles list) — reads auth/saved state straight from the
 * shared auth store instead of being handed props from a server component.
 * Kept as its own component (rather than reusing ButtonAddToBookmarks
 * directly) because this spot in the design is a full-width "Save"/"Saved"
 * pill with a text label, not the icon-only circular button used on cards.
 */
const SaveButton = ({ articleId }: SaveButtonProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const clearUser = useAuthStore(state => state.clearUser);
  const openModal = useModalStore(state => state.openModal);

  const isSaved = user?.savedArticles?.includes(articleId) ?? false;

  const mutation = useMutation({
    mutationFn: () =>
      isSaved ? removeSavedArticle(articleId) : addSavedArticle(articleId),
    onSuccess: ({ savedArticles }) => {
      if (user) {
        setUser({ ...user, savedArticles });
      }
    },
    onError: error => {
      const status = (error as ApiError).response?.status;

      // Session expired mid-visit (store still thought we were
      // authenticated, but the token didn't survive the round trip) —
      // treat it the same as the "please sign in" case rather than a
      // generic error.
      if (status === 401) {
        clearUser();
        openModal('error-save');
        return;
      }

      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Something went wrong. Please try again.',
      );
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      openModal('error-save');
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-pressed={isSaved}
      className={`${css.button} ${isSaved ? css.buttonSaved : ''}`}
    >
      {isSaved ? 'Saved' : 'Save'}
      <svg className={css.icon} aria-hidden>
        <use href="/icons/sprite.svg#bookmark-alternative" />
      </svg>
    </button>
  );
};

export default SaveButton;
