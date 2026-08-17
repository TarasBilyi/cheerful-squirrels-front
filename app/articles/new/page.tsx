import { Metadata } from 'next';
import AddArticleForm from '@/components/AddArticleForm/AddArticleForm';
import Container from '@/components/Container/Container';
import RequireAuth from '@/components/RequireAuth/RequireAuth';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Create Article',
  description: 'Write a new public article on Harmoniq.',
  openGraph: {
    title: `Create Article | ${SITE_NAME}`,
    description: 'Write a new public article on Harmoniq.',
    url: `${SITE_URL}/articles/new`,
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
    follow: true,
  },
};

const CreateArticle = () => {
  return (
    <RequireAuth>
      <Container>
        <AddArticleForm />
      </Container>
    </RequireAuth>
  );
};

export default CreateArticle;
