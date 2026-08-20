'use client';

import PaginatedArticlesList from '@/components/PaginatedArticlesList/PaginatedArticlesList';
import { getArticlesByAuthor } from '@/lib/api/authorsApi';
import type { Article } from '@/types/article';

interface AuthorArticlesProps {
  authorId: string;
  initialArticles: Article[];
  initialPage: number;
  initialTotalPages: number;
}

const AuthorArticles = ({
  authorId,
  initialArticles,
  initialPage,
  initialTotalPages,
}: AuthorArticlesProps) => (
  <PaginatedArticlesList
    initialArticles={initialArticles}
    initialPage={initialPage}
    initialTotalPages={initialTotalPages}
    fetchPage={(page, perPage) => getArticlesByAuthor(authorId, page, perPage)}
    pageParam="page"
  />
);

export default AuthorArticles;
