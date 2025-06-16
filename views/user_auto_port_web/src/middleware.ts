import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('userDeskToken')?.value
  const { pathname, searchParams } = request.nextUrl

  

  if (pathname.startsWith("/last-step")) {
    const pageSender = searchParams.get("sender");
  
    if (!pageSender || (
      pageSender !== "local-sign-up" &&
      pageSender !== "google-sign-up"
    )) {
      
      if(token) {
            const url = new URL('/', request.url)
          url.searchParams.set('redirected', 'already-logged-in')
          return NextResponse.redirect(url)
      }

            const url = new URL('/', request.url)
          url.searchParams.set('redirected', 'invalid-request')
          return NextResponse.redirect(url)
      
    }}


 if (pathname.startsWith("/vehicles")) {

      if(!token) {
            const url = new URL('/', request.url)
          url.searchParams.set('redirected', 'unauthorized')
          return NextResponse.redirect(url)
      }}


 if (pathname.startsWith("/vehicles/get")) {

      if(!token) {
            const url = new URL('/', request.url)
          url.searchParams.set('redirected', 'unauthorized')
          return NextResponse.redirect(url)
      }
     
   
      const vehicle = searchParams.get('vehicle');

     if (!vehicle) {
        const url = new URL('/vehicles', request.url)
        return NextResponse.redirect(url)
      }

    }
  

  if (pathname.startsWith("/vehicles/info")) {

      if(!token) {
            const url = new URL('/', request.url)
          url.searchParams.set('redirected', 'unauthorized')
          return NextResponse.redirect(url)
      }
     
      
     const vehicle = searchParams.get('vehicle');

     if (!vehicle) {
        const url = new URL('/vehicles', request.url)
        return NextResponse.redirect(url)
      }

    }
  
  


  // Redirect logged-in users away from /login or /
  if ((pathname === '/join-us' || pathname === '/welcome-back') && token) {
    const url = new URL('/', request.url)
    url.searchParams.set('redirected', 'already-logged-in')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
matcher: ['/', '/join-us', '/welcome-back', '/admin-key(.*)', '/vehicles/:path*', '/dashboard/:path*'],}
