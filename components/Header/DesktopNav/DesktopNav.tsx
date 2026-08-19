import type { User } from '@/types/user';
import { NAV_LINKS } from '../Header.constants';
import NavLink from '../NavLink/NavLink';
import CtaLink from '../CtaLink/CtaLink';
import UserBar from '../UserBar/UserBar';
import LogoutButton from '../LogoutButton/LogoutButton';
import css from './DesktopNav.module.css';

interface DesktopNavProps {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: User | null;
}

const DesktopNav = ({ isAuthenticated, isLoadingUser, user }: DesktopNavProps) => {
  return (
    <nav className={css.desktopNav} aria-label="Primary">
      <ul className={css.desktopNavList}>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <NavLink href={href}>{label}</NavLink>
          </li>
        ))}
        {isAuthenticated && (
          <li>
            <NavLink href="/profile">My Profile</NavLink>
          </li>
        )}
      </ul>

      {isAuthenticated ? (
        <div className={`${css.desktopAuth} ${css.desktopAuthAuthenticated}`}>
          <CtaLink href="/articles/new">Create an article</CtaLink>
          <div className={css.accountGroup}>
            <UserBar user={user} isLoading={isLoadingUser} />
            <span className={css.divider} aria-hidden="true" />
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className={css.desktopAuth}>
          <NavLink href="/login">Log in</NavLink>
          <CtaLink href="/register">Join now</CtaLink>
        </div>
      )}
    </nav>
  );
};

export default DesktopNav;
