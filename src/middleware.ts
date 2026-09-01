import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/host') && !pathname.startsWith('/host/login')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/host/login', request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/host/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  // Redirect away from login if already authenticated
  if (pathname === '/host/login') {
    const token = request.cookies.get('admin_token')?.value
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/host/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/host/:path*'],
}
