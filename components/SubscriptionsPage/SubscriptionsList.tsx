'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import EmptyState from '@/components/EmptyState/EmptyState';
import LoadMoreButton from '@/components/LoadMoreButton/LoadMoreButton';
import Pagination from '@/components/Pagination/Pagination';
import { getSubscribedAuthors } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useLoaderStore } from '@/lib/store/loaderStore';
import type { ApiError } from '@/lib/api/api';
import type { Author } from '@/types/author';
import css from './SubscriptionsList.module.css';

const PER_PAGE = 20;

interface SubscriptionsItemProps {
  author: Author;
}

const SubscriptionsItem = ({ author }: SubscriptionsItemProps) => {
  const initial = author.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <li className={css.item}>
      <Link href={`/authors/${author._id}`} prefetch={false} className={css.card}>
        {author.avatarUrl ? (
          <div className={css.avatar}>
            <Image
              src={author.avatarUrl}
              alt={author.name}
              fill
              unoptimized
              className={css.image}
            />
          </div>
        ) : (
          <span className={css.avatar} aria-hidden>
            {initial}
          </span>
        )}

        <p className={css.name}>{author.name}</p>
      </Link>
    </li>
  );
};

const SubscriptionsList = () => {
  const subscriptionsCount = useAuthStore(state => state.user?.subscriptions?.length ?? 0);
  const setLoading = useLoaderStore(state => state.setLoading);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setHasLoaded(false);
        setIsLoading(true);
        setLoading(true);

        const { authors: fetched, pagination } = await getSubscribedAuthors(1, PER_PAGE);

        if (cancelled) return;

        setAuthors(fetched);
        setPage(pagination.page);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        if (cancelled) return;

        toast.error(
          (error as ApiError).response?.data?.error ?? 'Failed to load subscriptions'
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setLoading(false);
          setHasLoaded(true);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [subscriptionsCount, setLoading]);

  const handleLoadMore = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      const { authors: next, pagination } = await getSubscribedAuthors(page + 1, PER_PAGE);

      setAuthors(prev => [...prev, ...next]);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      toast.error(
        (error as ApiError).response?.data?.error ?? 'Failed to load more subscriptions'
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handlePageChange = async (selectedPage: number) => {
    try {
      setIsLoading(true);
      setLoading(true);

      const { authors: fetched, pagination } = await getSubscribedAuthors(selectedPage, PER_PAGE);

      setAuthors(fetched);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      toast.error(
        (error as ApiError).response?.data?.error ?? 'Failed to load subscriptions'
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  if (!hasLoaded) {
    return null;
  }

  if (authors.length === 0) {
    return (
      <EmptyState
        description="Subscribe to an author to see them here"
        buttonText="Browse authors"
        href="/authors"
      />
    );
  }

  const hasMore = page < totalPages;

  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {authors.map(author => (
          <SubscriptionsItem key={author._id} author={author} />
        ))}
      </ul>

      {hasMore && (
        <div className={css.loadMoreOnly}>
          <LoadMoreButton onClick={handleLoadMore} disabled={isLoading} />
        </div>
      )}

      {totalPages > 1 && (
        <div className={css.paginationOnly}>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default SubscriptionsList;
