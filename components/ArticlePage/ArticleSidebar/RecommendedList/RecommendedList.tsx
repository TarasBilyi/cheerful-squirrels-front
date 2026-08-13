import type { ArticleListItem } from '@/types/article';
import RecommendedCard from './RecommendedCard/RecommendedCard';
import css from './RecommendedList.module.css';

interface RecommendedListProps {
  articles: ArticleListItem[];
}

const RecommendedList = ({ articles }: RecommendedListProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={css.wrapper}>
      <h2 className={css.heading}>You can also interested</h2>

      <ul className={css.list}>
        {articles.map(article => (
          <RecommendedCard key={article._id} article={article} />
        ))}
      </ul>
    </div>
  );
};

export default RecommendedList;
