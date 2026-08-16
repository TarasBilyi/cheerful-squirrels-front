import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.API_URL}/users/saved`, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    console.log('SAVED RESPONSE:', data);

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
