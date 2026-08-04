import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const quizSet = await db.quizSet.findUnique({
    where: { id },
    include: {
      questions: {
        include: { choices: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!quizSet) {
    return NextResponse.json({ error: 'Quiz set not found' }, { status: 404 })
  }
  return NextResponse.json(quizSet)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { name, description } = await request.json()

  const quizSet = await db.quizSet.update({
    where: { id },
    data: { name, description },
  })
  return NextResponse.json(quizSet)
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
  await db.quizSet.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
