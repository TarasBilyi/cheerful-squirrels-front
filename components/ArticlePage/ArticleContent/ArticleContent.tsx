import { Fragment } from 'react';
import css from './ArticleContent.module.css';

interface ArticleContentProps {
  text: string;
}

/**
 * Splits on real newlines (\n) — the correct, spec'd separator — and also
 * on a literal "/n" (slash + n) text sequence.
 *
 * TEMPORARY WORKAROUND: some of the current seed data has "/n" typed as
 * plain text instead of an actual newline character, so it doesn't parse
 * as a real line break on its own. This keeps those articles readable in
 * the meantime. Once the seed data is corrected to use real "\n", the
 * "/n" branch here becomes a no-op and can be removed.
 */
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
