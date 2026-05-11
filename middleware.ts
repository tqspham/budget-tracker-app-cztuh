import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    try {
      const { data: user, error } = await supabase
        .from('budget_tracker_app_cztuh_users')
        .select('id, email')
        .eq('id', token.value)
        .single();

      if (error || !user) {
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    } catch (err) {
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
