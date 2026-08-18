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
