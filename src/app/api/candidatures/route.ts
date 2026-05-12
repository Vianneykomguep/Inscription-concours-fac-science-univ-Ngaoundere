import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, generateNumeroDossier } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const candidatures = await prisma.candidature.findMany({
      where: { userId: user.id },
      include: {
        concours: { select: { titre: true, departement: true, dateConcours: true } },
        documents: true,
        paiements: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(candidatures)
  } catch (error) {
    console.error('Get candidatures error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { concoursId } = await request.json()
    
    const concours = await prisma.concours.findUnique({ where: { id: concoursId } })
    if (!concours || concours.statut !== 'PUBLIE') {
      return NextResponse.json({ error: 'Concours non disponible' }, { status: 400 })
    }

    if (new Date() > concours.dateCloture) {
      return NextResponse.json({ error: 'Les inscriptions sont clôturées' }, { status: 400 })
    }

    const existing = await prisma.candidature.findFirst({
      where: { userId: user.id, concoursId },
    })
    if (existing) {
      return NextResponse.json({ error: 'Vous avez déjà une candidature pour ce concours', candidatureId: existing.id }, { status: 409 })
    }

    const candidature = await prisma.candidature.create({
      data: {
        userId: user.id,
        concoursId,
        type: concours.type,
        filiere: '',
        centre: '',
        informations: {},
        numeroDossier: generateNumeroDossier(),
      },
    })

    return NextResponse.json(candidature, { status: 201 })
  } catch (error) {
    console.error('Create candidature error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
