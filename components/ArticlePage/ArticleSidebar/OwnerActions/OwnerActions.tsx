'use client';

import { useRouter } from 'next/navigation';
import type { Article } from '@/types/article';
import EditArticleButton from '@/components/EditArticleButton/EditArticleButton';
import DeleteArticleButton from '@/components/DeleteArticleButton/DeleteArticleButton';
import css from './OwnerActions.module.css';

interface OwnerActionsProps {
  article: Article;
}

const OwnerActions = ({ article }: OwnerActionsProps) => {
  const router = useRouter();

  return (
    <div className={css.actions}>
      <EditArticleButton article={article} variant="text" />
      <DeleteArticleButton
        articleId={article._id}
        variant="text"
        onDeleted={() => router.push('/profile')}
      />
    </div>
  );
};

export default OwnerActions;
