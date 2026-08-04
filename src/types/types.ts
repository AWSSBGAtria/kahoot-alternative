export interface Admin {
  id: string
  email: string
  createdAt: string
}

export interface QuizSet {
  id: string
  name: string
  description: string | null
  createdAt: string
  questions: Question[]
}

export interface Question {
  id: string
  body: string
  imageUrl: string | null
  order: number
  quizSetId: string
  createdAt: string
  choices: Choice[]
}

export interface Choice {
  id: string
  body: string
  isCorrect: boolean
  questionId: string
  createdAt: string
}

export interface Game {
  id: string
  quizSetId: string
  hostId: string
  roomCode: string
  phase: string
  currentQuestionSequence: number
  isAnswerRevealed: boolean
  createdAt: string
}

export interface Participant {
  id: string
  nickname: string
  gameId: string
  createdAt: string
}

export interface Answer {
  id: string
  participantId: string
  questionId: string
  choiceId: string | null
  score: number
  createdAt: string
}

export interface GameResult {
  rank: number
  participantId: string
  nickname: string
  totalScore: number
}

export interface LeaderboardData {
  currentQuestion: number
  totalQuestions: number
  totalAnswers: number
  totalParticipants: number
  answerCounts: Array<{ choiceId: string; count: number }>
  phase: string
  isAnswerRevealed: boolean
}
