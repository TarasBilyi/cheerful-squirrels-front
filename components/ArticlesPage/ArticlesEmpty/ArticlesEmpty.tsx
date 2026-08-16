import Link from 'next/link';

import css from './ArticlesEmpty.module.css';

const ArticlesEmpty = () => {
  return (
    <div className={css.empty}>
      <svg className={css.icon}>
        <use href="/icons/sprite.svg#warning-circle" />
      </svg>

      <h2 className={css.title}>Nothing found.</h2>

      <p className={css.text}>
        Be the first, who create an article
      </p>

      <Link href="/articles/create" className={css.button}>
        Create an article
      </Link>
    </div>
  );
};

export default ArticlesEmpty;