import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, getCurrentUser } from '@/lib/auth'
import { otpEmailTemplate, sendEmail } from '@/lib/email'

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    if (dbUser.emailVerified) return NextResponse.json({ success: true, message: 'Email déjà vérifié' })

    const otp = generateOTP()
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { otpCode: otp, otpExpiresAt },
    })

    const emailSent = await sendEmail(
      dbUser.email,
      'Nouveau code de vérification',
      otpEmailTemplate(`${dbUser.firstName} ${dbUser.lastName}`, otp),
    )

    if (!emailSent) {
      return NextResponse.json(
        { error: "Impossible d'envoyer le code. Vérifiez la configuration SMTP." },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
