'use client';
import css from "./ModalErrorSave.module.css"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
interface ModalProps {
  onClose: () => void;
}
const ModalErrorSave = ({ onClose }: ModalProps) => {
    const router = useRouter();

const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    return (
    <div className={css.modalOverlay}
    onClick={handleBackdropClick}>
        <div className={css.modal}>
            <button className={css.closeBtn} aria-label="Close" onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.250001 0.25L7 7M7 7L0.25 13.75M7 7L13.75 13.75M7 7L13.75 0.250001" stroke="#070721" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            <h2 className={css.title}>Error while saving</h2>
            <p className={css.modalText}>To save this article, you need to authorize first</p>
            <div className={css.modalButtons}>
                <button className={css.logBtn}
                              onClick={() => router.push('/login')}>Login</button>
                <button className={css.regBtn}
                              onClick={() => router.push('/register')}>Register</button>
            </div>
        </div>
    </div>)
}
export default ModalErrorSave