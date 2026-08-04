'use client'

import { Participant } from '@/types/types'
import { FormEvent, useState } from 'react'

export default function Lobby({
  gameId,
  onRegisterCompleted,
}: {
  gameId: string
  onRegisterCompleted: (participant: Participant) => void
}) {
  return (
    <div className="bg-paper-cream flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-4">
        <Register gameId={gameId} onRegisterCompleted={onRegisterCompleted} />
      </div>
    </div>
  )
}

function Register({
  onRegisterCompleted,
  gameId,
}: {
  onRegisterCompleted: (player: Participant) => void
  gameId: string
}) {
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setError('')

    if (!nickname.trim()) {
      setError('Please enter a nickname')
      setSending(false)
      return
    }

    if (!roomCode.trim()) {
      setError('Please enter a room code')
      setSending(false)
      return
    }

    try {
      const res = await fetch(`/api/games/${gameId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          roomCode: roomCode.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setSending(false)
        return
      }

      onRegisterCompleted(data)
    } catch {
      setError('Network error')
      setSending(false)
    }
  }

  return (
    <div className="card-pinned pin p-8">
      <h2 className="font-display text-xl font-bold text-charcoal text-center mb-6">
        Join Game
      </h2>
      <form onSubmit={onFormSubmit}>
        <input
          className="input mb-3"
          type="text"
          onChange={(val) => setRoomCode(val.currentTarget.value)}
          placeholder="Room Code"
          maxLength={6}
        />
        <input
          className="input"
          type="text"
          onChange={(val) => setNickname(val.currentTarget.value)}
          placeholder="Nickname"
          maxLength={20}
        />
        {error && <p className="error-banner mt-3">{error}</p>}
        <button
          disabled={sending}
          className="btn btn-primary w-full mt-4"
        >
          {sending ? 'Joining...' : 'Join'}
        </button>
      </form>
    </div>
  )
}
