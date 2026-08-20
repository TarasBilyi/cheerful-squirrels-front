import { NextRequest, NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '../../../api';
import { logErrorResponse } from '../../../_utils/utils';
import { cookieHeader } from '../../../_utils/cookies';

type Props = {
  params: Promise<{ authorId: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { authorId } = await params;
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get('perPage') ?? 12);

    const apiRes = await api.get(`/users/${authorId}/articles`, {
      params: { page, perPage },
      headers: { Cookie: await cookieHeader() },
    });
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
