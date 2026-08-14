import Link from 'next/link';
import type { Article } from '@/types/article';
import css from './RecommendedCard.module.css';

interface RecommendedCardProps {
  article: Article;
}

const getAuthorName = (ownerId: Article['ownerId']) =>
  typeof ownerId === 'string' ? null : ownerId.name;

const RecommendedCard = ({ article }: RecommendedCardProps) => {
  const authorName = getAuthorName(article.ownerId);

  return (
    <li className={css.card}>
      <div className={css.text}>
        <p className={css.title}>{article.title}</p>
        {/*
          TODO(backend): GET /articles (list) doesn't populate `ownerId`, so
          authorName is null in practice today. Falling back to a placeholder
          until the list endpoint returns { _id, name, avatarUrl } like
          GET /articles/:id already does.
        */}
        <p className={css.author}>{authorName ?? '—'}</p>
      </div>

      <Link
        href={`/articles/${article._id}`}
        prefetch={false}
        className={css.linkButton}
        aria-label={`Read article: ${article.title}`}
      >
        <svg className={css.icon} aria-hidden>
          <use href="/icons/sprite.svg#arrow-right" />
        </svg>
      </Link>
    </li>
  );
};

export default RecommendedCard;
