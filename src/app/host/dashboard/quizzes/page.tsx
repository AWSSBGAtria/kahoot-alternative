'use client'

import { QuizSet } from '@/types/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const PIN_CLASSES = ['pin', 'pin-blue', 'pin-green', 'pin-yellow', 'pin-purple']

export default function QuizzesPage() {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchQuizSets = async () => {
    try {
      const res = await fetch('/api/quiz-sets')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setQuizSets(data)
    } catch {
      setError('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizSets()
  }, [])

  const createQuizSet = async () => {
    if (!newName.trim()) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/quiz-sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      const quizSet = await res.json()
      setQuizSets([{ ...quizSet, questions: [] }, ...quizSets])
      setNewName('')
      setNewDescription('')
      setShowCreate(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz')
    } finally {
      setCreating(false)
    }
  }

  const deleteQuizSet = async (id: string) => {
    try {
      const res = await fetch(`/api/quiz-sets/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setQuizSets(quizSets.filter((q) => q.id !== id))
      setDeleteConfirm(null)
    } catch {
      setError('Failed to delete quiz')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-pencil">
          <div className="w-5 h-5 border-2 border-paper-blue/30 border-t-paper-blue rounded-full animate-spin-slow" />
          Loading quizzes...
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">Quiz Sets</h1>
          <p className="text-pencil text-sm mt-1">Create and manage your quiz content</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Quiz
        </button>
      </div>

      {/* Create form — pinned card */}
      {showCreate && (
        <div className="card-pinned pin p-6 mb-6 animate-slide-up">
          <h3 className="font-body font-semibold mb-4 text-charcoal">Create New Quiz Set</h3>
          <input
            type="text"
            placeholder="Quiz name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="input mb-3"
            maxLength={100}
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="input mb-4 resize-none"
            rows={2}
            maxLength={500}
          />
          <div className="flex gap-2">
            <button
              onClick={createQuizSet}
              disabled={creating || !newName.trim()}
              className="btn btn-success disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewName(''); setNewDescription('') }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quiz list */}
      {quizSets.length === 0 && !showCreate ? (
        <div className="card-pinned pin p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-card bg-cork-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-pencil/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-pencil text-sm mb-4">No quiz sets yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="text-sm font-semibold text-paper-blue hover:text-tacker-blue btn-ghost"
          >
            Create your first quiz
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {quizSets.map((quizSet, i) => (
            <div
              key={quizSet.id}
              className={`card-pinned ${PIN_CLASSES[i % PIN_CLASSES.length]} p-5 animate-slide-up`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-card bg-gradient-to-br from-paper-blue to-paper-purple flex items-center justify-center shadow-pin">
                    <span className="font-display font-bold text-lg text-white">
                      {quizSet.questions.length}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-body font-semibold text-charcoal">{quizSet.name}</h2>
                    {quizSet.description && (
                      <p className="text-pencil text-sm mt-0.5 line-clamp-1">{quizSet.description}</p>
                    )}
                    <p className="text-pencil/60 text-xs mt-1">
                      {quizSet.questions.length} question{quizSet.questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/host/dashboard/quizzes/${quizSet.id}`}
                    className="btn btn-ghost text-xs px-3 py-1.5 text-paper-blue hover:bg-paper-blue/10"
                  >
                    Edit
                  </Link>
                  {deleteConfirm === quizSet.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteQuizSet(quizSet.id)}
                        className="btn btn-danger text-xs px-3 py-1.5"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn btn-ghost text-xs px-3 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(quizSet.id)}
                      className="btn btn-ghost text-xs px-2 py-1.5 text-pencil hover:text-paper-red hover:bg-paper-red/10"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
