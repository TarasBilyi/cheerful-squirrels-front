import { getAuthors } from '@/lib/api/authorsApi';
import css from './AuthorsList.module.css';
import Link from 'next/link';
import type { Author } from '@/types/author';
import Image from 'next/image';

interface AuthorsItemProps {
  author: Author;
}

const AuthorsItem = ({ author }: AuthorsItemProps) => {
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

const AuthorsList = async () => {
  const authors = await getAuthors();

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
    </div>
  );
};
export default AuthorsList;
