import Link from 'next/link';
import type { ArticleListItem } from '@/types/article';
import css from './RecommendedCard.module.css';

interface RecommendedCardProps {
  article: ArticleListItem;
}

const RecommendedCard = ({ article }: RecommendedCardProps) => {
  return (
    <li className={css.card}>
      <div className={css.text}>
        <p className={css.title}>{article.title}</p>
        {/*
          TODO(backend): GET /articles (list) doesn't populate `ownerId`, so we
          don't have the author's name here — only their id. Falling back to a
          placeholder until the list endpoint returns { _id, name, avatarUrl }
          like GET /articles/:id already does.
        */}
        <p className={css.author}>—</p>
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
