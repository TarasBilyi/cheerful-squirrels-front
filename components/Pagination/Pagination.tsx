'use client';

import ReactPaginate from 'react-paginate';
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from "react-icons/hi2";

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
        previousLabel={<HiOutlineArrowLongLeft size={28} />}
        nextLabel={<HiOutlineArrowLongRight size={28} />}
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