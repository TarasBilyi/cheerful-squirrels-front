import Link from 'next/link';
import Container from '@/components/Container/Container';
import ArticleItem from '@/components/ArticleItem/ArticleItem';
import { getPopularArticles } from '@/lib/api/serverApi';
import styles from './PopularArticles.module.css';

const PopularArticles = async () => {
  const articles = await getPopularArticles();

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>Popular Articles</h2>

          <Link href="/articles" className={styles.link}>
            Go to all Articles
            <svg className={styles.icon} width="15" height="15" aria-hidden="true">
              <use href="/icons/sprite.svg#top-right" />
            </svg>
          </Link>
        </div>

        <ul className={styles.list}>
          {articles.map(article => (
            <ArticleItem key={article._id} article={article} />
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default PopularArticles;
