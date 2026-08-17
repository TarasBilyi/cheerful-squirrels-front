'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { subscribeToAuthor, unsubscribeFromAuthor } from '@/lib/api/clientApi';
import { ApiError } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './SubscribeButton.module.css';

interface SubscribeButtonProps {
  authorId: string;
}

const SubscribeButton = ({ authorId }: SubscribeButtonProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const isSubscribed = user?.subscriptions?.includes(authorId) ?? false;

  const mutation = useMutation({
    mutationFn: () =>
      isSubscribed ? unsubscribeFromAuthor(authorId) : subscribeToAuthor(authorId),
    onSuccess: ({ subscriptions }) => {
      if (user) {
        setUser({ ...user, subscriptions });
      }
    },
    onError: error => {
      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Could not update subscription. Please try again.'
      );
    },
  });

  // Can't subscribe to yourself.
  if (isAuthenticated && user?._id === authorId) {
    return null;
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    mutation.mutate();
  };

  const isBusy = mutation.isPending;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isBusy}
      aria-pressed={isSubscribed}
      aria-busy={isBusy}
    >
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
};

export default SubscribeButton;
