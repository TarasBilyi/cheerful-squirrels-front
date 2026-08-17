'use client';

import { useState } from 'react';
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
  const [authors, setAuthors] = useState(initialAuthors);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = useLoaderStore(state => state.setLoading);

  const hasMore = page < totalPages;

  const handleLoadMore = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      const next = await getAuthors(page + 1, PER_PAGE);

      setAuthors(prev => [...prev, ...next.authors]);
      setPage(next.pagination.page);
      setTotalPages(next.pagination.totalPages);
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
