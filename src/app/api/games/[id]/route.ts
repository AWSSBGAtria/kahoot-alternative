import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const game = await db.game.findUnique({
    where: { id },
    include: {
      quizSet: {
        include: {
          questions: {
            include: { choices: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }
  return NextResponse.json(game)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const game = await db.game.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(game)
}
