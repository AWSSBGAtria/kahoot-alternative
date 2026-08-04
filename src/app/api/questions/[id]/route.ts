import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { body, imageUrl, choices } = await request.json()

  const question = await db.question.update({
    where: { id },
    data: {
      body,
      imageUrl: imageUrl || null,
    },
    include: { choices: true },
  })

  if (choices && Array.isArray(choices)) {
    // Delete existing choices and recreate
    await db.choice.deleteMany({ where: { questionId: id } })
    await db.choice.createMany({
      data: choices.map((c: { body: string; isCorrect: boolean }) => ({
        questionId: id,
        body: c.body,
        isCorrect: c.isCorrect,
      })),
    })
  }

  const updated = await db.question.findUnique({
    where: { id },
    include: { choices: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await db.question.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
