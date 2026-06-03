import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateOTP, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { sendEmail, otpEmailTemplate } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 })
    }

    const passwordHash = await hashPassword(data.password)
    const otp = generateOTP()
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        otpCode: otp,
        otpExpiresAt,
      }
    })

    const emailSent = await sendEmail(data.email, 'Vérification de votre compte', otpEmailTemplate(`${data.firstName} ${data.lastName}`, otp))
    const token = generateToken({ userId: user.id, email: user.email, role: user.role })
    const response = NextResponse.json({ success: true, requiresVerification: true, emailSent, warning: emailSent ? undefined : "Compte créé, mais l'email de vérification n'a pas pu être envoyé. Vérifiez la configuration SMTP puis utilisez Renvoyer le code." })
    response.cookies.set('auth-token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/',
    })
    return response
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
