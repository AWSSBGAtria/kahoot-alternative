import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const participants = await db.participant.findMany({
    where: { gameId: id },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(participants)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { nickname, roomCode } = await request.json()

  if (!nickname || !roomCode) {
    return NextResponse.json(
      { error: 'Nickname and room code are required' },
      { status: 400 }
    )
  }

  const game = await db.game.findUnique({ where: { id } })
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }

  if (game.roomCode !== roomCode.toUpperCase()) {
    return NextResponse.json({ error: 'Invalid room code' }, { status: 400 })
  }

  if (game.phase !== 'lobby') {
    return NextResponse.json(
      { error: 'Game has already started' },
      { status: 400 }
    )
  }

  const existing = await db.participant.findUnique({
    where: { gameId_nickname: { gameId: id, nickname: nickname.trim() } },
  })
  if (existing) {
    return NextResponse.json(
      { error: 'Nickname already taken' },
      { status: 409 }
    )
  }

  const participant = await db.participant.create({
    data: { gameId: id, nickname: nickname.trim() },
  })

  return NextResponse.json(participant, { status: 201 })
}
