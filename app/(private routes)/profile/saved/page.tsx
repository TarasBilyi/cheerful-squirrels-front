import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Articles | harmoniq',
  description: 'Articles you have saved on Harmoniq.',
  openGraph: {
    title: 'Saved Articles | harmoniq',
    description: 'Articles you have saved on Harmoniq.',
    url: 'https://harmoniq.com/profile/saved',
    siteName: 'Harmoniq',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Harmoniq',
      },
    ],
    type: 'website',
  },
};

const ProfileSavedPage = () => null;

export default ProfileSavedPage;
