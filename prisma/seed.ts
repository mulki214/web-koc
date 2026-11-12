import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const db = new PrismaClient()
async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) before bootstrap')
  await db.user.upsert({ where: { email }, update: {}, create: { email, passwordHash: await hash(password, 12), role: Role.SUPER_ADMIN } })
  console.log('Admin user ready. No demo public content was inserted.')
}
main().finally(() => db.$disconnect())
