import Link from 'next/link';
import type { Author } from '@/types/author';
import css from './AuthorsItem.module.css';
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
          <div className={css.avatarWrapper}>
            <Image
              src={author.avatarUrl}
              alt={author.name}
              fill
              unoptimized
              className={css.avatar}
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

export default AuthorsItem;
