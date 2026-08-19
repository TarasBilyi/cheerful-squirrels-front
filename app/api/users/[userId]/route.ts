import { logErrorResponse } from '@/app/api/_utils/utils';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { NextResponse } from 'next/server';

type Props = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { userId } = await params;

    const response = await api(`/users/${userId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status ?? 500,
        }
      );
    }

    logErrorResponse({
      message: (error as Error).message,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
