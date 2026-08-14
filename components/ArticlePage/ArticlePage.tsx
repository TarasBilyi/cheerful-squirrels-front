import Container from '../Container/Container';
import ArticleHeader from './ArticleHeader/ArticleHeader';
import ArticleContent from './ArticleContent/ArticleContent';
import ArticleSidebar from './ArticleSidebar/ArticleSidebar';
import type { Article } from '@/types/article';
import css from './ArticlePage.module.css';

interface ArticlePageProps {
  article: Article;
  recommended: Article[];
}

const ArticlePage = ({ article, recommended }: ArticlePageProps) => {
  return (
    <main className={css.page}>
      <Container className={css.layout}>
        <div className={css.main}>
          <ArticleHeader title={article.title} img={article.img} />
          <ArticleContent text={article.article} />
        </div>

        <ArticleSidebar article={article} recommended={recommended} />
      </Container>
    </main>
  );
};

export default ArticlePage;
