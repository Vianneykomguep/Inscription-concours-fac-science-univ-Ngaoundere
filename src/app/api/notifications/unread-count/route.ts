import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ count: 0 }, { status: 401 })

    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        lu: false,
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ count: 0, error: 'Erreur serveur' }, { status: 500 })
  }
}
