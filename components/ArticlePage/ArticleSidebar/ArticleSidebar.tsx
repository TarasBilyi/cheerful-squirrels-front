'use client';

import type { Article } from '@/types/article';
import { useAuthStore } from '@/lib/store/authStore';
import AuthorInfo from './AuthorInfo/AuthorInfo';
import RecommendedList from './RecommendedList/RecommendedList';
import SaveButton from './SaveButton/SaveButton';
import OwnerActions from './OwnerActions/OwnerActions';
import css from './ArticleSidebar.module.css';

interface ArticleSidebarProps {
  article: Article;
  recommended: Article[];
}

const getOwnerId = (ownerId: Article['ownerId']) =>
  typeof ownerId === 'string' ? ownerId : ownerId._id;

const ArticleSidebar = ({ article, recommended }: ArticleSidebarProps) => {
  const currentUserId = useAuthStore(state => state.user?._id);
  const isOwner = Boolean(currentUserId) && currentUserId === getOwnerId(article.ownerId);

  return (
    <aside className={css.sidebar}>
      <div className={css.card}>
        <AuthorInfo owner={article.ownerId} date={article.date} />
        <RecommendedList articles={recommended} />
      </div>

      {isOwner ? <OwnerActions article={article} /> : <SaveButton articleId={article._id} />}
    </aside>
  );
};

export default ArticleSidebar;
