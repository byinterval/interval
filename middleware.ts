import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Check if the user has the session cookie
  const memberfulCookie = request.cookies.get('memberful_session')

  // 2. Define which pages are "Locked" (The Living Atlas)
  if (request.nextUrl.pathname.startsWith('/atlas')) {
    
    if (!memberfulCookie) {
      // 3. If no cookie, redirect to the "Last Chance" page
      return NextResponse.redirect(new URL('/subscribe/last-chance', request.url))
    }
  }

  return NextResponse.next()
}

// === THE FIX: The Matcher Configuration ===
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) <--- CRITICAL: This lets the webhook pass through
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}