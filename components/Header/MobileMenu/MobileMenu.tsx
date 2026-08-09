'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from '../../Container/Container';
import Logo from '../../Logo/Logo';
import type { User } from '@/types/user';
import { NAV_LINKS } from '../Header.constants';
import LogoutButton from './LogoutButton';
import headerCss from '../Header.module.css';
import css from './MobileMenu.module.css';

interface MobileMenuProps {
  isAuthenticated: boolean;
  user: User | null;
}

const MobileMenu = ({ isAuthenticated, user }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={headerCss.burgerButton}
        onClick={toggle}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        бургер
      </button>

      <div className={`${css.menu} ${isOpen ? css.menuOpen : ''}`} aria-hidden={!isOpen}>
        <Container className={css.topBar}>
          <Link href="/" className={headerCss.logoLink} onClick={close}>
            <Logo />
          </Link>
          <button type="button" className={css.closeButton} onClick={close} aria-label="Close menu">
            закрити
          </button>
        </Container>

        <nav className={css.nav} aria-label="Mobile">
          <ul className={css.navList}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} prefetch={false} className={headerCss.navLink} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <Link
                  href="/profile"
                  prefetch={false}
                  className={headerCss.navLink}
                  onClick={close}
                >
                  My Profile
                </Link>
              </li>
            )}
          </ul>

          {isAuthenticated && user ? (
            <>
              <Link
                href="/articles/new"
                prefetch={false}
                className={headerCss.ctaButton}
                onClick={close}
              >
                Create an article
              </Link>
              <div className={headerCss.userBar}>
                <span className={headerCss.avatar} aria-hidden />
                <span className={headerCss.userName}>{user.name}</span>
                <span className={headerCss.divider} aria-hidden />
                <LogoutButton className={headerCss.iconButton} onAfterLogout={close} />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" prefetch={false} className={headerCss.navLink} onClick={close}>
                Log in
              </Link>
              <Link
                href="/register"
                prefetch={false}
                className={headerCss.ctaButton}
                onClick={close}
              >
                Join now
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
