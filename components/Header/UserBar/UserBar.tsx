import type { User } from '@/types/user';
import LogoutButton from '../LogoutButton/LogoutButton';
import css from './UserBar.module.css';

interface UserBarProps {
  user: User;
  onBeforeLogoutClick?: () => void;
}

const UserBar = ({ user, onBeforeLogoutClick }: UserBarProps) => {
  return (
    <div className={css.userBar}>
      <span className={css.avatar} aria-hidden />
      <span className={css.userName}>{user.name}</span>
      <span className={css.divider} aria-hidden />
      <LogoutButton onBeforeOpen={onBeforeLogoutClick} />
    </div>
  );
};

export default UserBar;
