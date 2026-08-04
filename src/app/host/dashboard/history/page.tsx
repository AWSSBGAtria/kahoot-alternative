'use client'

import { Game, Participant, QuizSet } from '@/types/types'
import { useEffect, useState } from 'react'
import { getAvatarFromName, AvatarIcon } from '@/lib/avatar'

interface GameWithDetails extends Game {
  quizSet: QuizSet
  participants: Participant[]
}

const PHASE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  lobby: { bg: 'bg-paper-yellow', text: 'text-charcoal', label: 'Lobby' },
  quiz: { bg: 'bg-paper-blue', text: 'text-white', label: 'In Progress' },
  result: { bg: 'bg-paper-green', text: 'text-white', label: 'Finished' },
}

export default function HistoryPage() {
  const [games, setGames] = useState<GameWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGame, setExpandedGame] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/games/history')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setGames(data)
      } catch {
        setError('Failed to load game history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-pencil">
          <div className="w-5 h-5 border-2 border-paper-blue/30 border-t-paper-blue rounded-full animate-spin-slow" />
          Loading history...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 bg-paper-red/10 border-2 border-paper-red/20 rounded-card px-4 py-3 text-sm font-medium text-paper-red animate-fade-in">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">dismiss</button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-charcoal">Game History</h1>
        <p className="text-pencil text-sm mt-1">Past game sessions and participants</p>
      </div>

      {games.length === 0 ? (
        <div className="card-pinned pin p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-card bg-cork-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-pencil/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-pencil text-sm">No games played yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {games.map((game, i) => {
            const phaseStyle = PHASE_STYLES[game.phase] || PHASE_STYLES.lobby
            const isExpanded = expandedGame === game.id

            return (
              <div
                key={game.id}
                className="card-pinned pin p-0 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  onClick={() => setExpandedGame(isExpanded ? null : game.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-cork-50/50 btn-ghost rounded-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-card bg-paper-blue/15 flex items-center justify-center">
                      <svg className="w-5 h-5 text-paper-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.015 6.015 0 01-5.54 0" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-body font-semibold text-charcoal">{game.quizSet.name}</h2>
                      <p className="text-pencil text-xs mt-0.5">
                        {formatDate(game.createdAt)} &middot; {game.roomCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${phaseStyle.bg} ${phaseStyle.text}`}>
                      {phaseStyle.label}
                    </span>
                    <span className="text-pencil text-xs font-medium">
                      {game.participants.length} player{game.participants.length !== 1 ? 's' : ''}
                    </span>
                    <svg
                      className={`w-4 h-4 text-pencil btn-ghost ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t-2 border-cork-100 p-5 animate-fade-in">
                    {game.participants.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {game.participants.map((p) => {
                          const avatar = getAvatarFromName(p.nickname)
                          return (
                            <div
                              key={p.id}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cork-50 border border-cork-200"
                            >
                              <AvatarIcon name={p.nickname} size={24} />
                              <span className="text-sm text-charcoal font-medium">{p.nickname}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-pencil text-sm">No participants joined</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
