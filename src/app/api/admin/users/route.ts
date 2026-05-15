import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, hashPassword } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'

const createUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).default(UserRole.CANDIDAT),
  emailVerified: z.boolean().default(true),
  isActive: z.boolean().default(true),
})

export async function POST(request: Request) {
  const currentUser = await getCurrentUser()
  if (!currentUser || !hasPermission(currentUser, Permission.MANAGE_USERS)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 403 })
  }

  const body = await request.json()
  const data = createUserSchema.parse(body)

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        ...(data.phone ? [{ phone: data.phone }] : []),
      ],
    },
    select: { email: true, phone: true },
  })

  if (existing?.email === data.email) {
    return NextResponse.json({ error: 'Un compte existe deja avec cet email.' }, { status: 409 })
  }

  if (data.phone && existing?.phone === data.phone) {
    return NextResponse.json({ error: 'Un compte existe deja avec ce telephone.' }, { status: 409 })
  }

  const passwordHash = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      passwordHash,
      role: data.role,
      emailVerified: data.emailVerified,
      isActive: data.isActive,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      emailVerified: true,
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: currentUser.id,
      action: 'USER_ADMIN_CREATE',
      details: `Utilisateur ${user.email} cree avec le role ${user.role}`,
    },
  })

  return NextResponse.json(user, { status: 201 })
}
