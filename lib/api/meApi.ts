import { nextServer } from './api';
import type { ApiResponse } from '@/types/api';

/**
 * Minimal local shape of /users/me response — intentionally NOT reusing
 * `types/user.ts` (still a stub, missing `_id`/`savedArticles`, has a leftover
 * `password` field). Once that type is finalized this can be dropped in favor
 * of the shared `User` type.
 */
interface CurrentUserMeResponse {
  _id: string;
  savedArticles: string[];
}

export const getSavedArticleIds = async (): Promise<string[]> => {
  try {
    const { data } = await nextServer.get<
      ApiResponse<{ user: CurrentUserMeResponse }>
    >('/users/me');
    return data.data.user.savedArticles ?? [];
  } catch {
    // Not authenticated (401) or endpoint not reachable yet — treat as "no saved articles".
    return [];
  }
};
