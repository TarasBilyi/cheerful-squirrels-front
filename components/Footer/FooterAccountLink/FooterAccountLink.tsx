'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import css from '../Footer.module.css';

const FooterAccountLink = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Link href={isAuthenticated ? '/profile' : '/login'} className={css.link}>
      Account
    </Link>
  );
};

export default FooterAccountLink;
