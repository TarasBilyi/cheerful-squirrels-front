import type { User } from '@/types/user';
import LogoutButton from '../LogoutButton/LogoutButton';
import css from './UserBar.module.css';

interface UserBarProps {
  user: User;
  onBeforeLogoutClick?: () => void;
}

const UserBar = ({ user, onBeforeLogoutClick }: UserBarProps) => {
  const initial = user.name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={css.userBar}>
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- домен аватара динамічний (бек),
        // next/image вимагав би заздалегідь прописувати remotePatterns у next.config
        <img src={user.avatarUrl} alt={user.name} className={css.avatar} />
      ) : (
        <span className={css.avatar} aria-hidden>
          {initial}
        </span>
      )}
      <span className={css.userName}>{user.name}</span>
      <span className={css.divider} aria-hidden />
      <LogoutButton onBeforeOpen={onBeforeLogoutClick} />
    </div>
  );
};

export default UserBar;
