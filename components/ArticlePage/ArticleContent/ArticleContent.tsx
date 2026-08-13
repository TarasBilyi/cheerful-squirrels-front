import { Fragment } from 'react';
import css from './ArticleContent.module.css';

interface ArticleContentProps {
  text: string;
}

const ArticleContent = ({ text }: ArticleContentProps) => {
  const lines = text.split('\n');

  return (
    <div className={css.content}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </div>
  );
};

export default ArticleContent;
