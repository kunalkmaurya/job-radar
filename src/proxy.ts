import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, isAllowedEmail, AUTH_COOKIE_NAME } from '@/lib/auth';

// Paths that do not require authentication
const PUBLIC_PATHS = ['/', '/login', '/api/auth', '/api/telegram-webhook', '/logo.png', '/icon.svg'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static files, Next.js internal routes, favicon, and PWA manifest/icons
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/manifest')
  ) {
    return NextResponse.next();
  }

  // 2. Allow public endpoints
  if (
    PUBLIC_PATHS.some((path) => pathname === path || (path !== '/' && pathname.startsWith(path)))
  ) {
    // If user is already authenticated and visits /login, redirect to /dashboard
    if (pathname === '/login') {
      const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        const session = await verifySessionToken(token);
        if (session && isAllowedEmail(session.email)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // 4. Verify JWT token for all protected routes (/dashboard, /api/jobs, etc.)
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const session = await verifySessionToken(token);

  if (!session || !isAllowedEmail(session.email)) {
    // Clear invalid cookie
    const response = pathname.startsWith('/api/')
      ? NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Unauthorized account' } },
          { status: 403 }
        )
      : NextResponse.redirect(new URL('/login?error=UnauthorizedAccount', request.url));

    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
