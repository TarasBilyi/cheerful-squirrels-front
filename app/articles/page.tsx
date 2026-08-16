import ArticlesPage from '@/components/ArticlesPage/ArticlesPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Browse all articles.',
};

export default function Page() {
  return <ArticlesPage />;
}