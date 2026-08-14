import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatDate';
import type { ArticleOwner } from '@/types/article';
import css from './AuthorInfo.module.css';

interface AuthorInfoProps {
  owner: string | ArticleOwner;
  date: string;
}

const AuthorInfo = ({ owner, date }: AuthorInfoProps) => {
  // GET /articles/:articleId populates ownerId into a full ArticleOwner
  // object; some other endpoints only return the raw id string.
  const isPopulated = typeof owner !== 'string';
  const authorName = isPopulated ? owner.name : null;
  const authorId = isPopulated ? owner._id : owner;

  return (
    <div className={css.wrapper}>
      <p className={css.row}>
        <span className={css.label}>Author:</span>{' '}
        {authorName ? (
          // TODO: /authors/[id] page doesn't exist yet, only the nav link does
          <Link
            href={`/authors/${authorId}`}
            prefetch={false}
            className={css.authorLink}
          >
            {authorName}
          </Link>
        ) : (
          '—'
        )}
      </p>

      <p className={css.row}>
        <span className={css.label}>Publication date:</span>{' '}
        {formatDate(date)}
      </p>
    </div>
  );
};

export default AuthorInfo;
