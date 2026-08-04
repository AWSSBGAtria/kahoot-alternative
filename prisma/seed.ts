import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hashPassword } from '../src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@quiz.com' },
    update: {},
    create: {
      email: 'admin@quiz.com',
      passwordHash: adminPassword,
    },
  })
  console.log(`Created admin: ${admin.email}`)

  // Seed quiz sets
  const quizSets = [
    {
      id: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      name: 'GA Week Supabase Meetup Quiz',
      description: 'A quiz for the Supabase Meetup',
    },
    {
      id: '9a525135-cd91-4372-9171-02fc57c6713a',
      name: 'GA Week Supabase Meetup Quiz Español',
      description: 'Un cuestionario para el Supabase Meetup',
    },
    {
      id: 'ac8483a1-fb60-4d65-b898-58f830bbabdd',
      name: 'GA Week Supabase Meetup Quiz 日本語',
      description: 'A quiz for the Supabase Meetup in Japanese',
    },
    {
      id: '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab',
      name: 'Supabase Meetup Quiz Português',
      description: 'A quiz for the Supabase Meetup in Português',
    },
    {
      id: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      name: 'LW12 Meetup Quiz',
      description: 'A quiz for the LW12 Supabase Meetup',
    },
    {
      id: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      name: 'LW14 Meetup Quiz',
      description: 'A quiz for the LW14 Supabase Meetup',
    },
    {
      id: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      name: 'LW15 Meetup Quiz',
      description: 'A quiz for the LW15 Supabase Meetup',
    },
  ]

  const questions: Array<{
    quizSetId: string
    body: string
    order: number
    choices: Array<{ body: string; isCorrect: boolean }>
  }> = [
    // GA Week English
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'What was the original name of the programming language JavaScript?',
      order: 0,
      choices: [
        { body: 'Mocha', isCorrect: true },
        { body: 'LiveScript', isCorrect: false },
        { body: 'ECMAScript', isCorrect: false },
        { body: 'JScript', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'What does the acronym "API" stand for in the context of software development?',
      order: 1,
      choices: [
        { body: 'Application Programming Interface', isCorrect: true },
        { body: 'Automated Programming Instructions', isCorrect: false },
        { body: 'Advanced Program Integration', isCorrect: false },
        { body: 'Algorithmic Programming Interface', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'How many GitHub stars does the main supabase repo have?',
      order: 2,
      choices: [
        { body: '45k', isCorrect: false },
        { body: '55k', isCorrect: false },
        { body: '65k', isCorrect: true },
        { body: '75k', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'According to the Stack Overflow Survey 2022 what is the most popular database language amongst respondents?',
      order: 3,
      choices: [
        { body: 'PostgreSQL', isCorrect: true },
        { body: 'MySQL', isCorrect: false },
        { body: 'Microsoft SQL Server', isCorrect: false },
        { body: 'Excel', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'How many lines of code are there in Windows 10?',
      order: 4,
      choices: [
        { body: '500,000', isCorrect: false },
        { body: '5 million', isCorrect: false },
        { body: '50 million', isCorrect: true },
        { body: '500 million', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'What year was TypeScript released to the public?',
      order: 5,
      choices: [
        { body: '2001', isCorrect: false },
        { body: '2009', isCorrect: false },
        { body: '2012', isCorrect: true },
        { body: '2018', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'Which Supabase client library has the most usage across all projects?',
      order: 6,
      choices: [
        { body: 'Python', isCorrect: false },
        { body: 'Flutter', isCorrect: false },
        { body: 'Javascript', isCorrect: true },
        { body: 'SSR', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'Where is the company that builds the Opera Browser headquartered?',
      order: 7,
      choices: [
        { body: 'Denmark', isCorrect: false },
        { body: 'Norway', isCorrect: true },
        { body: 'Singapore', isCorrect: false },
        { body: 'Kenya', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'Who is the original author of React?',
      order: 8,
      choices: [
        { body: 'Steve Jobs', isCorrect: false },
        { body: 'Jordan Walke', isCorrect: true },
        { body: 'Dan Abramov', isCorrect: false },
        { body: 'Guido van Rossum', isCorrect: false },
      ],
    },
    {
      quizSetId: 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d',
      body: 'In ASCII what is the binary representation of an upper case W?',
      order: 9,
      choices: [
        { body: '01010111', isCorrect: true },
        { body: '11010111', isCorrect: false },
        { body: '01000111', isCorrect: false },
        { body: '01010101', isCorrect: false },
      ],
    },
    // LW12
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'What was the launch on day 1 of LW12?',
      order: 0,
      choices: [
        { body: 'VS Code extension', isCorrect: true },
        { body: 'Supabase goes GA', isCorrect: false },
        { body: 'postgres.new', isCorrect: true },
        { body: 'anonymous sign-in', isCorrect: false },
      ],
    },
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'How many GitHub stars does the main supabase repo have?',
      order: 1,
      choices: [
        { body: '40k', isCorrect: false },
        { body: '50k', isCorrect: false },
        { body: '60k', isCorrect: false },
        { body: '70k', isCorrect: true },
      ],
    },
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'According to the 2023 Stack Overflow developer survey, what is the most popular database?',
      order: 2,
      choices: [
        { body: 'MySQL', isCorrect: false },
        { body: 'Postgres', isCorrect: true },
        { body: 'Excel', isCorrect: false },
        { body: 'Microsoft SQL Server', isCorrect: false },
      ],
    },
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'Which product was the first product offered by Supabase?',
      order: 3,
      choices: [
        { body: 'Auto generated APIs', isCorrect: false },
        { body: 'Realtime', isCorrect: true },
        { body: 'Auth', isCorrect: false },
        { body: 'Storage', isCorrect: false },
      ],
    },
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'Which of the following client libraries is currently maintained by the community?',
      order: 4,
      choices: [
        { body: 'JavaScript', isCorrect: false },
        { body: 'Flutter(Dart)', isCorrect: false },
        { body: 'Swift', isCorrect: false },
        { body: 'Kotlin', isCorrect: true },
      ],
    },
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'How many different locations is the Supabase LW12 meetup being held at?',
      order: 5,
      choices: [
        { body: '10 - 20', isCorrect: false },
        { body: '20 - 30', isCorrect: false },
        { body: '30 - 40', isCorrect: false },
        { body: 'Over 40', isCorrect: true },
      ],
    },
    {
      quizSetId: 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f',
      body: 'What might you win when you create your LW12 ticket and share it on socials?',
      order: 6,
      choices: [
        { body: 'Supabase World Tour T-Shirt', isCorrect: true },
        { body: 'Mechanical Keyboard', isCorrect: false },
        { body: 'Supabase iPhone case', isCorrect: false },
        { body: 'Wandrd Backpack', isCorrect: true },
      ],
    },
    // LW14
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'According to the Stack Overflow Survey 2024 what is the most popular database language amongst respondents?',
      order: 0,
      choices: [
        { body: 'PostgreSQL', isCorrect: true },
        { body: 'MySQL', isCorrect: false },
        { body: 'Microsoft SQL Server', isCorrect: false },
        { body: 'Excel', isCorrect: false },
      ],
    },
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'How many GitHub stars does the main supabase repo have?',
      order: 1,
      choices: [
        { body: '50k', isCorrect: false },
        { body: '60k', isCorrect: false },
        { body: '70k', isCorrect: false },
        { body: '80k', isCorrect: true },
      ],
    },
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'Which HTTP status code indicates that a resource was not found?',
      order: 2,
      choices: [
        { body: '200', isCorrect: false },
        { body: '301', isCorrect: false },
        { body: '404', isCorrect: true },
        { body: '500', isCorrect: false },
      ],
    },
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'What does the acronym "API" stand for in software development?',
      order: 3,
      choices: [
        { body: 'Application Programming Interface', isCorrect: true },
        { body: 'Advanced Programming Integration', isCorrect: false },
        { body: 'Automated Process Implementation', isCorrect: false },
        { body: 'Application Process Integration', isCorrect: false },
      ],
    },
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'Which of the following companies use Postgres database?',
      order: 4,
      choices: [
        { body: 'Reddit', isCorrect: true },
        { body: 'Notion', isCorrect: true },
        { body: 'Figma', isCorrect: true },
        { body: 'Twitch', isCorrect: true },
      ],
    },
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'MCP, a protocol for connecting AI assistants to other systems stands for',
      order: 5,
      choices: [
        { body: 'Model Context Programming', isCorrect: false },
        { body: 'Model Context Protocol', isCorrect: true },
        { body: 'Machine Communication Protocol', isCorrect: false },
        { body: 'Multi Context Protocol', isCorrect: false },
      ],
    },
    {
      quizSetId: '8177fdea-a757-4939-9e0e-4b0e8e90dfb8',
      body: 'What year was TypeScript released to the public?',
      order: 6,
      choices: [
        { body: '2001', isCorrect: false },
        { body: '2009', isCorrect: false },
        { body: '2012', isCorrect: true },
        { body: '2018', isCorrect: false },
      ],
    },
    // LW15
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'How many GitHub stars does the main supabase repo have?',
      order: 0,
      choices: [
        { body: '55k', isCorrect: false },
        { body: '65k', isCorrect: false },
        { body: '75k', isCorrect: false },
        { body: '85k', isCorrect: true },
      ],
    },
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'According to the Stack Overflow Survey 2024 what is the most popular database language amongst respondents?',
      order: 1,
      choices: [
        { body: 'PostgreSQL', isCorrect: true },
        { body: 'MySQL', isCorrect: false },
        { body: 'Microsoft SQL Server', isCorrect: false },
        { body: 'Excel', isCorrect: false },
      ],
    },
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'Which HTTP status code indicates that a resource was not found?',
      order: 2,
      choices: [
        { body: '200', isCorrect: false },
        { body: '301', isCorrect: false },
        { body: '404', isCorrect: true },
        { body: '500', isCorrect: false },
      ],
    },
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'What does the acronym "API" stand for in software development?',
      order: 3,
      choices: [
        { body: 'Application Programming Interface', isCorrect: true },
        { body: 'Advanced Programming Integration', isCorrect: false },
        { body: 'Automated Process Implementation', isCorrect: false },
        { body: 'Application Process Integration', isCorrect: false },
      ],
    },
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'Which of the following companies use Postgres database?',
      order: 4,
      choices: [
        { body: 'Reddit', isCorrect: true },
        { body: 'Notion', isCorrect: true },
        { body: 'Figma', isCorrect: true },
        { body: 'Twitch', isCorrect: true },
      ],
    },
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'MCP, a protocol for connecting AI assistants to other systems stands for',
      order: 5,
      choices: [
        { body: 'Model Context Programming', isCorrect: false },
        { body: 'Model Context Protocol', isCorrect: true },
        { body: 'Machine Communication Protocol', isCorrect: false },
        { body: 'Multi Context Protocol', isCorrect: false },
      ],
    },
    {
      quizSetId: 'd4526cc6-6124-48c2-9b59-25fdccfc8643',
      body: 'What year was TypeScript released to the public?',
      order: 6,
      choices: [
        { body: '2001', isCorrect: false },
        { body: '2009', isCorrect: false },
        { body: '2012', isCorrect: true },
        { body: '2018', isCorrect: false },
      ],
    },
  ]

  for (const qs of quizSets) {
    await prisma.quizSet.upsert({
      where: { id: qs.id },
      update: { name: qs.name, description: qs.description },
      create: qs,
    })
  }
  console.log(`Seeded ${quizSets.length} quiz sets`)

  for (const q of questions) {
    const existing = await prisma.question.findUnique({
      where: { quizSetId_order: { quizSetId: q.quizSetId, order: q.order } },
      include: { choices: true },
    })

    if (existing) {
      // Delete old choices and recreate
      await prisma.choice.deleteMany({ where: { questionId: existing.id } })
      await prisma.question.update({
        where: { id: existing.id },
        data: {
          body: q.body,
          choices: {
            create: q.choices.map((c) => ({
              body: c.body,
              isCorrect: c.isCorrect,
            })),
          },
        },
      })
    } else {
      await prisma.question.create({
        data: {
          quizSetId: q.quizSetId,
          body: q.body,
          order: q.order,
          choices: {
            create: q.choices.map((c) => ({
              body: c.body,
              isCorrect: c.isCorrect,
            })),
          },
        },
      })
    }
  }
  console.log(`Seeded ${questions.length} questions with choices`)

  console.log('Seed complete!')
  console.log('Admin login: admin@quiz.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
