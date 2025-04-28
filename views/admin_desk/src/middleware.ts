import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  /* const token = request.cookies.get('userDeskToken')?.value
  const hasVisited = request.cookies.get('hasVisited')?.value === 'true'

  const { pathname } = request.nextUrl

  const isLoggedIn = !!token



  // 👋 Set "hasVisited" cookie if not present

  if (!hasVisited) {
    response.cookies.set('hasVisited', 'true', {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true, 
      sameSite: 'lax',
    })
  }

  // 🚫 Prevent logged-out users from accessing /dashboard
  if (pathname.startsWith('/dashboard') && !isLoggedIn && hasVisited) {
    return NextResponse.redirect(new URL('/login', request.url))
  }


  // 🔁 Redirect logged-in users away from /login or /
  if ((pathname === '/login' || pathname === '/') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
   */
  return response
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'], // Routes to guard
}
