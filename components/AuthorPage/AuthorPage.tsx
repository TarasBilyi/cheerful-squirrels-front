import Container from '@/components/Container/Container';
import AuthorInfo from './AuthorInfo';
import AuthorArticles from './AuthorArticles';
import SubscribeButton from '@/components/SubscribeButton/SubscribeButton';
import type { Author } from '@/types/author';
import type { Article } from '@/types/article';
import css from './AuthorPage.module.css';

interface AuthorPageProps {
  authorId: string;
  author: Author;
  initialArticles: Article[];
  initialPage: number;
  initialTotalPages: number;
}

const AuthorPage = ({
  authorId,
  author,
  initialArticles,
  initialPage,
  initialTotalPages,
}: AuthorPageProps) => {
  return (
    <main className={css.main}>
      <Container>
        <AuthorInfo author={author} action={<SubscribeButton authorId={authorId} />} />
        <AuthorArticles
          authorId={authorId}
          initialArticles={initialArticles}
          initialPage={initialPage}
          initialTotalPages={initialTotalPages}
        />
      </Container>
    </main>
  );
};

export default AuthorPage;
