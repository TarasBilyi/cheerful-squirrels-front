'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useIsClient } from '@/hooks/useIsClient';
import styles from './Modal.module.css';

const CLOSE_ANIMATION_DURATION = 200;

const ModalCloseContext = createContext<(() => void) | null>(null);

export const useModalClose = () => {
  const close = useContext(ModalCloseContext);
  if (!close) {
    throw new Error('useModalClose must be used inside <Modal>');
  }
  return close;
};

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
}

const Modal = ({ onClose, children, contentClassName }: ModalProps) => {
  const isClient = useIsClient();
  const [isClosing, setIsClosing] = useState(false);

  const startClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, CLOSE_ANIMATION_DURATION);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        startClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [startClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      startClose();
    }
  };

  if (!isClient) {
    return null;
  }

  const modalRoot = document.getElementById('modal-root') ?? document.body;

  return createPortal(
    <ModalCloseContext.Provider value={startClose}>
      <div
        className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ''}`}
        onClick={handleBackdropClick}
      >
        <div
          className={`${styles.content} ${contentClassName ?? ''} ${
            isClosing ? styles.contentClosing : ''
          }`}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </ModalCloseContext.Provider>,
    modalRoot
  );
};

export default Modal;
