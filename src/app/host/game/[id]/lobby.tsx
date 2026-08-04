'use client'

import { Participant } from '@/types/types'
import { useQRCode } from 'next-qrcode'
import { useEffect, useState } from 'react'
import { getAvatarFromName, AvatarIcon } from '@/lib/avatar'

export default function Lobby({
  participants,
  gameId,
  roomCode,
}: {
  participants: Participant[]
  gameId: string
  roomCode: string
}) {
  const { Canvas } = useQRCode()
  const [baseUrl, setBaseUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const onClickStartGame = async () => {
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 'quiz' }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        setTimeout(() => setError(''), 4000)
      }
    } catch {
      setError('Failed to start game')
      setTimeout(() => setError(''), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-cork-texture text-charcoal relative overflow-hidden flex flex-col justify-between p-4 md:p-8">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-paper-red text-white px-6 py-3 rounded-card shadow-pin font-semibold text-sm animate-slide-up">
          {error}
        </div>
      )}

      {/* Top Banner — large pinned card */}
      <header className="relative z-10">
        <div className="card-pinned pin p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-pencil font-semibold mb-0.5">
                Join at
              </div>
              <div className="text-lg md:text-2xl font-display font-bold text-paper-blue">
                {baseUrl ? baseUrl.replace(/^https?:\/\//, '') : '...'}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-paper-yellow border-2 border-paper-orange px-6 py-3 rounded-card shadow-pin">
              <span className="text-xs text-charcoal/70 uppercase font-bold">Game PIN:</span>
              <span className="font-mono text-3xl font-bold tracking-wider text-charcoal">
                {roomCode || '...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 my-6 flex-grow flex flex-col md:flex-row items-stretch gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Participants list — bulletin board */}
        <div className="flex-1 card-pinned pin-green p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold text-charcoal">Joined Players</h2>
                <span className="px-3 py-1 bg-paper-blue text-white rounded-full text-xs font-bold shadow-pin">
                  {participants.length}
                </span>
              </div>
              <p className="text-sm text-pencil font-medium animate-pulse-soft">Waiting for players...</p>
            </div>

            {participants.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-card bg-cork-100 flex items-center justify-center mb-4 text-pencil/40">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <p className="text-pencil text-base font-medium">Scan QR code or use PIN to enter room!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-2">
                {participants.map((participant, i) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 p-3 rounded-card bg-paper-white border border-cork-200 shadow-card hover:shadow-card-hover transition-shadow animate-slide-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <AvatarIcon name={participant.nickname} size={40} />
                      <span className="font-body font-semibold text-sm truncate text-charcoal">
                        {participant.nickname}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-cork-200 flex justify-end">
            <button
              onClick={onClickStartGame}
              disabled={participants.length === 0}
              className="btn btn-success w-full md:w-auto px-10 py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Game ({participants.length})
            </button>
          </div>
        </div>

        {/* Right Side: QR Code Card — pinned */}
        <div className="w-full md:w-80 card-pinned pin-yellow p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-paper-white rounded-card shadow-inner mb-4 border border-cork-200">
            {baseUrl && roomCode && (
              <Canvas
                text={`${baseUrl}/game/join?room=${encodeURIComponent(roomCode)}`}
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 2,
                  scale: 4,
                  width: 220,
                }}
              />
            )}
          </div>
          <p className="text-xs text-pencil font-medium max-w-[200px]">
            Scan with phone camera to join immediately
          </p>
        </div>
      </main>
    </div>
  )
}
