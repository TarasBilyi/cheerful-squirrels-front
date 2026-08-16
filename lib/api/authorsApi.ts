import { ApiResponse } from '@/types/api';
import { Author } from '@/types/author';
import { api } from './api';

interface AuthorsPagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface GetAuthorsResponseData {
  users: Author[];
  pagination: AuthorsPagination;
}

export const getAuthors = async () => {
  const { data } = await api.get<ApiResponse<GetAuthorsResponseData>>('/users', {
    params: {
          page: 1,
          perPage: 20,
    },
  });

  return data.data.users;
};
