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

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - api
     * - _next
     * - favicon
     * - welcome (ADD THIS so middleware never touches the success page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|welcome).*)',
  ],
}