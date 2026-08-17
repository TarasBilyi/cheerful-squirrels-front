'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AddArticleForm from '@/components/AddArticleForm/AddArticleForm';
import Container from '@/components/Container/Container';
import RequireAuth from '@/components/RequireAuth/RequireAuth';
import { getArticleById } from '@/lib/api/articlesApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { Article } from '@/types/article';

type LoadStatus = 'loading' | 'ready' | 'error';

const EditArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const [article, setArticle] = useState<Article | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    getArticleById(articleId)
      .then(fetched => {
        if (cancelled) return;
        setArticle(fetched);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  useEffect(() => {
    if (status === 'error') {
      router.replace('/profile');
    }
  }, [status, router]);

  useEffect(() => {
    if (!article || !user) return;

    const ownerId = typeof article.ownerId === 'string' ? article.ownerId : article.ownerId._id;
    if (ownerId !== user._id) {
      router.replace(`/articles/${article._id}`);
    }
  }, [article, user, router]);

  return (
    <RequireAuth>
      <Container>{status === 'ready' && article ? <AddArticleForm article={article} /> : null}</Container>
    </RequireAuth>
  );
};

export default EditArticlePage;
