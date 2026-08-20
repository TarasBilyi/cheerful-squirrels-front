import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';
import { cookieHeader } from '../../_utils/cookies';

export async function POST() {
  const cookieStore = await cookies();

  try {
    await api.post('/auth/logout', null, {
      headers: { Cookie: await cookieHeader() },
    });
  } catch (error) {
    // Still clear local cookies below even if the backend call failed —
    // the user should never end up stuck "logged in" locally because the
    // backend was briefly unreachable.
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    } else {
      logErrorResponse({ message: (error as Error).message });
    }
  }

  cookieStore.getAll().forEach(({ name }) => cookieStore.delete(name));

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
