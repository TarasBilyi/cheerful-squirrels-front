'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@/types/user';
import { NAV_LINKS } from '../Header.constants';
import BurgerButton from '../BurgerButton/BurgerButton';
import NavLink from '../NavLink/NavLink';
import navLinkCss from '../NavLink/NavLink.module.css';
import CtaLink from '../CtaLink/CtaLink';
import UserBar from '../UserBar/UserBar';
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
    <div className={css.wrapper}>
      <BurgerButton isOpen={isOpen} onClick={toggle} />

      <div className={`${css.panel} ${isOpen ? css.panelOpen : ''}`} aria-hidden={!isOpen}>
        <nav className={css.nav} aria-label="Mobile">
          <ul className={css.navList}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href} onClick={close} tabIndex={isOpen ? undefined : -1}>
                  {label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <NavLink href="/profile" onClick={close} tabIndex={isOpen ? undefined : -1}>
                  My Profile
                </NavLink>
              </li>
            )}
          </ul>

          {isAuthenticated && user ? (
            <>
              <CtaLink
                href="/articles/new"
                className={css.mobileOnly}
                onClick={close}
                tabIndex={isOpen ? undefined : -1}
              >
                Create an article
              </CtaLink>
              <UserBar user={user} onBeforeLogoutClick={close} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                prefetch={false}
                className={`${navLinkCss.navLink} ${css.mobileOnly}`}
                onClick={close}
                tabIndex={isOpen ? undefined : -1}
              >
                Log in
              </Link>
              <CtaLink
                href="/register"
                className={css.mobileOnly}
                onClick={close}
                tabIndex={isOpen ? undefined : -1}
              >
                Join now
              </CtaLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
