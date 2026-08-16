'use client';

import PaginatedArticlesList from '@/components/PaginatedArticlesList/PaginatedArticlesList';
import EmptyState from '@/components/EmptyState/EmptyState';
import { getArticlesByAuthor } from '@/lib/api/authorsApi';
import { useAuthStore } from '@/lib/store/authStore';

const MyArticlesTab = () => {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return null;
  }

  return (
    <PaginatedArticlesList
      fetchPage={(page, perPage) => getArticlesByAuthor(user._id, page, perPage)}
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

export default MyArticlesTab;
