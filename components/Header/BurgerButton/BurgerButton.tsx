'use client';

import css from './BurgerButton.module.css';

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const BurgerButton = ({ isOpen, onClick }: BurgerButtonProps) => {
  return (
    <button
      type="button"
      className={`${css.burgerButton} ${isOpen ? css.burgerButtonOpen : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span className={css.burgerLine} />
      <span className={css.burgerLine} />
      <span className={css.burgerLine} />
    </button>
  );
};

export default BurgerButton;
