'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

const isCategory = (value: string | null): value is Category =>
  value === 'general' || value === 'popular';

const DropdownIndicator = (props: DropdownIndicatorProps<Option>) => (
  <components.DropdownIndicator {...props}>
    <svg width="16" height="16">
      <use
        href={`/icons/sprite.svg#${
          props.selectProps.menuIsOpen ? 'chevron-up' : 'chevron-down'
        }`}
      />
    </svg>
  </components.DropdownIndicator>
);

const ArticlesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL (?category=&page=) is the source of truth for which page/category
  // the user is looking at, so that navigating to an article and pressing
  // the browser "back" button restores the exact same listing instead of
  // resetting to page 1.
  const categoryFromUrl: Category = isCategory(searchParams.get('category'))
    ? (searchParams.get('category') as Category)
    : 'general';
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category>(categoryFromUrl);
  const [page, setPage] = useState(pageFromUrl);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  

  const loading = useLoaderStore((state) => state.isLoading);
  const setLoading = useLoaderStore((state) => state.setLoading);

  
  const previousScroll = useRef(0);
  // Avoids re-fetching when *we* are the ones who just wrote to the URL.
  const skipNextUrlSync = useRef(false);

  const updateUrl = useCallback(
    (nextCategory: Category, nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', nextCategory);
      params.set('page', String(nextPage));

      skipNextUrlSync.current = true;
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const loadArticles = async (
    categoryToLoad: Category,
    pageToLoad: number,
    append = false,
  ) => {
    setLoading(true);

    try {
      const data = await getArticles(categoryToLoad, pageToLoad, 12);

      if (append) {
        setArticles((prev) => [...prev, ...data.articles]);
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

  // Refetch whenever the URL's category/page changes - this covers the
  // initial load, user-driven changes (via updateUrl above), and the browser
  // back/forward navigation, which only changes the URL and does not
  // remount this component.
  useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadArticles(categoryFromUrl, pageFromUrl);
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl, pageFromUrl]);

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
  updateUrl(newCategory, 1);
  void loadArticles(newCategory, 1);
};

  const handlePageChange = async (selectedPage: number) => {
  updateUrl(category, selectedPage);
  await loadArticles(category, selectedPage);

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

  const handleLoadMore = async () => {
    if (!hasNextPage || loading) return;

    previousScroll.current = window.scrollY;

    const nextPage = page + 1;
    updateUrl(category, nextPage);
    await loadArticles(category, nextPage, true);
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
                value={options.find(
                  (option) => option.value === category,
                )}
                isSearchable={false}
                components={{
                  DropdownIndicator,
                }}
                onChange={(option) => {
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
            {hasNextPage && (
              <LoadMoreButton
                onClick={handleLoadMore}
                disabled={loading}
              />
            )}
          </div>
        
        </Container>
      </section>
    </main>
  );
};

export default ArticlesPage;
