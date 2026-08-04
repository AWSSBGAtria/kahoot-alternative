'use client'

import { QUESTION_ANSWER_TIME, TIME_TIL_CHOICE_REVEAL } from '@/constants'
import { Choice, Question } from '@/types/types'
import { useState, useEffect } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const CHOICE_COLORS = [
  { bg: 'bg-paper-red', border: 'border-paper-red', icon: '▲' },
  { bg: 'bg-paper-blue', border: 'border-paper-blue', icon: '◆' },
  { bg: 'bg-paper-yellow', border: 'border-paper-yellow', icon: '●' },
  { bg: 'bg-paper-green', border: 'border-paper-green', icon: '■' },
]

export default function Quiz({
  question,
  questionCount,
  participantId: playerId,
  isAnswerRevealed,
  gameId,
}: {
  question: Question
  questionCount: number
  participantId: string
  isAnswerRevealed: boolean
  gameId: string
}) {
  const [chosenChoice, setChosenChoice] = useState<Choice | null>(null)
  const [hasShownChoices, setHasShownChoices] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [error, setError] = useState('')

  useEffect(() => {
    setChosenChoice(null)
    setHasShownChoices(false)
    setError('')
  }, [question.id])

  const answer = async (choice: Choice) => {
    setChosenChoice(choice)
    setError('')

    const now = Date.now()
    const score = !choice.isCorrect
      ? 0
      : 1000 -
        Math.round(
          Math.max(
            0,
            Math.min((now - questionStartTime) / QUESTION_ANSWER_TIME, 1)
          ) * 1000
        )

    try {
      const res = await fetch(`/api/games/${gameId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: playerId,
          questionId: question.id,
          choiceId: choice.id,
          score,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setChosenChoice(null)
        setError(data.error || 'Failed to submit answer')
      }
    } catch {
      setChosenChoice(null)
      setError('Network error — please try again')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-paper-cream text-charcoal relative overflow-hidden p-4 md:p-8">
      {/* Question Heading — pinned card */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full my-4">
        <div className="card-pinned pin p-6 shadow-card">
          <h2 className="font-display text-xl md:text-3xl font-bold text-charcoal leading-tight">
            {question.body}
          </h2>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="relative z-10 max-w-4xl mx-auto w-full my-2">
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="ml-2 font-bold underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Image if available */}
      {question.imageUrl && (
        <div className="relative z-10 flex justify-center my-2">
          <img
            src={question.imageUrl}
            alt="Question"
            className="max-h-40 md:max-h-52 rounded-card border-2 border-cork-200 object-contain shadow-card"
          />
        </div>
      )}

      {/* State: Waiting for choices to show */}
      {!hasShownChoices && !isAnswerRevealed && (
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center my-6">
          <p className="font-body font-semibold text-pencil text-base mb-4 animate-pulse-soft">Get Ready!</p>
          <CountdownCircleTimer
            onComplete={() => {
              setHasShownChoices(true)
              setQuestionStartTime(Date.now())
            }}
            isPlaying
            duration={TIME_TIL_CHOICE_REVEAL / 1000}
            colors={['#c4a265', '#c4a265']}
            colorsTime={[5, 0]}
            strokeWidth={10}
            size={130}
            trailColor="rgba(0,0,0,0.05)"
          >
            {({ remainingTime }) => (
              <span className="font-display font-bold text-4xl text-cork-500">
                {remainingTime}
              </span>
            )}
          </CountdownCircleTimer>
        </div>
      )}

      {/* State: Answer submitted, waiting for reveal */}
      {!isAnswerRevealed && chosenChoice && (
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center my-6 text-center">
          <div className="w-16 h-16 rounded-full bg-paper-blue text-white flex items-center justify-center mb-4 animate-pulse-soft shadow-pin">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-charcoal mb-2">Answer Submitted!</h3>
          <p className="text-pencil text-sm">Hang tight while the other players finish...</p>
        </div>
      )}

      {/* State: Choice selection buttons — construction paper cards */}
      {hasShownChoices && !isAnswerRevealed && !chosenChoice && (
        <div className="relative z-10 flex-grow flex flex-col justify-end max-w-5xl mx-auto w-full my-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {question.choices.map((choice, index) => {
              const theme = CHOICE_COLORS[index % CHOICE_COLORS.length]
              return (
                <button
                  key={choice.id}
                  onClick={() => answer(choice)}
                  className={`${theme.bg} min-w-0 aspect-square md:aspect-auto p-3 sm:p-4 md:p-8 rounded-card font-display font-bold text-sm sm:text-base md:text-2xl leading-tight text-white text-center md:text-left flex items-center justify-center md:justify-between overflow-hidden shadow-card transition hover:brightness-110 active:scale-[0.98] touch-manipulation`}
                >
                  <span className="flex min-w-0 max-w-full flex-col items-center gap-2 md:flex-row md:items-center md:gap-3">
                    <span className="shrink-0 opacity-80 text-2xl sm:text-3xl md:text-2xl">{theme.icon}</span>
                    <span className="min-w-0 max-w-full break-words">{choice.body}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* State: Answer revealed */}
      {isAnswerRevealed && (
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center my-6 text-center">
          <div
            className={`w-24 h-24 rounded-card flex items-center justify-center mb-4 shadow-card animate-pop-in border-2 ${
              chosenChoice?.isCorrect ? 'bg-paper-green text-white border-paper-green' : 'bg-paper-red text-white border-paper-red'
            }`}
          >
            {chosenChoice?.isCorrect ? (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-charcoal">
            {chosenChoice?.isCorrect ? 'Awesome! Correct!' : 'Bummer! Incorrect'}
          </h2>
          <p className="text-pencil text-sm">Look at the host screen for current rankings!</p>
        </div>
      )}

      {/* Footer / Question counter — paper strip */}
      <footer className="relative z-10 flex items-center justify-between bg-paper-white border-2 border-cork-200 rounded-card px-6 py-3 max-w-5xl mx-auto w-full shadow-card">
        <span className="font-body font-semibold text-sm text-charcoal">Question</span>
        <span className="font-mono font-bold text-base text-paper-blue">
          {question.order + 1} / {questionCount}
        </span>
      </footer>
    </div>
  )
}
