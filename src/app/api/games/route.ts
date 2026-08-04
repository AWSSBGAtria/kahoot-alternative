import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { quizSetId } = await request.json()
  if (!quizSetId) {
    return NextResponse.json(
      { error: 'quizSetId is required' },
      { status: 400 }
    )
  }

  const quizSet = await db.quizSet.findUnique({ where: { id: quizSetId } })
  if (!quizSet) {
    return NextResponse.json({ error: 'Quiz set not found' }, { status: 404 })
  }

  const roomCode = nanoid(6).toUpperCase()

  const game = await db.game.create({
    data: {
      quizSetId,
      hostId: admin.adminId,
      roomCode,
    },
  })

  return NextResponse.json(game, { status: 201 })
}
