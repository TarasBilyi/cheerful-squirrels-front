'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import LoadMoreButton from '@/components/LoadMoreButton/LoadMoreButton';
import Pagination from '@/components/Pagination/Pagination';
import { ApiError } from '@/lib/api/api';
import { useLoaderStore } from '@/lib/store/loaderStore';
import type { Article } from '@/types/article';
import css from './PaginatedArticlesList.module.css';

interface ArticlesPage {
  articles: Article[];
  pagination: { page: number; totalPages: number; totalItems?: number };
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
  /**
   * When set, the current page number is kept in sync with this URL query
   * parameter. This makes it possible for the browser "back" button to
   * restore the exact page the user was on (instead of resetting to page 1)
   * after they open an article and navigate back. Omit it when several
   * instances of this list can be mounted at the same time (e.g. parallel
   * routes/tabs) to avoid them fighting over the same query param.
   */
  pageParam?: string;
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
  pageParam,
}: PaginatedArticlesListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageFromUrl = pageParam ? Number(searchParams.get(pageParam)) || 0 : 0;

  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useLoaderStore(state => state.setLoading);

  const requestIdRef = useRef(0);
  const didInitRef = useRef(false);
  const previousScrollRef = useRef(0);

  const hasMore = page < totalPages;

  useEffect(() => {
    if (previousScrollRef.current) {
      window.scrollTo({ top: previousScrollRef.current });
      previousScrollRef.current = 0;
    }
  }, [articles]);

  const syncUrl = (targetPage: number) => {
    if (!pageParam) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, String(targetPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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

      if (mode === 'replace') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
    if (didInitRef.current) return;
    didInitRef.current = true;

    const timeoutId = window.setTimeout(() => {
      if (initialPage === 0) {
        void load(1, 'replace');
        return;
      }

      if (pageParam && pageFromUrl > initialPage) {
        void (async () => {
          const requestId = ++requestIdRef.current;
          try {
            setIsLoading(true);
            setLoading(true);

            const data = await fetchPage(1, perPage * pageFromUrl);

            if (requestIdRef.current !== requestId) return;

            setArticles(data.articles);
            setPage(pageFromUrl);
            setTotalPages(
              typeof data.pagination.totalItems === 'number'
                ? Math.ceil(data.pagination.totalItems / perPage)
                : data.pagination.totalPages
            );
          } catch {
          } finally {
            if (requestIdRef.current === requestId) {
              setIsLoading(false);
              setLoading(false);
            }
          }
        })();
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <LoadMoreButton
            onClick={() => {
              previousScrollRef.current = window.scrollY;
              const nextPage = page + 1;
              syncUrl(nextPage);
              load(nextPage, 'append');
            }}
            disabled={isLoading}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className={css.paginationOnly}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={selectedPage => {
              syncUrl(selectedPage);
              load(selectedPage, 'replace');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedArticlesList;
