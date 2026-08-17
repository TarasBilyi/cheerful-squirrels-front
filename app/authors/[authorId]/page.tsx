import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AxiosError } from 'axios';
import AuthorPage from '@/components/AuthorPage/AuthorPage';
import { getAuthorById, getArticlesByAuthor } from '@/lib/api/authorsApi';

interface AuthorRouteProps {
  params: Promise<{ authorId: string }>;
}

export const generateMetadata = async ({ params }: AuthorRouteProps): Promise<Metadata> => {
  const { authorId } = await params;

  try {
    const author = await getAuthorById(authorId);
    const title = `${author.name} | harmoniq`;
    const description = `${author.articlesAmount ?? 0} articles by ${author.name} on Harmoniq`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://harmoniq.com/authors/${authorId}`,
        siteName: 'Harmoniq',
        images: [
          {
            url: author.avatarUrl ?? 'https://ac.goit.global/fullstack/react/og-meta.jpg',
            width: 1200,
            height: 630,
            alt: author.name,
          },
        ],
        type: 'website',
      },
    };
  } catch {
    return { title: 'Author | harmoniq' };
  }
};

const AuthorRoute = async ({ params }: AuthorRouteProps) => {
  const { authorId } = await params;

  let author;
  try {
    author = await getAuthorById(authorId);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  const { articles, pagination } = await getArticlesByAuthor(authorId, 1, 12);

  return (
    <AuthorPage
      authorId={authorId}
      author={author}
      initialArticles={articles}
      initialPage={pagination.page}
      initialTotalPages={pagination.totalPages}
    />
  );
};

export default AuthorRoute;
