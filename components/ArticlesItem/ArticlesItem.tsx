//for testing , deleted in the future

import type { Article } from '@/lib/api/articles';
import Image from 'next/image';

import css from './ArticlesItem.module.css';

interface ArticlesItemProps {
  article: Article;
}

const ArticlesItem = ({ article }: ArticlesItemProps) => {
  return (
    <li className={css.item}>
      <Image
        className={css.image}
        src={article.img}
        alt={article.title}
        width={300}
        height={200}
        unoptimized
      />

      <div className={css.content}>
        <p className={css.category}>News</p>

        <h2 className={css.title}>{article.title}</h2>

        <p className={css.description}>{article.desc}</p>

        <div className={css.bottom}>
          <button type="button" className={css.button}>
            Learn more
          </button>

          <div className={css.info}>
            <span>{article.rate}</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ArticlesItem;