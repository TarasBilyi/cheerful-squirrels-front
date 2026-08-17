'use client';

import { usePathname } from 'next/navigation';
import Container from '@/components/Container/Container';
import AuthorInfo from '@/components/AuthorPage/AuthorInfo';
import ProfileTabs from '@/components/ProfilePage/ProfileTabs';
import RequireAuth from '@/components/RequireAuth/RequireAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { useModalStore } from '@/lib/store/useModalStore';
import css from '@/components/ProfilePage/ProfilePage.module.css';

interface ProfileLayoutProps {
  children: React.ReactNode;
  myArticles: React.ReactNode;
  savedArticles: React.ReactNode;
}

const ProfileLayout = ({ children, myArticles, savedArticles }: ProfileLayoutProps) => {
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  const openModal = useModalStore(state => state.openModal);

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
                    : (user.articlesAmount ?? 0),
              }}
              headingLevel="h2"
              onEdit={() => openModal('user-profile')}
            />
            <ProfileTabs />
            {children}
            {myArticles}
            {savedArticles}
          </Container>
        </main>
      )}
    </RequireAuth>
  );
};

export default ProfileLayout;