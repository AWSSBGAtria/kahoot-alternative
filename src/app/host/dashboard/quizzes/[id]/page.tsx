'use client'

import { Question, QuizSet } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface QuestionForm {
  id?: string
  body: string
  imageUrl: string
  choices: { body: string; isCorrect: boolean }[]
}

const EMPTY_QUESTION: QuestionForm = {
  body: '',
  imageUrl: '',
  choices: [
    { body: '', isCorrect: true },
    { body: '', isCorrect: false },
    { body: '', isCorrect: false },
    { body: '', isCorrect: false },
  ],
}

const CHOICE_ACCENTS = [
  { dot: 'bg-paper-red', ring: 'ring-paper-red' },
  { dot: 'bg-paper-blue', ring: 'ring-paper-blue' },
  { dot: 'bg-paper-yellow', ring: 'ring-paper-yellow' },
  { dot: 'bg-paper-green', ring: 'ring-paper-green' },
]

export default function QuizDetailPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [questionForm, setQuestionForm] = useState<QuestionForm>({ ...EMPTY_QUESTION })
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchQuizSet = async () => {
    try {
      const res = await fetch(`/api/quiz-sets/${id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setQuizSet(data)
      setName(data.name)
      setDescription(data.description || '')
    } catch {
      setError('Failed to load quiz')
      router.push('/host/dashboard/quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizSet()
  }, [id])

  const updateQuizSet = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/quiz-sets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setQuizSet((prev) =>
        prev ? { ...prev, name: name.trim(), description: description.trim() } : prev
      )
      setEditingName(false)
    } catch {
      setError('Failed to update quiz')
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = async () => {
    if (!questionForm.body.trim()) return
    const validChoices = questionForm.choices.filter((c) => c.body.trim())
    if (validChoices.length < 2) {
      setError('At least 2 choices are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/quiz-sets/${id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: questionForm.body.trim(),
          imageUrl: questionForm.imageUrl.trim() || null,
          order: quizSet?.questions.length || 0,
          choices: validChoices,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      const newQuestion = await res.json()
      setQuizSet((prev) =>
        prev ? { ...prev, questions: [...prev.questions, newQuestion] } : prev
      )
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add question')
    } finally {
      setSaving(false)
    }
  }

  const updateQuestion = async (questionId: string) => {
    if (!questionForm.body.trim()) return
    const validChoices = questionForm.choices.filter((c) => c.body.trim())
    if (validChoices.length < 2) {
      setError('At least 2 choices are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: questionForm.body.trim(),
          imageUrl: questionForm.imageUrl.trim() || null,
          choices: validChoices,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      const updated = await res.json()
      setQuizSet((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.map((q) =>
                q.id === questionId ? { ...q, ...updated } : q
              ),
            }
          : prev
      )
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update question')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuestion = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setQuizSet((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions
                .filter((q) => q.id !== questionId)
                .map((q, i) => ({ ...q, order: i })),
            }
          : prev
      )
      setDeleteConfirm(null)
    } catch {
      setError('Failed to delete question')
    }
  }

  const startEditQuestion = (question: Question) => {
    setEditingQuestion(question.id)
    setQuestionForm({
      id: question.id,
      body: question.body,
      imageUrl: question.imageUrl || '',
      choices: question.choices.map((c) => ({ body: c.body, isCorrect: c.isCorrect })),
    })
    setShowAddQuestion(false)
  }

  const resetForm = () => {
    setQuestionForm({ ...EMPTY_QUESTION })
    setShowAddQuestion(false)
    setEditingQuestion(null)
  }

  const updateChoice = (index: number, field: 'body' | 'isCorrect', value: string | boolean) => {
    setQuestionForm((prev) => ({
      ...prev,
      choices: prev.choices.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-pencil">
          <div className="w-5 h-5 border-2 border-cork-200 border-t-cork-500 rounded-full animate-spin" />
          Loading quiz...
        </div>
      </div>
    )
  }

  if (!quizSet) return null

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/host/dashboard/quizzes"
        className="flex items-center gap-1.5 text-pencil hover:text-charcoal text-sm mb-6 transition-colors w-fit"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to quizzes
      </Link>

      {/* Error banner */}
      {error && (
        <div className="mb-6">
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="ml-2 font-bold underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Quiz header — pinned card */}
      <div className="card-pinned pin p-6 mb-6">
        {editingName ? (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input text-lg font-body font-semibold mb-3"
              maxLength={100}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none mb-4"
              rows={2}
              placeholder="Description (optional)"
              maxLength={500}
            />
            <div className="flex gap-2">
              <button
                onClick={updateQuizSet}
                disabled={saving || !name.trim()}
                className="btn btn-primary text-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditingName(false); setName(quizSet.name); setDescription(quizSet.description || '') }}
                className="px-4 py-2 rounded-card text-pencil hover:text-charcoal text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-charcoal">{quizSet.name}</h1>
              {quizSet.description && <p className="text-pencil mt-1">{quizSet.description}</p>}
            </div>
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-paper-cream border border-cork-200 text-pencil text-xs transition-colors hover:text-charcoal hover:border-cork-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Questions header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-charcoal">
          Questions
          <span className="text-pencil text-sm font-normal ml-2">({quizSet.questions.length})</span>
        </h2>
        {!showAddQuestion && !editingQuestion && (
          <button
            onClick={() => { setShowAddQuestion(true); setQuestionForm({ ...EMPTY_QUESTION }) }}
            className="btn btn-primary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Question
          </button>
        )}
      </div>

      {/* Add question form */}
      {showAddQuestion && (
        <QuestionFormComponent
          form={questionForm}
          setForm={setQuestionForm}
          onSave={addQuestion}
          onCancel={resetForm}
          saving={saving}
          title="New Question"
          updateChoice={updateChoice}
        />
      )}

      {/* Questions — pinned cards */}
      <div className="space-y-3">
        {quizSet.questions.map((question, index) => (
          <div key={question.id} className="card-pinned p-5">
            {editingQuestion === question.id ? (
              <QuestionFormComponent
                form={questionForm}
                setForm={setQuestionForm}
                onSave={() => updateQuestion(question.id)}
                onCancel={resetForm}
                saving={saving}
                title={`Edit Question ${index + 1}`}
                updateChoice={updateChoice}
              />
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-paper-blue font-display font-bold text-sm">Q{index + 1}</span>
                      <h3 className="font-semibold text-charcoal">{question.body}</h3>
                    </div>
                    {question.imageUrl && (
                      <img
                        src={question.imageUrl}
                        alt=""
                        className="h-16 mt-2 rounded-card border border-cork-200 object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.choices.map((choice, ci) => (
                        <span
                          key={choice.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-card text-sm font-medium
                            ${choice.isCorrect
                              ? 'bg-paper-green/15 text-paper-green border border-paper-green/30'
                              : 'bg-paper-cream text-pencil border border-cork-200'
                            }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${CHOICE_ACCENTS[ci % 4].dot}`} />
                          {choice.body}
                          {choice.isCorrect && (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEditQuestion(question)}
                      className="p-2 rounded-card text-pencil hover:text-paper-blue hover:bg-paper-blue/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    {deleteConfirm === question.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="px-2.5 py-1.5 rounded-card bg-paper-red/10 text-paper-red text-xs font-medium transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2.5 py-1.5 rounded-card text-pencil text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(question.id)}
                        className="p-2 rounded-card text-pencil hover:text-paper-red hover:bg-paper-red/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {quizSet.questions.length === 0 && !showAddQuestion && (
        <div className="text-center py-16">
          <p className="text-pencil text-sm">No questions yet</p>
        </div>
      )}
    </div>
  )
}

