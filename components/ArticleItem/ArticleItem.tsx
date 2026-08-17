import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/article';
import ButtonAddToBookmarks from '@/components/ButtonAddToBookmarks/ButtonAddToBookmarks';
import DeleteArticleButton from '@/components/DeleteArticleButton/DeleteArticleButton';
import EditArticleButton from '@/components/EditArticleButton/EditArticleButton';
import styles from './ArticleItem.module.css';

interface ArticleItemProps {
  article: Article;
  onDeleted?: (articleId: string) => void;
  editable?: boolean;
}

const getAuthorName = (ownerId: Article['ownerId']) => {
  const fullName = typeof ownerId === 'string' ? null : ownerId?.name;
  return fullName?.split(' ')[0] ?? null;
};

const ArticleItem = ({ article, onDeleted, editable }: ArticleItemProps) => {
  const authorName = getAuthorName(article.ownerId);

  return (
    <li className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={article.img}
          alt={article.title}
          fill
          sizes="(max-width: 767px) min(calc(100vw - 56px), 337px), (max-width: 1439px) 316px, 368px"
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        {authorName && <p className={styles.author}>{authorName}</p>}

        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{article.title}</h3>
        </div>

        {article.desc && <p className={styles.desc}>{article.desc}</p>}
      </div>

      <div className={styles.actions}>
        <Link href={`/articles/${article._id}`} className={styles.learnMore}>
          Learn more
        </Link>

        {editable ? (
          <EditArticleButton article={article} />
        ) : (
          <ButtonAddToBookmarks articleId={article._id} />
        )}

        {onDeleted && <DeleteArticleButton articleId={article._id} onDeleted={onDeleted} />}
      </div>
    </li>
  );
};

export default ArticleItem;
