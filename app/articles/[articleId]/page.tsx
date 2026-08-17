import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AxiosError } from 'axios';
import ArticlePage from '@/components/ArticlePage/ArticlePage';
import { getArticleById, getRecommendedArticles } from '@/lib/api/articlesApi';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

interface ArticleRouteProps {
  params: Promise<{ articleId: string }>;
}

export const generateMetadata = async ({
  params,
}: ArticleRouteProps): Promise<Metadata> => {
  const { articleId } = await params;

  try {
    const article = await getArticleById(articleId);
    const title = article.title;
    const description = article.desc;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/articles/${articleId}`,
        siteName: SITE_NAME,
        type: 'article',
        images: [
          {
            url: article.img || DEFAULT_OG_IMAGE,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [article.img || DEFAULT_OG_IMAGE],
      },
    };
  } catch {
    return { title: 'Article' };
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

  const recommended = await getRecommendedArticles({
    excludeId: article._id,
    limit: 3,
  });

  return <ArticlePage article={article} recommended={recommended} />;
};

export default ArticleRoute;