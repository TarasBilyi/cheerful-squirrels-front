import Image from 'next/image';
import type { Author } from '@/types/author';
import css from './AuthorInfo.module.css';

interface AuthorInfoProps {
  author: Author;
  headingLevel?: 'h1' | 'h2';
  onEdit?: () => void;
}

const AuthorInfo = ({ author, headingLevel = 'h1', onEdit }: AuthorInfoProps) => {
  const firstName = author.name.split(' ')[0];
  const Heading = headingLevel;

  return (
    <div className={css.wrapper}>
      {author.avatarUrl ? (
        <Image
          src={author.avatarUrl}
          alt={author.name}
          width={137}
          height={137}
          className={css.avatar}
        />
      ) : (
        <div className={css.avatarPlaceholder}>
          <svg width={64} height={58}>
            <use href="/icons/sprite.svg#photo" />
          </svg>
        </div>
      )}
      <div className={css.info}>
        {onEdit && (
          <button type="button" className={css.editButton} onClick={onEdit}>
            <svg width={16} height={16} aria-hidden>
              <use href="/icons/sprite.svg#edit" />
            </svg>
            Edit
          </button>
        )}
        <Heading className={css.name}>{firstName}</Heading>
        <p className={css.count}>{author.articlesAmount ?? 0} articles</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
