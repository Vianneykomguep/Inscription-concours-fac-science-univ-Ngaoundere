import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123456', 12)
  await prisma.user.upsert({
    where: { email: 'admin@univ-ndere.cm' },
    update: {},
    create: {
      email: 'admin@univ-ndere.cm', passwordHash,
      firstName: 'Admin', lastName: 'Système',
      role: 'SUPER_ADMIN', emailVerified: true,
    },
  })
  console.log('✅ Admin créé: admin@univ-ndere.cm / admin123456')
}

main().catch(console.error).finally(() => prisma.$disconnect())
