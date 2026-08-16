import Link from 'next/link';
import css from './ArticlesEmpty.module.css';

interface ArticlesEmptyProps {
  text: string;
  buttonText: string;
  href: string;
}

const ArticlesEmpty = ({
  text,
  buttonText,
  href,
}: ArticlesEmptyProps) => {
  return (
    <div className={css.empty}>
      <svg className={css.icon}>
        <use href="/icons/sprite.svg#warning-circle" />
      </svg>

      <h2 className={css.title}>No articles found.</h2>

      <p className={css.text}>{text}</p>

      <Link href={href} className={css.button}>
        {buttonText}
      </Link>
    </div>
  );
};

export default ArticlesEmpty;