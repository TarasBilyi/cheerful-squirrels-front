import Link from 'next/link';
import Container from '../Container/Container';
import Logo from '../Logo/Logo';
import FooterAccountLink from './FooterAccountLink/FooterAccountLink';
import css from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <Container className={css.wrapper}>
        <Link href="/">
          <Logo />
        </Link>
        <p className={css.copy}>&copy; 2026 Harmoniq. All rights reserved.</p>
        <ul className={css.nav}>
          <li>
            <Link href="/articles" className={css.link}>
              Articles
            </Link>
          </li>
          <li>
            <FooterAccountLink />
          </li>
        </ul>
      </Container>
    </footer>
  );
};

export default Footer;
