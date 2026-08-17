import { Metadata } from 'next';
import AddArticleForm from '@/components/AddArticleForm/AddArticleForm';
import Container from '@/components/Container/Container';
import RequireAuth from '@/components/RequireAuth/RequireAuth';

export const metadata: Metadata = {
  title: `Harmoniq - Create Article`,
  description: 'Write a new public article on Harmoniq',
  openGraph: {
    title: `Harmoniq`,
    description: 'Create new article',
    url: `https://harmoniq.com/articles/new`,
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
