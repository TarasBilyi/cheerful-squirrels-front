import Link from 'next/link';
import Container from '../Container/Container';
import Logo from '../Logo/Logo';
import DesktopNav from './DesktopNav/DesktopNav';
import MobileMenu from './MobileMenu/MobileMenu';
import CtaLink from './CtaLink/CtaLink';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import css from './Header.module.css';

const Header = async () => {
  const { isAuthenticated, user } = await getCurrentUser();

  return (
    <header className={css.header}>
      <Container className={css.topBar}>
        <Link href="/" className={css.logoLink}>
          <Logo />
        </Link>

        <div className={`${css.actions} ${isAuthenticated ? css.actionsAuthenticated : ''}`}>
          <CtaLink
            href={isAuthenticated ? '/articles/new' : '/register'}
            className={css.tabletOnly}
          >
            {isAuthenticated ? 'Create an article' : 'Join now'}
          </CtaLink>

          <DesktopNav isAuthenticated={isAuthenticated} user={user} />

          <MobileMenu isAuthenticated={isAuthenticated} user={user} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
