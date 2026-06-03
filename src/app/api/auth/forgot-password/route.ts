import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP } from '@/lib/auth'
import { passwordResetEmailTemplate, sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail) {
      return NextResponse.json({ error: "L'adresse email est requise" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user || !user.isActive) {
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, un code de réinitialisation sera envoyé.',
      })
    }

    const otp = generateOTP()
    const passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode: otp,
        passwordResetExpiresAt,
      },
    })

    const emailSent = await sendEmail(
      user.email,
      'Réinitialisation de votre mot de passe',
      passwordResetEmailTemplate(`${user.firstName} ${user.lastName}`, otp),
    )

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? 'Un code de réinitialisation vient d’être envoyé.'
        : "Le code a été généré, mais l'email n'a pas pu être envoyé. Vérifiez la configuration SMTP.",
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
