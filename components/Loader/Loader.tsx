'use client';

import { ThreeDots } from 'react-loader-spinner';
import { useLoaderStore } from '@/lib/store/loaderStore';
import css from './Loader.module.css';

export default function Loader() {
  const isLoading = useLoaderStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className={css.overlay}>
      <ThreeDots height="80" width="80" color="#4fa94d" />
    </div>
  );
}