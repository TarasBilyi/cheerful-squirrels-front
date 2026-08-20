import { Suspense } from 'react';
import AuthorsList from '@/components/AuthorsPage/AuthorsList';
import Container from '@/components/Container/Container';
import { getAuthors } from '@/lib/api/serverApi';

const AuthorsPage = async () => {
  const { authors, pagination } = await getAuthors(1, 20);

  return (
    <Container>
      <Suspense fallback={null}>
        <AuthorsList
          initialAuthors={authors}
          initialPage={pagination.page}
          initialTotalPages={pagination.totalPages}
        />
      </Suspense>
    </Container>
  );
};

export default AuthorsPage;
