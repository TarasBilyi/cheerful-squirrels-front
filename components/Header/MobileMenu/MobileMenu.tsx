'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { User } from '@/types/user';
import { useIsClient } from '@/hooks/useIsClient';
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
  const isClient = useIsClient();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      requestAnimationFrame(() => {
        burgerRef.current?.focus();
      });
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const panel = (
    <div
      id="mobile-menu"
      className={`${css.panel} ${isOpen ? css.panelOpen : ''}`}
      aria-hidden={!isOpen}

      {...(!isOpen ? { inert: true } : {})}
    >
      <nav className={css.nav} aria-label="Mobile">
        <div className={css.navInner}>
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
        </div>
      </nav>
    </div>
  );

  return (
    <div className={css.wrapper}>
      <BurgerButton ref={burgerRef} isOpen={isOpen} onClick={onToggle} />
      {isClient && createPortal(panel, document.body)}
    </div>
  );
};

export default MobileMenu;
