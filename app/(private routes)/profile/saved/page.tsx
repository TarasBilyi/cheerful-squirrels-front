import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Saved Articles',
  description: 'Articles you have saved on Harmoniq.',
  openGraph: {
    title: `Saved Articles | ${SITE_NAME}`,
    description: 'Articles you have saved on Harmoniq.',
    url: `${SITE_URL}/profile/saved`,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const ProfileSavedPage = () => null;

export default ProfileSavedPage;
