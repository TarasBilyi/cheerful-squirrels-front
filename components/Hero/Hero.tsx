'use client';

import Link from 'next/link';
import Container from '@/components/Container/Container';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './Hero.module.css';

export default function Hero() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitializing = useAuthStore(state => state.isInitializing);

  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.imageWrapper}></div>

          <div className={styles.content}>
            <h1 className={styles.title}>
              Find your <span>harmony</span> in community
            </h1>

            <div className={styles.buttons}>
              <Link href="/articles" className={styles.articlesButton}>
                Go to Articles
              </Link>

              {!isInitializing && !isAuthenticated && (
                <Link href="/register" className={styles.registerButton}>
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
