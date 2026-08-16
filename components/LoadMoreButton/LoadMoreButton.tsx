'use client';

import css from './LoadMoreButton.module.css';

interface LoadMoreButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const LoadMoreButton = ({
  onClick,
  disabled = false,
}: LoadMoreButtonProps) => {
  return (
    <div className={css.wrapper}>
      <button
        type="button"
        className={css.button}
        onClick={onClick}
        disabled={disabled}
      >
        Load more
      </button>
    </div>
  );
};

export default LoadMoreButton;