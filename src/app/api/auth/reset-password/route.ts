import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const code = String(otp || '').trim()
    const nextPassword = String(password || '')

    if (!normalizedEmail || !code || !nextPassword) {
      return NextResponse.json({ error: 'Email, code et nouveau mot de passe sont requis' }, { status: 400 })
    }

    if (nextPassword.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (
      !user ||
      !user.passwordResetCode ||
      !user.passwordResetExpiresAt ||
      user.passwordResetCode !== code ||
      user.passwordResetExpiresAt < new Date()
    ) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(nextPassword),
        passwordResetCode: null,
        passwordResetExpiresAt: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
