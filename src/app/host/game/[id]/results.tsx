'use client'

import { GameResult, Participant, QuizSet } from '@/types/types'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { getAvatarFromName, AvatarIcon } from '@/lib/avatar'

function playDrumRoll() {
  if (typeof window === 'undefined') return

  const browserWindow = window as Window & { webkitAudioContext?: typeof AudioContext }
  const AudioContextClass = window.AudioContext || browserWindow.webkitAudioContext
  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const master = context.createGain()
  master.gain.setValueAtTime(0.0001, context.currentTime)
  master.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.08)
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.15)
  master.connect(context.destination)

  for (let index = 0; index < 24; index += 1) {
    const start = context.currentTime + index * 0.045
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(95 + (index % 3) * 14, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07)
    oscillator.connect(gain)
    gain.connect(master)
    oscillator.start(start)
    oscillator.stop(start + 0.08)
  }

  window.setTimeout(() => context.close(), 1400)
}

export default function Results({
  participants,
  quizSet,
  gameId,
}: {
  participants: Participant[]
  quizSet: QuizSet
  gameId: string
}) {
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(true)
  const [revealedPlace, setRevealedPlace] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    const getResults = async () => {
      try {
        const res = await fetch(`/api/games/${gameId}/results`)
        if (!res.ok) throw new Error('Failed to fetch results')
        const data = await res.json()
        setGameResults(data)
      } catch {
        // Handle error silently
      } finally {
        setLoading(false)
      }
    }
    getResults()
  }, [gameId])

  useEffect(() => {
    if (loading || gameResults.length === 0) return

    setRevealedPlace(0)
    setShowConfetti(false)

    const revealThird = window.setTimeout(() => setRevealedPlace(1), 250)
    const revealSecond = window.setTimeout(() => setRevealedPlace(2), 1250)
    const startDrumRoll = window.setTimeout(playDrumRoll, 2250)
    const revealWinner = window.setTimeout(() => {
      setRevealedPlace(3)
      setShowConfetti(true)
    }, 3450)

    return () => {
      window.clearTimeout(revealThird)
      window.clearTimeout(revealSecond)
      window.clearTimeout(startDrumRoll)
      window.clearTimeout(revealWinner)
    }
  }, [gameResults.length, loading])

  const top1 = gameResults.find((r) => r.rank === 1) || gameResults[0]
  const top2 = gameResults.find((r) => r.rank === 2) || gameResults[1]
  const top3 = gameResults.find((r) => r.rank === 3) || gameResults[2]
  const runnersUp = gameResults.filter((r) => r.rank && r.rank > 3)

  return (
    <div className="min-h-screen bg-paper-cream text-charcoal relative overflow-hidden flex flex-col justify-between p-4 md:p-8">
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={350} gravity={0.15} />
      )}

      {/* Header */}
      <header className="relative z-10 text-center max-w-3xl mx-auto my-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-paper-yellow text-charcoal text-xs font-bold uppercase tracking-widest mb-3 animate-fade-in shadow-pin">
          Final Podium
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-charcoal">
          {quizSet.name}
        </h1>
      </header>

      {loading ? (
        <div className="flex-grow flex items-center justify-center relative z-10">
          <div className="flex items-center gap-3 text-pencil">
            <div className="w-8 h-8 border-4 border-cork-200 border-t-cork-500 rounded-full animate-spin" />
            <span className="font-body font-medium text-lg text-pencil">Calculating final scores...</span>
          </div>
        </div>
      ) : (
        <main className="relative z-10 max-w-5xl mx-auto w-full flex-grow flex flex-col justify-end pb-4">
          {/* Podium Area — construction paper blocks */}
          <div className="flex items-end justify-center gap-3 md:gap-6 mb-12 min-h-[320px] md:min-h-[400px]">
            {/* 2nd Place */}
            {top2 && revealedPlace >= 2 && (
              <div className="podium-pop flex flex-col items-center w-28 md:w-44">
                <div className="flex flex-col items-center mb-3">
                  <div className="relative mb-2">
                    <AvatarIcon name={top2.nickname} size={80} />
                    <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-pencil text-white font-display font-bold text-sm flex items-center justify-center border-2 border-paper-cream shadow-card">
                      2
                    </span>
                  </div>
                  <span className="font-display font-bold text-base md:text-xl text-charcoal truncate max-w-[110px] md:max-w-[160px] text-center">
                    {top2.nickname}
                  </span>
                  <span className="text-xs md:text-sm text-pencil font-mono font-semibold">
                    {top2.totalScore} pts
                  </span>
                </div>
                <div className="w-full h-36 md:h-52 bg-gradient-to-b from-cork-200 to-cork-300 rounded-t-card border-t-4 border-x-4 border-cork-400 flex flex-col items-center justify-center p-2 shadow-card">
                  <span className="font-display font-bold text-4xl md:text-6xl text-cork-600/30">
                    2nd
                  </span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top1 && revealedPlace >= 3 && (
              <div className="podium-pop flex flex-col items-center w-32 md:w-52 z-20">
                <div className="flex flex-col items-center mb-3">
                  <div className="relative mb-2 ring-4 ring-paper-yellow/30 rounded-card">
                    <AvatarIcon name={top1.nickname} size={96} />
                    <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-paper-yellow text-charcoal font-display font-bold text-base flex items-center justify-center border-2 border-paper-cream shadow-card">
                      1
                    </span>
                  </div>
                  <span className="font-display font-bold text-lg md:text-2xl text-charcoal truncate max-w-[130px] md:max-w-[200px] text-center">
                    {top1.nickname}
                  </span>
                  <span className="text-sm md:text-base text-pencil font-mono font-bold">
                    {top1.totalScore} pts
                  </span>
                </div>
                <div className="w-full h-48 md:h-64 bg-gradient-to-b from-paper-yellow to-paper-orange rounded-t-card border-t-4 border-x-4 border-paper-orange flex flex-col items-center justify-center p-2 shadow-card-hover">
                  <span className="font-display font-bold text-5xl md:text-7xl text-charcoal/20">
                    1st
                  </span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3 && revealedPlace >= 1 && (
              <div className="podium-pop flex flex-col items-center w-28 md:w-44">
                <div className="flex flex-col items-center mb-3">
                  <div className="relative mb-2">
                    <AvatarIcon name={top3.nickname} size={80} />
                    <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-paper-orange text-white font-display font-bold text-sm flex items-center justify-center border-2 border-paper-cream shadow-card">
                      3
                    </span>
                  </div>
                  <span className="font-display font-bold text-base md:text-xl text-charcoal truncate max-w-[110px] md:max-w-[160px] text-center">
                    {top3.nickname}
                  </span>
                  <span className="text-xs md:text-sm text-pencil font-mono font-semibold">
                    {top3.totalScore} pts
                  </span>
                </div>
                <div className="w-full h-28 md:h-40 bg-gradient-to-b from-paper-orange/70 to-paper-orange rounded-t-card border-t-4 border-x-4 border-paper-red flex flex-col items-center justify-center p-2 shadow-card">
                  <span className="font-display font-bold text-4xl md:text-6xl text-charcoal/30">
                    3rd
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Runners-up — paper card */}
          {revealedPlace >= 1 && runnersUp.length > 0 && (
            <div className="max-w-2xl mx-auto w-full bg-paper-white border-2 border-cork-200 rounded-card p-4 md:p-6 shadow-card animate-fade-in">
              <h3 className="text-xs font-semibold text-pencil uppercase tracking-wider mb-3 px-2">
                Leaderboard Runners-Up
              </h3>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {runnersUp.map((res) => {
                  return (
                    <div
                      key={res.participantId}
                      className="flex items-center justify-between p-2.5 rounded-card bg-paper-cream border border-cork-100 hover:border-cork-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-display font-bold text-pencil text-sm">
                          {res.rank}
                        </span>
                        <AvatarIcon name={res.nickname} size={32} />
                        <span className="font-body font-medium text-sm text-charcoal">
                          {res.nickname}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-paper-blue">
                        {res.totalScore} <span className="text-xs text-pencil font-normal">pts</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  )
}
