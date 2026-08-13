import css from './Pagination.module.css';

interface PaginationProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
}

const Pagination = ({
  onLoadMore,
  hasNextPage,
  isLoading,
}: PaginationProps) => {
  if (!hasNextPage) {
    return null;
  }

  return (
    <div className={css.wrapper}>
      <button
        type="button"
        className={css.button}
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
};

export default Pagination;