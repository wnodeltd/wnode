import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('nodl_jwt')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/login';

  const isApiPage = request.nextUrl.pathname.startsWith('/api');

  // If no JWT and trying to access protected page
  if (!jwt && !isAuthPage) {
    // Allow /api/account/me for verification purposes (it handles its own auth via header)
    if (request.nextUrl.pathname === '/api/account/me') {
      return NextResponse.next();
    }

    if (isApiPage) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // If has JWT and trying to access login page
  if (jwt && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.webp (institutional logo)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.webp).*)',
  ],
};
