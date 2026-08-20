'use client';

import { Suspense } from 'react';
import PaginatedArticlesList from '@/components/PaginatedArticlesList/PaginatedArticlesList';
import EmptyState from '@/components/EmptyState/EmptyState';
import { getArticlesByAuthor } from '@/lib/api/authorsApi';
import { useAuthStore } from '@/lib/store/authStore';

const MyArticlesTabContent = () => {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return null;
  }

  return (
    <PaginatedArticlesList
      fetchPage={(page, perPage) => getArticlesByAuthor(user._id, page, perPage)}
      deletable
      editable
      emptyState={
        <EmptyState
          description="Write your first article"
          buttonText="Create an article"
          href="/articles/new"
        />
      }
    />
  );
};

const MyArticlesTab = () => (
  <Suspense fallback={null}>
    <MyArticlesTabContent />
  </Suspense>
);

export default MyArticlesTab;
