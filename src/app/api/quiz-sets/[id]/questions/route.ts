import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { body, imageUrl, order, choices } = await request.json()

  if (!body || order === undefined || !choices || choices.length < 2) {
    return NextResponse.json(
      { error: 'Body, order, and at least 2 choices are required' },
      { status: 400 }
    )
  }

  const question = await db.question.create({
    data: {
      quizSetId: id,
      body,
      imageUrl: imageUrl || null,
      order,
      choices: {
        create: choices.map((c: { body: string; isCorrect: boolean }) => ({
          body: c.body,
          isCorrect: c.isCorrect,
        })),
      },
    },
    include: { choices: true },
  })

  return NextResponse.json(question, { status: 201 })
}
