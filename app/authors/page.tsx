import AuthorsList from '@/components/AuthorsPage/AuthorsList';
import Container from '@/components/Container/Container';
import { getAuthors } from '@/lib/api/authorsApi';

const AuthorsPage = async () => {
  const { authors, pagination } = await getAuthors(1, 20);

  return (
    <Container>
      <AuthorsList
        initialAuthors={authors}
        initialPage={pagination.page}
        initialTotalPages={pagination.totalPages}
      />
    </Container>
  );
};

export default AuthorsPage;
