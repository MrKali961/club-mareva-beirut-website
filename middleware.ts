import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Handle qr.clubmarevabeirut.com subdomain
  if (hostname.startsWith('qr.')) {
    // If already on /qr path, let it through
    if (pathname.startsWith('/qr')) {
      return NextResponse.next();
    }

    // Rewrite root and other paths to /qr
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/qr';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.png|images/).*)',
  ],
};
