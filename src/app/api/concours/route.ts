import { NextResponse } from 'next/server'
import { hasDatabaseUrl, prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!hasDatabaseUrl) {
    return NextResponse.json([])
  }

  try {
    const concours = await prisma.concours.findMany({
      where: { statut: { in: ['PUBLIE', 'EN_COURS'] } },
      include: { documentsRequis: true, _count: { select: { candidatures: true } } },
      orderBy: { dateCloture: 'asc' },
    })
    return NextResponse.json(concours)
  } catch (error) {
    console.error('Get concours error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
