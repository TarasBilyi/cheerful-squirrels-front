import type { User } from './user';

export type Author = Pick<User, '_id' | 'name' | 'avatarUrl'>;
