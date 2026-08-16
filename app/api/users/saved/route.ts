import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('perPage') ?? '12';

    const backendUrl = `${process.env.API_URL}/users/saved?page=${page}&perPage=${perPage}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('GET /api/users/saved error:', error);

    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to fetch saved articles',
        data: null,
      },
      { status: 500 }
    );
  }
}
