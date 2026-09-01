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
  // Create admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@awsatria.tech'
  const adminPasswordPlain = process.env.ADMIN_PASSWORD

  if (adminPasswordPlain) {
    const adminPassword = await hashPassword(adminPasswordPlain)
    const admin = await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: adminPassword,
      },
      create: {
        email: adminEmail,
        passwordHash: adminPassword,
      },
    })
    console.log(`Seeded admin: ${admin.email}`)
  } else {
    console.log('ADMIN_PASSWORD not set in environment. Skipping admin seed.')
  }

  // Seed quiz sets (empty by default for fresh custom quizzes)
  const quizSets: Array<{ id: string; name: string; description?: string }> = []
  const questions: Array<{
    quizSetId: string
    body: string
    order: number
    choices: Array<{ body: string; isCorrect: boolean }>
  }> = []

  for (const qs of quizSets) {
    await prisma.quizSet.upsert({
      where: { id: qs.id },
      update: { name: qs.name, description: qs.description },
      create: qs,
    })
  }
  if (quizSets.length > 0) {
    console.log(`Seeded ${quizSets.length} quiz sets`)
  }

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
  if (questions.length > 0) {
    console.log(`Seeded ${questions.length} questions with choices`)
  }

  console.log('Seed complete!')
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
