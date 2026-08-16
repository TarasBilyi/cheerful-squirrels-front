'use client';

import type { User } from '@/types/user';
import { useModalStore } from '@/lib/store/useModalStore';
import css from './UserBar.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

const resolveAvatarUrl = (avatarUrl?: string): string | null => {
  if (!avatarUrl) return null;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
  return `${API_BASE_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
};

interface UserBarProps {
  user: User | null;
  isLoading?: boolean;
  onBeforeOpen?: () => void;
}

const UserBar = ({ user, isLoading, onBeforeOpen }: UserBarProps) => {
  const openModal = useModalStore(state => state.openModal);

  const avatarSrc = user ? resolveAvatarUrl(user.avatarUrl) : null;
  const initial = user?.name?.trim().charAt(0).toUpperCase() || '?';

  const handleClick = () => {
    onBeforeOpen?.();
    openModal('user-profile');
  };

  return (
    <button
      type="button"
      className={css.userBar}
      onClick={handleClick}
      disabled={isLoading}
      aria-label="Open profile"
    >
      {isLoading ? (
        <span className={css.avatarSkeleton} aria-hidden />
      ) : avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- домен аватара динамічний (бек)
        <img src={avatarSrc} alt={user?.name} className={css.avatar} />
      ) : (
        <span className={css.avatar} aria-hidden>
          {initial}
        </span>
      )}

      {isLoading ? (
        <span className={css.nameSkeleton} aria-hidden />
      ) : (
        <span className={css.userName}>{user?.name}</span>
      )}
    </button>
  );
};

export default UserBar;
