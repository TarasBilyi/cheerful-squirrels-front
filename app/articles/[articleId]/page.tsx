import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AxiosError } from 'axios';
import ArticlePage from '@/components/ArticlePage/ArticlePage';
import { getArticleById, getRecommendedArticles } from '@/lib/api/articlesApi';
import { getSavedArticleIds } from '@/lib/api/meApi';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

interface ArticleRouteProps {
  params: Promise<{ articleId: string }>;
}

export const generateMetadata = async ({
  params,
}: ArticleRouteProps): Promise<Metadata> => {
  const { articleId } = await params;

  try {
    const article = await getArticleById(articleId);
    return { title: `${article.title} | harmoniq` };
  } catch {
    return { title: 'Article | harmoniq' };
  }
};

const ArticleRoute = async ({ params }: ArticleRouteProps) => {
  const { articleId } = await params;

  let article;
  try {
    article = await getArticleById(articleId);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  const { isAuthenticated } = await getCurrentUser();

  const [recommended, savedIds] = await Promise.all([
    getRecommendedArticles({ excludeId: article._id, limit: 3 }),
    isAuthenticated ? getSavedArticleIds() : Promise.resolve<string[]>([]),
  ]);

  return (
    <ArticlePage
      article={article}
      recommended={recommended}
      isAuthenticated={isAuthenticated}
      isSaved={savedIds.includes(article._id)}
    />
  );
};

export default ArticleRoute;
