'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import CtaLink from '../CtaLink/CtaLink';
import DesktopNav from '../DesktopNav/DesktopNav';
import MobileMenu from '../MobileMenu/MobileMenu';
import css from '../Header.module.css';

interface HeaderActionsProps {
  initialIsAuthenticated: boolean;
}

const HeaderActions = ({ initialIsAuthenticated }: HeaderActionsProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitializing = useAuthStore(state => state.isInitializing);
  const user = useAuthStore(state => state.user);

  const displayIsAuthenticated = isInitializing ? initialIsAuthenticated : isAuthenticated;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setIsMenuOpen(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  return (
    <div className={`${css.actions} ${displayIsAuthenticated ? css.actionsAuthenticated : ''}`}>
      <CtaLink
        href={displayIsAuthenticated ? '/articles/new' : '/register'}
        className={css.tabletOnly}
        onClick={closeMenu}
      >
        {displayIsAuthenticated ? 'Create an article' : 'Join now'}
      </CtaLink>

      <DesktopNav
        isAuthenticated={displayIsAuthenticated}
        isLoadingUser={isInitializing}
        user={user}
      />
      <MobileMenu
        isAuthenticated={displayIsAuthenticated}
        isLoadingUser={isInitializing}
        user={user}
        isOpen={isMenuOpen}
        onToggle={toggleMenu}
        onClose={closeMenu}
      />
    </div>
  );
};

export default HeaderActions;
