import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminDeskCookie')?.value
  const { pathname, searchParams } = request.nextUrl

  

  if (pathname.startsWith("/admin-key")) {
    const pageSender = searchParams.get("sender");
  
    if (!pageSender || (
      pageSender !== "local-sign-up" &&
      pageSender !== "local-log-in" &&
      pageSender !== "google-log-in" &&
      pageSender !== "google-sign-up"
    )) {
      
      if(token) {
            const url = new URL('/', request.url)
          url.searchParams.set('redirected', 'already-logged-in')
          return NextResponse.redirect(url)
      }

      
      const url = new URL('/welcome-back', request.url)
    url.searchParams.set('redirected', 'invalidPageRequest')
    return NextResponse.redirect(url)}}



  // Redirect logged-in users away from /login or /
  if ((pathname === '/join-us' || pathname === '/welcome-back') && token) {
    const url = new URL('/', request.url)
    url.searchParams.set('redirected', 'already-logged-in')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
matcher: ['/', '/join-us', '/welcome-back', '/admin-key(.*)', '/dashboard/:path*'],}
