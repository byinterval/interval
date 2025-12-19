import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Check for OUR custom session cookie
  // OLD: memberful_session
  // NEW: interval_session (matches what we set in the Welcome API)
  const sessionCookie = request.cookies.get('interval_session')

  // 2. Define Locked Pages
  if (request.nextUrl.pathname.startsWith('/atlas')) {
    
    // 3. The Gatekeeper Logic
    if (!sessionCookie) {
      // If no cookie, redirect to the Signup page (or Last Chance if you prefer)
      // Changing this to '/signup' ensures they go somewhere that definitely exists
      return NextResponse.redirect(new URL('/signup', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - api
     * - _next
     * - favicon
     * - welcome
     * - static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|welcome).*)',
  ],
}