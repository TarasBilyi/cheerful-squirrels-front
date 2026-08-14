'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { saveArticle, unsaveArticle } from '@/lib/api/articlesApi';
import css from './SaveButton.module.css';

interface SaveButtonProps {
  articleId: string;
  initialIsSaved: boolean;
  isAuthenticated: boolean;
}

const SaveButton = ({
  articleId,
  initialIsSaved,
  isAuthenticated,
}: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const nextIsSaved = !isSaved;
    setIsSaved(nextIsSaved);
    setIsPending(true);

    try {
      if (nextIsSaved) {
        await saveArticle(articleId);
      } else {
        await unsaveArticle(articleId);
      }
    } catch (error) {
      setIsSaved(!nextIsSaved);

      // `isAuthenticated` currently comes from a hardcoded stub (always
      // true) in lib/auth/getCurrentUser.ts, so a stale/expired/missing
      // session only surfaces here, as a 401 from the API. Redirect to
      // login instead of showing a generic error in that case; once the
      // real auth check lands this branch becomes a rare edge case
      // (e.g. session expired mid-visit) rather than the common path.
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push('/login');
        return;
      }

      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
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
