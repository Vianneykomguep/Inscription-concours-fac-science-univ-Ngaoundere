import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser()
  if (!currentUser || !hasPermission(currentUser, Permission.MANAGE_USERS)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 403 })
  }

  const body = await request.json()
  const data: Partial<{ role: UserRole; isActive: boolean; emailVerified: boolean }> = {}

  if (body.role !== undefined) {
    if (!Object.values(UserRole).includes(body.role)) {
      return NextResponse.json({ error: 'Role invalide' }, { status: 400 })
    }

    if (params.id === currentUser.id && body.role !== currentUser.role) {
      return NextResponse.json({ error: 'Vous ne pouvez pas modifier votre propre role.' }, { status: 400 })
    }

    data.role = body.role
  }

  if (body.isActive !== undefined) {
    if (params.id === currentUser.id && body.isActive === false) {
      return NextResponse.json({ error: 'Vous ne pouvez pas desactiver votre propre compte.' }, { status: 400 })
    }
    data.isActive = Boolean(body.isActive)
  }

  if (body.emailVerified !== undefined) {
    data.emailVerified = Boolean(body.emailVerified)
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      emailVerified: true,
      isActive: true,
      updatedAt: true,
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: currentUser.id,
      action: 'USER_ADMIN_UPDATE',
      details: `Utilisateur ${updated.email} mis a jour: ${JSON.stringify(data)}`,
    },
  })

  return NextResponse.json(updated)
}
