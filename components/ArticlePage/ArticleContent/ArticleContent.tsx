import DOMPurify from 'isomorphic-dompurify';
import css from './ArticleContent.module.css';

interface ArticleContentProps {
  text: string;
}

const splitIntoParagraphs = (text: string): string[] =>
  text
    .split(/\n|\/n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

const isHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

const ArticleContent = ({ text }: ArticleContentProps) => {
  if (isHtml(text)) {
    const safeHtml = DOMPurify.sanitize(text, { ADD_ATTR: ['target'] });

    return <div className={css.content} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  }

  const paragraphs = splitIntoParagraphs(text);

  return (
    <div className={css.content}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={css.paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ArticleContent;
