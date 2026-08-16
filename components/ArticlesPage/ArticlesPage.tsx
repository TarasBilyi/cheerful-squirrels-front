'use client';

import { useEffect, useState } from 'react';
import Select, { components, DropdownIndicatorProps } from 'react-select';

import Container from '@/components/Container/Container';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';

import { getArticles } from '@/lib/api/articles';
import { useLoaderStore } from '@/lib/store/loaderStore';

import type { Article } from '@/types/article';

import SectionTitle from '@/components/SectionTitle/SectionTitle';
import ArticlesEmpty from '../ArticlesEmpty/ArticlesEmpty';

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
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const setLoading = useLoaderStore(state => state.setLoading);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      try {
        const data = await getArticles(category, page, 12);

        setArticles(data.articles);
        setTotalItems(data.pagination.totalItems);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchArticles();
  }, [category, page, setLoading]);

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === category) return;

    setCategory(newCategory);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </Container>
      </section>
    </main>
  );
};

export default ArticlesPage;
