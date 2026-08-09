import Link from 'next/link';
import { NAV_LINKS } from '../Header.constants';
import css from '../Header.module.css';

interface DesktopNavProps {
  isAuthenticated: boolean;
  user: { name: string };
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

      {isAuthenticated ? (
        <div className={css.desktopAuth}>
          <Link href="/articles/new" prefetch={false} className={css.ctaButton}>
            Create an article
          </Link>
          <div className={css.userBar}>
            <span className={css.avatar} aria-hidden />
            <span className={css.userName}>{user.name}</span>
            <span className={css.divider} aria-hidden />
            {/* TODO: логаут потребує клієнтської дії (стору) —
                винести в маленький client-компонент LogoutButton, коли буде готовий auth-store */}
            <button type="button" className={css.iconButton} aria-label="Log out">
              <svg width="32" height="32" className={css.burgerIcon} aria-hidden="true" role="img">
                <use href="/icons/sprite.svg#icon-logout"></use>
              </svg>
            </button>
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
