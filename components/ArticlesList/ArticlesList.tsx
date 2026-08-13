import ArticlesItem from '@/components/ArticlesItem/ArticlesItem';
import type { Article } from '@/lib/api/articles';

import css from './ArticlesList.module.css';

interface ArticlesListProps {
  articles: Article[];
}

const ArticlesList = ({ articles }: ArticlesListProps) => {
  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <ul className={css.list}>
      {articles.map(article => (
        <ArticlesItem
          key={article._id}
          article={article}
        />
      ))}
    </ul>
  );
};

export default ArticlesList;