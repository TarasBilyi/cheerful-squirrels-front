'use client';

import { forwardRef } from 'react';
import css from './BurgerButton.module.css';

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const BurgerButton = forwardRef<HTMLButtonElement, BurgerButtonProps>(
  ({ isOpen, onClick }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`${css.burgerButton} ${isOpen ? css.burgerButtonOpen : ''}`}
        onClick={onClick}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span className={css.burgerLine} />
        <span className={css.burgerLine} />
        <span className={css.burgerLine} />
      </button>
    );
  }
);

BurgerButton.displayName = 'BurgerButton';

export default BurgerButton;
