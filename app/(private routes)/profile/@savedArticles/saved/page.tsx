'use client';

import { Suspense } from 'react';
import PaginatedArticlesList from '@/components/PaginatedArticlesList/PaginatedArticlesList';
import EmptyState from '@/components/EmptyState/EmptyState';
import { getSavedArticles } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const SavedArticlesTabContent = () => {
  const savedCount = useAuthStore(state => state.user?.savedArticles.length ?? 0);
  return (
    <PaginatedArticlesList
      key={savedCount}
      fetchPage={(page, perPage) => getSavedArticles(page, perPage)}
      emptyState={
        <EmptyState
          description="Save your first article"
          buttonText="Go to articles"
          href="/articles"
        />
      }
    />
  );
};

const SavedArticlesTab = () => (
  <Suspense fallback={null}>
    <SavedArticlesTabContent />
  </Suspense>
);

export default SavedArticlesTab;
