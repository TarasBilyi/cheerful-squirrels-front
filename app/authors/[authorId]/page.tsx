import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AxiosError } from 'axios';
import AuthorPage from '@/components/AuthorPage/AuthorPage';
import { getAuthorById, getArticlesByAuthor } from '@/lib/api/authorsApi';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

interface AuthorRouteProps {
  params: Promise<{ authorId: string }>;
}

export const generateMetadata = async ({ params }: AuthorRouteProps): Promise<Metadata> => {
  const { authorId } = await params;

  try {
    const author = await getAuthorById(authorId);
    const title = author.name;
    const description = `${author.articlesAmount ?? 0} articles by ${author.name} on Harmoniq`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/authors/${authorId}`,
        siteName: SITE_NAME,
        images: [
          {
            url: author.avatarUrl ?? DEFAULT_OG_IMAGE,
            width: 1200,
            height: 630,
            alt: author.name,
          },
        ],
        type: 'website',
      },
    };
  } catch {
    return { title: 'Author' };
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
