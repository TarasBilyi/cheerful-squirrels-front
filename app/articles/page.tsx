import { Suspense } from 'react';
import ArticlesPage from '@/components/ArticlesPage/ArticlesPage';

import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Browse all articles on Harmoniq.',
  openGraph: {
    title: `Articles | ${SITE_NAME}`,
    description: 'Browse all articles on Harmoniq.',
    url: `${SITE_URL}/articles`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    type: 'website',
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ArticlesPage />
    </Suspense>
  );
}