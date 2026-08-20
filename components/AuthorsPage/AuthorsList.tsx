'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import LoadMoreButton from '@/components/LoadMoreButton/LoadMoreButton';
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

  // How many pages had been loaded (via "Load More") the last time the user
  // was on this listing is kept in the URL, so that pressing the browser
  // "back" button after opening an author restores the same amount of
  // authors instead of resetting back to page 1.
  const pageFromUrl = Number(searchParams.get('page')) || initialPage;

  const [authors, setAuthors] = useState(initialAuthors);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = useLoaderStore(state => state.setLoading);

  const requestIdRef = useRef(0);
  const didRestoreRef = useRef(false);

  const hasMore = page < totalPages;

  useEffect(() => {
    // On mount, if the URL says the user had already loaded further pages
    // (e.g. they came back from an author's page), fetch and rebuild the
    // full accumulated list up to that page instead of showing only page 1.
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
        // The request above used a larger perPage to fetch several pages at
        // once, so totalPages must be recalculated in terms of the normal
        // PER_PAGE page size rather than taken from the response as-is.
        setTotalPages(Math.ceil(data.pagination.totalItems / PER_PAGE));
      } catch {
        // Silently fall back to the initial page 1 list already shown.
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

      {hasMore && <LoadMoreButton onClick={handleLoadMore} disabled={isLoading} />}
    </div>
  );
};

export default AuthorsList;
