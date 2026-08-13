import Container from '../Container/Container';
import ArticleHeader from './ArticleHeader/ArticleHeader';
import ArticleContent from './ArticleContent/ArticleContent';
import ArticleSidebar from './ArticleSidebar/ArticleSidebar';
import type { Article, ArticleListItem } from '@/types/article';
import css from './ArticlePage.module.css';

interface ArticlePageProps {
  article: Article;
  recommended: ArticleListItem[];
  isAuthenticated: boolean;
  isSaved: boolean;
}

const ArticlePage = ({
  article,
  recommended,
  isAuthenticated,
  isSaved,
}: ArticlePageProps) => {
  return (
    <main className={css.page}>
      <Container className={css.layout}>
        <div className={css.main}>
          <ArticleHeader title={article.title} img={article.img} />
          <ArticleContent text={article.article} />
        </div>

        <ArticleSidebar
          article={article}
          recommended={recommended}
          isAuthenticated={isAuthenticated}
          isSaved={isSaved}
        />
      </Container>
    </main>
  );
};

export default ArticlePage;
