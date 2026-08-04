'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/host/dashboard')
      router.refresh()
    } catch {
      setError('Network error — check your connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cork-texture relative">
      {/* Decorative paper scraps — bolder colors */}
      <div className="absolute top-8 left-8 w-24 h-16 bg-paper-yellow rounded-card shadow-pin rotate-[-6deg] opacity-50 hidden lg:block" />
      <div className="absolute top-16 right-12 w-20 h-14 bg-paper-blue rounded-card shadow-pin rotate-[4deg] opacity-40 hidden lg:block" />
      <div className="absolute bottom-12 left-16 w-18 h-12 bg-paper-green rounded-card shadow-pin rotate-[-3deg] opacity-40 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-22 h-16 bg-paper-red rounded-card shadow-pin rotate-[5deg] opacity-35 hidden lg:block" />
      <div className="absolute top-1/3 left-4 w-16 h-10 bg-paper-purple rounded-card shadow-pin rotate-[8deg] opacity-30 hidden lg:block" />
      <div className="absolute bottom-1/4 right-4 w-14 h-10 bg-paper-pink rounded-card shadow-pin rotate-[-5deg] opacity-30 hidden lg:block" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo area — pinned card */}
        <div className="card-pinned pin p-6 text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-card bg-paper-white flex items-center justify-center shadow-pin">
            <img src="/program_icon.svg" alt="SBG Quiz" className="w-10 h-10" />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal">SBG <span className="text-paper-blue">Quiz</span></h1>
          <p className="text-pencil text-sm mt-1">Host Admin Panel</p>
        </div>

        {/* Login form — pinned card */}
        <div className="card-pinned pin-blue p-8">
          <h2 className="font-display text-xl font-semibold mb-6 text-charcoal">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-paper-red/10 border-2 border-paper-red/20 rounded-card px-4 py-3 text-sm font-medium text-paper-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
