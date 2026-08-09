import Link from 'next/link';
import type { User } from '@/types/user';
import { NAV_LINKS } from '../Header.constants';
import LogoutButton from '../MobileMenu/LogoutButton';
import css from '../Header.module.css';

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
            <Link href={href} prefetch={false} className={css.navLink}>
              {label}
            </Link>
          </li>
        ))}
        {isAuthenticated && (
          <li>
            <Link href="/profile" prefetch={false} className={css.navLink}>
              My Profile
            </Link>
          </li>
        )}
      </ul>

      {isAuthenticated && user ? (
        <div className={css.desktopAuth}>
          <Link href="/articles/new" prefetch={false} className={css.ctaButton}>
            Create an article
          </Link>
          <div className={css.userBar}>
            <span className={css.avatar} aria-hidden />
            <span className={css.userName}>{user.name}</span>
            <span className={css.divider} aria-hidden />
            <LogoutButton className={css.iconButton} />
          </div>
        </div>
      ) : (
        <div className={css.desktopAuth}>
          <Link href="/login" prefetch={false} className={css.navLink}>
            Log in
          </Link>
          <Link href="/register" prefetch={false} className={css.ctaButton}>
            Join now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default DesktopNav;
