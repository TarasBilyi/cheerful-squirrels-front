import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('perPage') ?? '12';

    const response = await fetch(
      `${process.env.API_URL}/users/${userId}/articles?page=${page}&perPage=${perPage}`,
      {
        method: 'GET',
        headers: {
          Cookie: request.headers.get('cookie') ?? '',
        },
        cache: 'no-store',
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('GET /api/users/[userId]/articles error:', error);

    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to fetch articles',
      },
      { status: 500 }
    );
  }
}
