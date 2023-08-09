import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const userToken = request.cookies.get("token")?.value;
  if(path === '/' && !userToken) {
    return NextResponse.next()
  } else if (path === '/' && userToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } else if (path.includes('/dashboard') && !userToken) {
    return NextResponse.redirect(new URL('/', request.url))
  } else {
    return NextResponse.next()
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/','/dashboard','/dashboard/:path*'],
}