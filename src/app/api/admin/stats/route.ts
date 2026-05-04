import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === 'CANDIDAT') return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

    const [totalCandidatures, totalConcours, totalUsers, statsByStatus, statsByConcours] = await Promise.all([
      prisma.candidature.count(),
      prisma.concours.count(),
      prisma.user.count({ where: { role: 'CANDIDAT' } }),
      prisma.candidature.groupBy({ by: ['statut'], _count: true }),
      prisma.candidature.groupBy({ by: ['concoursId'], _count: true }),
    ])

    return NextResponse.json({ totalCandidatures, totalConcours, totalUsers, statsByStatus, statsByConcours })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
