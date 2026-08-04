import { NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  return NextResponse.json({ adminId: admin.adminId, email: admin.email })
}
