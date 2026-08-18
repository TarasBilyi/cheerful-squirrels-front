import Image from 'next/image';
import css from './ArticleHeader.module.css';

interface ArticleHeaderProps {
  title: string;
  img: string;
}

const ArticleHeader = ({ title, img }: ArticleHeaderProps) => {
  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>{title}</h1>

      <div className={css.imageWrapper}>
        <Image
          src={img}
          alt={title}
          fill
          sizes="(min-width: 1440px) 1224px, (min-width: 768px) 704px, 361px"
          className={css.image}
          quality={90}
          priority
        />
      </div>
    </div>
  );
};

export default ArticleHeader;
