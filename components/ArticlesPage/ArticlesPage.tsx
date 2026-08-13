'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';

import Container from '@/components/Container/Container';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import Pagination from '@/components/Pagination/Pagination';

import { getArticles, type Article } from '@/lib/api/articles';

import css from './ArticlesPage.module.css';

type Category = 'general' | 'popular';

type Option = {
  value: Category;
  label: string;
};

const options: Option[] = [
  { value: 'general', label: 'All' },
  { value: 'popular', label: 'Popular' },
];

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
          setArticles(prev => [...prev, ...data.articles]);
        }

        setHasNextPage(data.pagination.hasNextPage);
        setTotalItems(data.pagination.totalItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, page]);

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === category) return;

    setCategory(newCategory);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <main className={css.main}>
      <section className={css.section}>
        <Container>
          <div className={css.header}>
            <h1 className={css.title}>Articles</h1>

            <div className={css.controls}>
              <p className={css.count}>{totalItems} articles</p>

              <Select<Option, false>
                instanceId="articles-category"
                className={css.select}
                classNamePrefix="reactSelect"
                options={options}
                isSearchable={false}
                value={options.find(option => option.value === category)}
                onChange={option => {
                  if (option) {
                    handleCategoryChange(option.value);
                  }
                }}
              />
            </div>
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
        </Container>
      </section>
    </main>
  );
};

export default ArticlesPage;