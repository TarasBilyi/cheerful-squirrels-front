export interface ArticleAuthor {
  _id: string;
  name: string;
  avatarUrl: string;
}

/**
 * Full article shape as returned by GET /articles/:articleId.
 * `ownerId` is populated by the backend into an ArticleAuthor object on this endpoint.
 */
export interface Article {
  _id: string;
  img: string;
  title: string;
  desc: string;
  article: string;
  rate: number;
  ownerId: ArticleAuthor;
  date: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shape as returned by GET /articles (list endpoints, incl. ?category=recommended).
 * NOTE: this endpoint does NOT populate `ownerId` — it stays a plain string id here.
 * TODO(backend): ask to populate `ownerId` with { _id, name, avatarUrl } on the list
 * endpoint too, so recommendation cards can show a real author name instead of a fallback.
 */
export interface ArticleListItem {
  _id: string;
  img: string;
  title: string;
  desc: string;
  article: string;
  rate: number;
  ownerId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesPagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetArticlesResponseData {
  articles: ArticleListItem[];
  pagination: ArticlesPagination;
}
