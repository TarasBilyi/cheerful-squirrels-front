'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import LoadMoreButton from '@/components/LoadMoreButton/LoadMoreButton';
import Pagination from '@/components/Pagination/Pagination';
import { getAuthors } from '@/lib/api/authorsApi';
import { useLoaderStore } from '@/lib/store/loaderStore';
import type { ApiError } from '@/lib/api/api';
import type { Author } from '@/types/author';
import css from './AuthorsList.module.css';

const PER_PAGE = 20;

interface AuthorsItemProps {
  author: Author;
}

export const AuthorsItem = ({ author }: AuthorsItemProps) => {
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

        <p className={css.name}>{author.name?.split(' ')[0]}</p>
      </Link>
    </li>
  );
};

interface AuthorsListProps {
  initialAuthors: Author[];
  initialPage: number;
  initialTotalPages: number;
}

const AuthorsList = ({ initialAuthors, initialPage, initialTotalPages }: AuthorsListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get('page')) || initialPage;

  const [authors, setAuthors] = useState(initialAuthors);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = useLoaderStore(state => state.setLoading);

  const requestIdRef = useRef(0);
  const didRestoreRef = useRef(false);
  const previousScrollRef = useRef(0);

  const hasMore = page < totalPages;

  useEffect(() => {
    if (previousScrollRef.current) {
      window.scrollTo({ top: previousScrollRef.current });
      previousScrollRef.current = 0;
    }
  }, [authors]);

  useEffect(() => {
    if (didRestoreRef.current) return;
    didRestoreRef.current = true;

    if (pageFromUrl <= initialPage) return;

    const requestId = ++requestIdRef.current;

    const restore = async () => {
      try {
        setIsLoading(true);
        setLoading(true);

        const data = await getAuthors(1, PER_PAGE * pageFromUrl);

        if (requestIdRef.current !== requestId) return;

        setAuthors(data.authors);
        setPage(pageFromUrl);
        setTotalPages(Math.ceil(data.pagination.totalItems / PER_PAGE));
      } catch {
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
          setLoading(false);
        }
      }
    };

    void restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    try {
      previousScrollRef.current = window.scrollY;
      setIsLoading(true);
      setLoading(true);

      const next = await getAuthors(page + 1, PER_PAGE);

      setAuthors(prev => [...prev, ...next.authors]);
      setPage(next.pagination.page);
      setTotalPages(next.pagination.totalPages);

      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(next.pagination.page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } catch (error) {
      toast.error((error as ApiError).response?.data?.error ?? 'Failed to load more authors');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handlePageChange = async (selectedPage: number) => {
    try {
      setIsLoading(true);
      setLoading(true);

      const data = await getAuthors(selectedPage, PER_PAGE);

      setAuthors(data.authors);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);

      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(data.pagination.page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error((error as ApiError).response?.data?.error ?? 'Failed to load authors');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>Authors</h1>

      {authors.length === 0 ? (
        <p>No authors found yet.</p>
      ) : (
        <ul className={css.list}>
          {authors.map(author => (
            <AuthorsItem key={author._id} author={author} />
          ))}
        </ul>
      )}

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

export default AuthorsList;
