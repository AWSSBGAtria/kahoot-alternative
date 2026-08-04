import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  const results = await db.answer.groupBy({
    by: ['participantId'],
    where: {
      participant: { gameId: id },
    },
    _sum: { score: true },
    orderBy: { _sum: { score: 'desc' } },
  })

  const participantIds = results.map((r) => r.participantId)
  const participants = await db.participant.findMany({
    where: { id: { in: participantIds } },
  })

  const participantMap = new Map(participants.map((p) => [p.id, p]))

  const leaderboard = results.map((r, index) => ({
    rank: index + 1,
    participantId: r.participantId,
    nickname: participantMap.get(r.participantId)?.nickname || 'Unknown',
    totalScore: r._sum.score || 0,
  }))

  return NextResponse.json(leaderboard)
}
