import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === 'CANDIDAT') return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const concoursId = searchParams.get('concoursId')
    const statut = searchParams.get('statut')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (concoursId) where.concoursId = concoursId
    if (statut) where.statut = statut
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { numeroDossier: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [candidatures, total] = await Promise.all([
      prisma.candidature.findMany({
        where,
        include: {
          concours: { select: { titre: true, departement: true } },
          user: { select: { email: true, phone: true } },
          documents: true, paiements: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.candidature.count({ where }),
    ])

    return NextResponse.json({ candidatures, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
