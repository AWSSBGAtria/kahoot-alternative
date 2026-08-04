import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get('questionId')

  if (!questionId) {
    return NextResponse.json(
      { error: 'questionId is required' },
      { status: 400 }
    )
  }

  const answers = await db.answer.findMany({
    where: {
      participant: { gameId: id },
      questionId,
    },
    select: { choiceId: true },
  })

  return NextResponse.json(answers)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const { participantId, questionId, choiceId, score } = await request.json()

  if (!participantId || !questionId || !choiceId || score === undefined) {
    return NextResponse.json(
      { error: 'participantId, questionId, choiceId, and score are required' },
      { status: 400 }
    )
  }

  const participant = await db.participant.findFirst({
    where: { id: participantId, gameId: id },
  })
  if (!participant) {
    return NextResponse.json(
      { error: 'Participant not found in this game' },
      { status: 404 }
    )
  }

  const existing = await db.answer.findUnique({
    where: { participantId_questionId: { participantId, questionId } },
  })
  if (existing) {
    return NextResponse.json(
      { error: 'Already answered this question' },
      { status: 409 }
    )
  }

  await db.answer.create({
    data: { participantId, questionId, choiceId, score },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
