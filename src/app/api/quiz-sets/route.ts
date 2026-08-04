import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  const quizSets = await db.quizSet.findMany({
    include: {
      questions: {
        include: { choices: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(quizSets)
}

export async function POST(request: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description } = await request.json()
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const quizSet = await db.quizSet.create({
    data: { name, description },
  })
  return NextResponse.json(quizSet, { status: 201 })
}
