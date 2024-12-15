import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  try {
    const headers = req.headers;
    const secret = process.env.AUTH_SECRET!;
    // return NextResponse.next();

    const token = await getToken({
      req: req,
      secret: secret
    });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  } catch (e) {
    console.log(e);
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/api/conference/:path*',
    '/api/users/:path*'
  ]
};
