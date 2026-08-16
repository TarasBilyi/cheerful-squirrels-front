import { getAuthors } from '@/lib/api/authorsApi';
import AuthorsItem from './AuthorsItem';
import css from './AuthorsList.module.css';

const AuthorsList = async () => {
  const authors = await getAuthors();

  return (
    <>
      <h1>Authors</h1>

      {authors.length === 0 ? (
        <p>No authors found yet.</p>
      ) : (
        <ul className={css.list}>
          {authors.map(author => (
            <AuthorsItem key={author._id} author={author} />
          ))}
        </ul>
      )}
    </>
  );
};
export default AuthorsList;
