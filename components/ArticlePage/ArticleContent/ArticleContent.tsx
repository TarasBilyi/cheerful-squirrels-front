import { Fragment } from 'react';
import css from './ArticleContent.module.css';

interface ArticleContentProps {
  text: string;
}

const splitIntoParagraphs = (text: string): string[] =>
  text
    .split(/\n|\/n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

const ArticleContent = ({ text }: ArticleContentProps) => {
  const lines = splitIntoParagraphs(text);

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
