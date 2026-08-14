'use client';

import { useAuthStore } from '@/lib/store/authStore';
import CtaLink from '../CtaLink/CtaLink';
import DesktopNav from '../DesktopNav/DesktopNav';
import MobileMenu from '../MobileMenu/MobileMenu';
import css from '../Header.module.css';

const HeaderActions = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  return (
    <div className={`${css.actions} ${isAuthenticated ? css.actionsAuthenticated : ''}`}>
      <CtaLink href={isAuthenticated ? '/articles/new' : '/register'} className={css.tabletOnly}>
        {isAuthenticated ? 'Create an article' : 'Join now'}
      </CtaLink>

      <DesktopNav isAuthenticated={isAuthenticated} user={user} />
      <MobileMenu isAuthenticated={isAuthenticated} user={user} />
    </div>
  );
};

export default HeaderActions;
