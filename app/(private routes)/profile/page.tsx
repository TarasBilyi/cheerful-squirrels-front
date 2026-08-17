import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | harmoniq',
  description: 'Manage your profile and articles on Harmoniq.',
  openGraph: {
    title: 'My Profile | harmoniq',
    description: 'Manage your profile and articles on Harmoniq.',
    url: 'https://harmoniq.com/profile',
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

const ProfilePage = () => null;

export default ProfilePage;
