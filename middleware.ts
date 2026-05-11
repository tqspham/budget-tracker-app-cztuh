import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

const PROTECTED_ROUTES = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('auth_token');

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const user = await verifyAuthToken(token.value);

    if (!user) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};