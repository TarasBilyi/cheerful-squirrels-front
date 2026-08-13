'use client';

import { useEffect, useState } from 'react';

import ArticlesList from '@/components/ArticlesList/ArticlesList';
import Pagination from '@/components/Pagination/Pagination';

import { getArticles, type Article } from '@/lib/api/articles';

import css from './ArticlesPage.module.css';

type Category = 'general' | 'popular';

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category>('general');
  const [page, setPage] = useState(1);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        const data = await getArticles(category, page, 12);

        if (page === 1) {
          setArticles(data.articles);
        } else {
          setArticles(prevArticles => [
            ...prevArticles,
            ...data.articles,
          ]);
        }

        setHasNextPage(data.pagination.hasNextPage);
        setTotalItems(data.pagination.totalItems);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, page]);

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === category) {
      return;
    }

    setCategory(newCategory);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <main className={css.main}>
      <section className={css.section}>
        <div className={css.header}>
          <h1 className={css.title}>Articles</h1>

          <p className={css.count}>
            {totalItems} articles
          </p>
        </div>

        <div className={css.filter}>
          <select
            value={category}
            onChange={e =>
              handleCategoryChange(e.target.value as Category)
            }
          >
            <option value="general">All</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {loading && page === 1 ? (
          <p className={css.loading}>Loading...</p>
        ) : (
          <ArticlesList articles={articles} />
        )}

        <Pagination
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          isLoading={loading}
        />
      </section>
    </main>
  );
};

export default ArticlesPage;