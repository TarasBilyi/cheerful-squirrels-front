'use client';

import { useEffect, useRef, useState } from 'react';
import Select, { components, DropdownIndicatorProps } from 'react-select';

import Container from '@/components/Container/Container';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import Pagination from '@/components/Pagination/Pagination';
import LoadMoreButton from '@/components/LoadMoreButton/LoadMoreButton';
import Loader from '@/components/Loader/Loader';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import ArticlesEmpty from '../ArticlesEmpty/ArticlesEmpty';

import { getArticles } from '@/lib/api/articles';
import { useLoaderStore } from '@/lib/store/loaderStore';

import type { Article } from '@/types/article';

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

const DropdownIndicator = (props: DropdownIndicatorProps<Option>) => (
  <components.DropdownIndicator {...props}>
    <svg width="16" height="16">
      <use
        href={`/icons/sprite.svg#${props.selectProps.menuIsOpen ? 'chevron-up' : 'chevron-down'}`}
      />
    </svg>
  </components.DropdownIndicator>
);

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category>('general');
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const loading = useLoaderStore(state => state.isLoading);
  const setLoading = useLoaderStore(state => state.setLoading);

  const previousScroll = useRef(0);

  const loadArticles = async (pageToLoad: number, append = false) => {
    setLoading(true);

    try {
      const data = await getArticles(category, pageToLoad, 12);

      if (append) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }

      setPage(pageToLoad);
      setTotalItems(data.pagination.totalItems);
      setTotalPages(data.pagination.totalPages);
      setHasNextPage(data.pagination.hasNextPage);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadArticles(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [category]);

  useEffect(() => {
    if (previousScroll.current) {
      window.scrollTo({
        top: previousScroll.current + 500,
        behavior: 'smooth',
      });

      previousScroll.current = 0;
    }
  }, [articles]);

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === category) return;

    setCategory(newCategory);
  };

  const handlePageChange = async (selectedPage: number) => {
    await loadArticles(selectedPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || loading) return;

    previousScroll.current = window.scrollY;

    await loadArticles(page + 1, true);
  };

  return (
    <main className={css.main}>
      <Loader />

      <section className={css.section}>
        <Container>
          <div className={css.header}>
            <SectionTitle>Articles</SectionTitle>

            <div className={css.controls}>
              <p className={css.count}>{totalItems} articles</p>

              <Select<Option, false>
                instanceId="articles-category"
                className={css.select}
                classNamePrefix="reactSelect"
                options={options}
                value={options.find(option => option.value === category)}
                isSearchable={false}
                components={{
                  DropdownIndicator,
                }}
                onChange={option => {
                  if (option) {
                    handleCategoryChange(option.value);
                  }
                }}
              />
            </div>
          </div>

          {!isFirstLoad &&
            (articles.length > 0 ? (
              <ArticlesList articles={articles} />
            ) : (
              <ArticlesEmpty
                text="Be the first, who create an article"
                buttonText="Create an article"
                href="/articles/create"
              />
            ))}

          <div className={css.desktopPagination}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className={css.mobilePagination}>
            {hasNextPage && <LoadMoreButton onClick={handleLoadMore} disabled={loading} />}
          </div>
        </Container>
      </section>
    </main>
  );
};

export default ArticlesPage;
