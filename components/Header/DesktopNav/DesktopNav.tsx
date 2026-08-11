import Link from 'next/link';
import type { User } from '@/types/user';
import { NAV_LINKS } from '../Header.constants';
import NavLink from '../NavLink/NavLink';
import navLinkCss from '../NavLink/NavLink.module.css';
import CtaLink from '../CtaLink/CtaLink';
import UserBar from '../UserBar/UserBar';
import css from './DesktopNav.module.css';

interface DesktopNavProps {
  isAuthenticated: boolean;
  user: User | null;
}

const DesktopNav = ({ isAuthenticated, user }: DesktopNavProps) => {
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

      {isAuthenticated && user ? (
        <div className={`${css.desktopAuth} ${css.desktopAuthAuthenticated}`}>
          <CtaLink href="/articles/new">Create an article</CtaLink>
          <UserBar user={user} />
        </div>
      ) : (
        <div className={css.desktopAuth}>
          <Link href="/login" prefetch={false} className={navLinkCss.navLink}>
            Log in
          </Link>
          <CtaLink href="/register">Join now</CtaLink>
        </div>
      )}
    </nav>
  );
};

export default DesktopNav;
