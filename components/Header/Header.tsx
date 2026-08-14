import Link from 'next/link';
import Container from '../Container/Container';
import Logo from '../Logo/Logo';
import HeaderActions from './HeaderActions/HeaderActions';
import css from './Header.module.css';

const Header = () => {
  return (
    <header className={css.header}>
      <Container className={css.topBar}>
        <Link href="/" className={css.logoLink}>
          <Logo />
        </Link>

        <HeaderActions />
      </Container>
    </header>
  );
};

export default Header;