function QuestionFormComponent({
  form, setForm, onSave, onCancel, saving, title, updateChoice,
}: {
  form: QuestionForm
  setForm: (fn: (prev: QuestionForm) => QuestionForm) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  title: string
  updateChoice: (index: number, field: 'body' | 'isCorrect', value: string | boolean) => void
}) {
  return (
    <div className="bg-paper-blue/5 border-2 border-paper-blue/20 rounded-card p-5 mb-3">
      <h3 className="font-body font-semibold text-sm text-paper-blue mb-4">{title}</h3>
      <input
        type="text"
        placeholder="Question text"
        value={form.body}
        onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
        className="input mb-3"
        maxLength={500}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={form.imageUrl}
        onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
        className="input mb-3"
        maxLength={2000}
      />
      {form.imageUrl && (
        <div className="mb-3">
          <img src={form.imageUrl} alt="Preview" className="h-20 rounded-card border border-cork-200 object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {form.choices.map((choice, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full shrink-0 ${CHOICE_ACCENTS[i % 4].dot} ${choice.isCorrect ? `ring-2 ring-offset-2 ring-offset-paper-cream ${CHOICE_ACCENTS[i % 4].ring}` : ''}`}
            />
            <input
              type="text"
              placeholder={`Choice ${i + 1}`}
              value={choice.body}
              onChange={(e) => updateChoice(i, 'body', e.target.value)}
              className="flex-1 input text-sm"
              maxLength={200}
            />
            <button
              type="button"
              onClick={() => updateChoice(i, 'isCorrect', !choice.isCorrect)}
              className={`px-2.5 py-1.5 rounded-card text-xs font-medium transition-colors shrink-0 ${
                choice.isCorrect
                  ? 'bg-paper-green/15 text-paper-green border border-paper-green/30'
                  : 'bg-paper-cream text-pencil border border-cork-200 hover:text-charcoal'
              }`}
            >
              {choice.isCorrect ? 'Correct' : 'Wrong'}
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn btn-primary text-sm"
        >
          {saving ? 'Saving...' : 'Save Question'}
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-card text-pencil hover:text-charcoal text-sm transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
