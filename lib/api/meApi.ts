import 'server-only';
import { cookies } from 'next/headers';
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
    // This runs on the server (Server Component render), which is a
    // separate outgoing HTTP request — it does NOT automatically carry the
    // browser's cookies. Without forwarding them explicitly, this call is
    // always unauthenticated, so it always looked like "nothing saved".
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    const { data } = await nextServer.get<
      ApiResponse<{ user: CurrentUserMeResponse }>
    >('/users/me', {
      headers: { Cookie: cookieHeader },
    });
    return data.data.user.savedArticles ?? [];
  } catch {
    // Not authenticated (401) or endpoint not reachable yet — treat as "no saved articles".
    return [];
  }
};
