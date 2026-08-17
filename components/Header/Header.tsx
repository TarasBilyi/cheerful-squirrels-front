import { cookies } from 'next/headers';
import Link from 'next/link';
import Container from '../Container/Container';
import Logo from '../Logo/Logo';
import HeaderActions from './HeaderActions/HeaderActions';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import css from './Header.module.css';

const Header = async () => {
  const cookieStore = await cookies();
  const initialIsAuthenticated = cookieStore.get('hasSession')?.value === '1';

  return (
    <header className={css.header}>
      <Container className={css.topBar}>
        <Link href="/" className={css.logoLink}>
          <Logo />
        </Link>

        <div className={css.right}>
          <ThemeToggle />
          <HeaderActions initialIsAuthenticated={initialIsAuthenticated} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
