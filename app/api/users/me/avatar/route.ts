import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../api';
import { isAxiosError } from 'axios';

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();

    const formData = await request.formData();

    const res = await api.patch('/users/me/avatar', formData, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('UPDATE AVATAR ERROR:', error.response?.data);

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

    console.error('UPDATE AVATAR ERROR:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
