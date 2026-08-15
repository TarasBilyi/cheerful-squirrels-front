import type { User } from '@/types/user';
import LogoutButton from '../LogoutButton/LogoutButton';
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
  onBeforeLogoutClick?: () => void;
}

const UserBar = ({ user, isLoading, onBeforeLogoutClick }: UserBarProps) => {
  const avatarSrc = user ? resolveAvatarUrl(user.avatarUrl) : null;
  const initial = user?.name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={css.userBar}>
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

      <span className={css.divider} aria-hidden />
      <LogoutButton onBeforeOpen={onBeforeLogoutClick} />
    </div>
  );
};

export default UserBar;
