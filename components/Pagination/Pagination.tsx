'use client';

import ReactPaginate from 'react-paginate';

import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className={css.wrapper}>
      <ReactPaginate
        breakLabel="..."
        previousLabel={
          <svg width="20" height="20">
            <use href="/icons/sprite.svg#arrow-left" />
          </svg>
        }
        nextLabel={
          <svg width="20" height="20">
            <use href="/icons/sprite.svg#arrow-right" />
          </svg>
        }
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        pageRangeDisplayed={4}
        marginPagesDisplayed={0}
        pageCount={totalPages}
        forcePage={currentPage - 1}
        renderOnZeroPageCount={null}
        containerClassName={css.pagination}
        pageClassName={css.page}
        pageLinkClassName={css.pageLink}
        previousClassName={css.arrow}
        previousLinkClassName={css.arrowLink}
        nextClassName={css.arrow}
        nextLinkClassName={css.arrowLink}
        activeClassName={css.active}
        disabledClassName={css.disabled}
      />
    </div>
  );
};

export default Pagination;