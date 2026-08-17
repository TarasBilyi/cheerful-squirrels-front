'use client';

import Link from 'next/link';
import type { Article } from '@/types/article';
import styles from './EditArticleButton.module.css';

interface EditArticleButtonProps {
  article: Article;
}

const EditArticleButton = ({ article }: EditArticleButtonProps) => (
  <Link
    href={`/articles/${article._id}/edit`}
    className={styles.button}
    aria-label="Edit article"
  >
    <svg className={styles.icon} width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <use href="/icons/sprite.svg#edit" />
    </svg>
  </Link>
);

export default EditArticleButton;
