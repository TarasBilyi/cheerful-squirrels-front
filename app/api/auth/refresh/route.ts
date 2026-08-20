import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';
import { cookieHeader, forwardSetCookies } from '../../_utils/cookies';

export async function POST() {
  try {
    const apiRes = await api.post('/auth/refresh', null, {
      headers: { Cookie: await cookieHeader() },
    });

    await forwardSetCookies(apiRes.headers['set-cookie']);

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
