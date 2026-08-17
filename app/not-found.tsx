import { Metadata } from 'next';
import css from './page.module.css';
import Container from '@/components/Container/Container';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page not found',
    description: 'Sorry, the page you are looking for does not exist.',
    url: `${SITE_URL}/404`,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: '404 - Page not found',
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const NotFound = () => {
  return (
    <Container className={css.wrapper}>
      <h1 className={css.title}>404 - Page not found!</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </Container>
  );
};

export default NotFound;
