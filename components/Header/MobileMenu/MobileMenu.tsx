'use client';

import { useEffect } from 'react';
import type { User } from '@/types/user';
import { NAV_LINKS } from '../Header.constants';
import BurgerButton from '../BurgerButton/BurgerButton';
import NavLink from '../NavLink/NavLink';
import CtaLink from '../CtaLink/CtaLink';
import UserBar from '../UserBar/UserBar';
import LogoutButton from '../LogoutButton/LogoutButton';
import css from './MobileMenu.module.css';

interface MobileMenuProps {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  user: User | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const MobileMenu = ({
  isAuthenticated,
  isLoadingUser,
  user,
  isOpen,
  onToggle,
  onClose,
}: MobileMenuProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div className={css.wrapper}>
      <BurgerButton isOpen={isOpen} onClick={onToggle} />

      <div className={`${css.panel} ${isOpen ? css.panelOpen : ''}`} aria-hidden={!isOpen}>
        <nav className={css.nav} aria-label="Mobile">
          <ul className={css.navList}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href} onClick={onClose} tabIndex={isOpen ? undefined : -1}>
                  {label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <NavLink href="/profile" onClick={onClose} tabIndex={isOpen ? undefined : -1}>
                  My Profile
                </NavLink>
              </li>
            )}
          </ul>

          {isAuthenticated ? (
            <>
              <CtaLink
                href="/articles/new"
                className={css.mobileOnly}
                onClick={onClose}
                tabIndex={isOpen ? undefined : -1}
              >
                Create an article
              </CtaLink>
              <div className={css.accountRow}>
                <UserBar user={user} isLoading={isLoadingUser} onBeforeOpen={onClose} />
                <LogoutButton onBeforeOpen={onClose} />
              </div>
            </>
          ) : (
            <>
              <NavLink href="/login" onClick={onClose} tabIndex={isOpen ? undefined : -1}>
                Log in
              </NavLink>
              <CtaLink
                href="/register"
                className={css.mobileOnly}
                onClick={onClose}
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
