import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomCode = searchParams.get('code')

  if (!roomCode) {
    return NextResponse.json(
      { error: 'Room code is required' },
      { status: 400 }
    )
  }

  const game = await db.game.findFirst({
    // Accept the room code used by the join UI and game IDs from older QR codes.
    where: {
      OR: [
        { roomCode: roomCode.toUpperCase() },
        { id: roomCode },
      ],
    },
    include: {
      quizSet: { select: { name: true } },
      _count: { select: { participants: true } },
    },
  })

  if (!game) {
    return NextResponse.json(
      { error: 'Invalid room code' },
      { status: 404 }
    )
  }

  if (game.phase !== 'lobby') {
    return NextResponse.json(
      { error: 'Game has already started' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    id: game.id,
    roomCode: game.roomCode,
    quizName: game.quizSet.name,
    participantCount: game._count.participants,
  })
}
