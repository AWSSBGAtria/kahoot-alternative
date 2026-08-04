import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const games = await db.game.findMany({
    where: { hostId: admin.adminId },
    include: {
      quizSet: true,
      participants: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(games)
}
