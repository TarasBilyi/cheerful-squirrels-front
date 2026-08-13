import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatDate';
import type { ArticleAuthor } from '@/types/article';
import css from './AuthorInfo.module.css';

interface AuthorInfoProps {
  author: ArticleAuthor;
  date: string;
}

const AuthorInfo = ({ author, date }: AuthorInfoProps) => {
  return (
    <div className={css.wrapper}>
      <p className={css.row}>
        <span className={css.label}>Author:</span>{' '}
        {/* TODO: /authors/[id] page doesn't exist yet, only the nav link does */}
        <Link
          href={`/authors/${author._id}`}
          prefetch={false}
          className={css.authorLink}
        >
          {author.name}
        </Link>
      </p>

      <p className={css.row}>
        <span className={css.label}>Publication date:</span>{' '}
        {formatDate(date)}
      </p>
    </div>
  );
};

export default AuthorInfo;
