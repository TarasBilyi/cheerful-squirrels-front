import type { Article, ArticleListItem } from '@/types/article';
import AuthorInfo from './AuthorInfo/AuthorInfo';
import RecommendedList from './RecommendedList/RecommendedList';
import SaveButton from './SaveButton/SaveButton';
import css from './ArticleSidebar.module.css';

interface ArticleSidebarProps {
  article: Article;
  recommended: ArticleListItem[];
  isAuthenticated: boolean;
  isSaved: boolean;
}

const ArticleSidebar = ({
  article,
  recommended,
  isAuthenticated,
  isSaved,
}: ArticleSidebarProps) => {
  return (
    <aside className={css.sidebar}>
      <div className={css.card}>
        <AuthorInfo author={article.ownerId} date={article.date} />
        <RecommendedList articles={recommended} />
      </div>

      <SaveButton
        articleId={article._id}
        initialIsSaved={isSaved}
        isAuthenticated={isAuthenticated}
      />
    </aside>
  );
};

export default ArticleSidebar;
