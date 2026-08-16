'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Container from '@/components/Container/Container';
import AuthorInfo from '@/components/AuthorPage/AuthorInfo';
import ProfileTabs from '@/components/ProfilePage/ProfileTabs';
import { useAuthStore } from '@/lib/store/authStore';
import { useModalStore } from '@/lib/store/useModalStore';
import css from '@/components/ProfilePage/ProfilePage.module.css';

interface ProfileLayoutProps {
  children: React.ReactNode;
  myArticles: React.ReactNode;
  savedArticles: React.ReactNode;
}

const ProfileLayout = ({ children, myArticles, savedArticles }: ProfileLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitializing = useAuthStore(state => state.isInitializing);
  const user = useAuthStore(state => state.user);
  const openModal = useModalStore(state => state.openModal);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !user) {
    return null;
  }

  const isSaved = pathname === '/profile/saved';
  const articlesAmount = isSaved ? user.savedArticles.length : (user.articlesAmount ?? 0);

  return (
    <main className={css.main}>
      <Container>
        <h1 className={css.title}>My Profile</h1>
        <AuthorInfo
          author={{ ...user, articlesAmount }}
          headingLevel="h2"
          onEdit={() => openModal('user-profile')}
        />
        <ProfileTabs />
        {children}
        {myArticles}
        {savedArticles}
      </Container>
    </main>
  );
};

export default ProfileLayout;
