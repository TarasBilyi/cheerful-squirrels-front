import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your profile and articles on Harmoniq.',
  openGraph: {
    title: `My Profile | ${SITE_NAME}`,
    description: 'Manage your profile and articles on Harmoniq.',
    url: `${SITE_URL}/profile`,
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

const ProfilePage = () => null;

export default ProfilePage;
