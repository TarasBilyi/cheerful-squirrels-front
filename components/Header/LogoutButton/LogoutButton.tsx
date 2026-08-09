'use client';

import { useLogoutModalStore } from '@/lib/store/logoutModal.store';
import css from './LogoutButton.module.css';

interface LogoutButtonProps {
  onBeforeOpen?: () => void;
}

const LogoutButton = ({ onBeforeOpen }: LogoutButtonProps) => {
  const openLogoutModal = useLogoutModalStore(state => state.openLogoutModal);

  const handleClick = () => {
    onBeforeOpen?.();
    openLogoutModal();
  };

  return (
    <button type="button" onClick={handleClick} className={css.button} aria-label="Log out">
      <svg width="32" height="32" className={css.icon} aria-hidden>
        <use href="/icons/sprite.svg#icon-logout" />
      </svg>
    </button>
  );
};

export default LogoutButton;
