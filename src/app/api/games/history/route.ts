import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let dbAdmin = await db.admin.findUnique({
    where: { id: admin.adminId },
  })
  if (!dbAdmin && admin.email) {
    dbAdmin = await db.admin.findUnique({
      where: { email: admin.email },
    })
  }

  if (!dbAdmin) {
    return NextResponse.json([], { status: 200 })
  }

  const games = await db.game.findMany({
    where: { hostId: dbAdmin.id },
    include: {
      quizSet: true,
      participants: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(games)
}
