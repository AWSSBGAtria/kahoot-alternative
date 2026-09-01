import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'
import { customAlphabet } from 'nanoid'

const generateRoomCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

export async function POST(request: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find admin by ID, or fallback to email if database was reseeded
  let dbAdmin = await db.admin.findUnique({
    where: { id: admin.adminId },
  })
  if (!dbAdmin && admin.email) {
    dbAdmin = await db.admin.findUnique({
      where: { email: admin.email },
    })
  }

  if (!dbAdmin) {
    return NextResponse.json(
      { error: 'Session expired or admin record not found. Please log in again.' },
      { status: 401 }
    )
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

  const roomCode = generateRoomCode()

  const game = await db.game.create({
    data: {
      quizSetId,
      hostId: dbAdmin.id,
      roomCode,
    },
  })

  return NextResponse.json(game, { status: 201 })
}
