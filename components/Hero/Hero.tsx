'use client';

import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import Container from '@/components/Container/Container';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './Hero.module.css';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export default function Hero() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitializing = useAuthStore(state => state.isInitializing);

  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.wrapper}>
          <motion.div
            className={styles.imageWrapper}
            initial="hidden"
            animate="show"
            variants={imageReveal}
          />

          <motion.div
            className={styles.content}
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.h1 className={styles.title} variants={fadeUp}>
              Find your <span>harmony</span> in community
            </motion.h1>

            <motion.div className={styles.buttons} variants={fadeUp}>
              <a href="#popularArticles" className={styles.articlesButton}>
                Go to Articles
              </a>

              {!isInitializing && !isAuthenticated && (
                <Link href="/register" className={styles.registerButton}>
                  Register
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
