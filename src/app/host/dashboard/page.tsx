'use client'

import { QuizSet } from '@/types/types'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const PIN_COLORS = [
  'bg-paper-red',
  'bg-paper-blue',
  'bg-paper-green',
  'bg-paper-purple',
  'bg-paper-pink',
]

const PIN_ANCHORS = ['pin', 'pin-blue', 'pin-green', 'pin-yellow', 'pin-purple']

export default function Home() {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getQuizSets = async () => {
      try {
        const res = await fetch('/api/quiz-sets')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setQuizSets(data)
      } catch {
        setError('Failed to load quiz sets')
      } finally {
        setLoading(false)
      }
    }
    getQuizSets()
  }, [])

  const startGame = async (quizSetId: string) => {
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizSetId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      const game = await res.json()
      window.open(`/host/game/${game.id}`, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game')
      setTimeout(() => setError(''), 4000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-pencil">
          <div className="w-5 h-5 border-2 border-paper-blue/30 border-t-paper-blue rounded-full animate-spin-slow" />
          Loading quiz sets...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 bg-paper-red/10 border-2 border-paper-red/20 rounded-card px-4 py-3 text-sm font-medium text-paper-red animate-fade-in">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">Start a Game</h1>
          <p className="text-pencil text-sm mt-1">Pick a quiz set to launch a live game session</p>
        </div>
      </div>

      {quizSets.length === 0 ? (
        <div className="card-pinned pin p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-card bg-cork-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-pencil/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-pencil text-sm mb-4">No quiz sets found. Create one first.</p>
          <Link
            href="/host/dashboard/quizzes"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create a Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {quizSets.map((quizSet, i) => (
            <div
              key={quizSet.id}
              className={`card-pinned ${PIN_ANCHORS[i % PIN_ANCHORS.length]} p-5 animate-slide-up`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-card ${PIN_COLORS[i % PIN_COLORS.length]} flex items-center justify-center text-white text-sm font-bold font-display shadow-card`}>
                    {quizSet.questions.length}
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-charcoal">{quizSet.name}</h3>
                    <p className="text-pencil text-xs">{quizSet.questions.length} questions</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => startGame(quizSet.id)}
                className="btn btn-success w-full"
              >
                Start Game
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
