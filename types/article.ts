export interface ArticleOwner {
  _id: string;
  name: string;
  avatarUrl?: string;
}

export interface Article {
  _id: string;
  img: string;
  title: string;
  desc: string;
  article: string;
  rate: number;
  ownerId: string | ArticleOwner;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewArticle = Omit<
  Article,
  '_id' | 'desc' | 'rate' | 'ownerId' | 'date' | 'createdAt' | 'updatedAt'
>;
