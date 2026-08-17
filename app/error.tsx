'use client';

import css from './page.module.css';
import Container from '@/components/Container/Container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className={css.wrapper}>
      <h1 className={css.title}>Something went wrong</h1>
      <button className={css.errorBtn} onClick={() => reset()}>
        Try again
      </button>
    </Container>
  );
}
