'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import LoadMoreButton from '@/components/LoadMoreButton/LoadMoreButton';
import Pagination from '@/components/Pagination/Pagination';
import { ApiError } from '@/app/api/api';
import { useLoaderStore } from '@/lib/store/loaderStore';
import type { Article } from '@/types/article';
import css from './PaginatedArticlesList.module.css';

interface ArticlesPage {
  articles: Article[];
  pagination: { page: number; totalPages: number };
}

interface PaginatedArticlesListProps {
  fetchPage: (page: number, perPage: number) => Promise<ArticlesPage>;
  initialArticles?: Article[];
  initialPage?: number;
  initialTotalPages?: number;
  perPage?: number;
  emptyState?: React.ReactNode;
  deletable?: boolean;
  editable?: boolean;
}

const PaginatedArticlesList = ({
  fetchPage,
  initialArticles = [],
  initialPage = 0,
  initialTotalPages = 0,
  perPage = 12,
  emptyState,
  deletable = false,
  editable = false,
}: PaginatedArticlesListProps) => {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useLoaderStore(state => state.setLoading);

  const requestIdRef = useRef(0);

  const hasMore = page < totalPages;

  const load = async (targetPage: number, mode: 'append' | 'replace') => {
    const requestId = ++requestIdRef.current;

    try {
      setIsLoading(true);
      setLoading(true);

      const data = await fetchPage(targetPage, perPage);

      if (requestIdRef.current !== requestId) {
        return;
      }

      setArticles(prev => (mode === 'append' ? [...prev, ...data.articles] : data.articles));
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Не вдалося завантажити статті'
      );
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initialPage !== 0) return;

    const timeoutId = setTimeout(() => {
      void load(1, 'replace');
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [initialPage]);

  const handleArticleDeleted = (articleId: string) => {
    setArticles(prev => prev.filter(article => article._id !== articleId));
  };

  if (emptyState && page > 0 && articles.length === 0) {
    return emptyState;
  }

  return (
    <div>
      <ArticlesList
        articles={articles}
        onDeleted={deletable ? handleArticleDeleted : undefined}
        editable={editable}
      />

      {hasMore && (
        <div className={css.loadMoreOnly}>
          <LoadMoreButton onClick={() => load(page + 1, 'append')} disabled={isLoading} />
        </div>
      )}

      {totalPages > 1 && (
        <div className={css.paginationOnly}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={selectedPage => load(selectedPage, 'replace')}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedArticlesList;
