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
      <h2 className={css.title}>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </Container>
  );
}
