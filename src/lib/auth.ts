import { cookies } from 'next/headers'
import { signToken, verifyToken, AdminPayload } from './jwt'

export * from './jwt'

const COOKIE_NAME = 'admin_token'

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return (bcrypt.default?.hash || bcrypt.hash)(password, 12)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return (bcrypt.default?.compare || bcrypt.compare)(password, hash)
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
