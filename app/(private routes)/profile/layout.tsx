'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Container from '@/components/Container/Container';
import AuthorInfo from '@/components/AuthorPage/AuthorInfo';
import ProfileTabs from '@/components/ProfilePage/ProfileTabs';
import RequireAuth from '@/components/RequireAuth/RequireAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { useModalStore } from '@/lib/store/useModalStore';
import { getCurrentUser } from '@/lib/api/clientApi';
import css from '@/components/ProfilePage/ProfilePage.module.css';

interface ProfileLayoutProps {
  children: React.ReactNode;
  myArticles: React.ReactNode;
  savedArticles: React.ReactNode;
  subscriptions: React.ReactNode;
}

const ProfileLayout = ({
  children,
  myArticles,
  savedArticles,
  subscriptions,
}: ProfileLayoutProps) => {
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const openModal = useModalStore(state => state.openModal);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <RequireAuth>
      {user && (
        <main className={css.main}>
          <Container>
            <h1 className={css.title}>My Profile</h1>
            <AuthorInfo
              author={{
                ...user,
                articlesAmount:
                  pathname === '/profile/saved'
                    ? user.savedArticles.length
                    : pathname === '/profile/subscriptions'
                      ? (user.subscriptions?.length ?? 0)
                      : (user.articlesAmount ?? 0),
              }}
              headingLevel="h2"
              onEdit={() => openModal('user-profile')}
              countLabel={pathname === '/profile/subscriptions' ? 'authors' : 'articles'}
            />
            <ProfileTabs />
            {children}
            {myArticles}
            {savedArticles}
            {subscriptions}
          </Container>
        </main>
      )}
    </RequireAuth>
  );
};

export default ProfileLayout;