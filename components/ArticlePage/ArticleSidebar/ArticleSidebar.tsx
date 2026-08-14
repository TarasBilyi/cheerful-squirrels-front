import type { Article } from '@/types/article';
import AuthorInfo from './AuthorInfo/AuthorInfo';
import RecommendedList from './RecommendedList/RecommendedList';
import SaveButton from './SaveButton/SaveButton';
import css from './ArticleSidebar.module.css';

interface ArticleSidebarProps {
  article: Article;
  recommended: Article[];
}

const ArticleSidebar = ({ article, recommended }: ArticleSidebarProps) => {
  return (
    <aside className={css.sidebar}>
      <div className={css.card}>
        <AuthorInfo owner={article.ownerId} date={article.date} />
        <RecommendedList articles={recommended} />
      </div>

      <SaveButton articleId={article._id} />
    </aside>
  );
};

export default ArticleSidebar;
