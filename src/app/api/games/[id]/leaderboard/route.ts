import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  // Get current question for this game
  const game = await db.game.findUnique({ where: { id } })
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }

  // Get the current question based on sequence
  const quizSet = await db.quizSet.findUnique({
    where: { id: game.quizSetId },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!quizSet || !quizSet.questions[game.currentQuestionSequence]) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const currentQuestion = quizSet.questions[game.currentQuestionSequence]

  // Get answer counts for current question
  const answerCounts = await db.answer.groupBy({
    by: ['choiceId'],
    where: {
      participant: { gameId: id },
      questionId: currentQuestion.id,
    },
    _count: { id: true },
  })

  const totalAnswers = await db.answer.count({
    where: {
      participant: { gameId: id },
      questionId: currentQuestion.id,
    },
  })

  const totalParticipants = await db.participant.count({
    where: { gameId: id },
  })

  return NextResponse.json({
    currentQuestion: game.currentQuestionSequence,
    totalQuestions: quizSet.questions.length,
    totalAnswers,
    totalParticipants,
    answerCounts: answerCounts.map((ac) => ({
      choiceId: ac.choiceId,
      count: ac._count.id,
    })),
    phase: game.phase,
    isAnswerRevealed: game.isAnswerRevealed,
  })
}
