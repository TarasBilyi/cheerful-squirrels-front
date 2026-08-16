import Link from 'next/link';
import css from './EmptyState.module.css';

interface EmptyStateProps {
  description: string;
  buttonText: string;
  href: string;
}

const EmptyState = ({ description, buttonText, href }: EmptyStateProps) => {
  return (
    <div className={css.card}>
      <div className={css.content}>
        <svg width="38" height="38" className={css.icon} aria-hidden>
          <use href="/icons/sprite.svg#notification" />
        </svg>
        <h2 className={css.title}>Nothing found.</h2>
        <p className={css.description}>{description}</p>
      </div>
      <Link href={href} className={css.button}>
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;
