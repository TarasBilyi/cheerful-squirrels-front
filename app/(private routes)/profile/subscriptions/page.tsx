import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Subscriptions',
  description: 'Authors you follow on Harmoniq.',
  openGraph: {
    title: `Subscriptions | ${SITE_NAME}`,
    description: 'Authors you follow on Harmoniq.',
    url: `${SITE_URL}/profile/subscriptions`,
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

const ProfileSubscriptionsPage = () => null;

export default ProfileSubscriptionsPage;
