import { NextRequest, NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') ?? '';
    const apiRes = await api.get('/auth/check-email', { params: { email } });
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      if (error.response) {
        return NextResponse.json(error.response.data, { status: error.response.status });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
