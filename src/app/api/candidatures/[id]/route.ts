import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const candidature = await prisma.candidature.findUnique({
      where: { id: params.id },
      include: {
        concours: { include: { documentsRequis: true } },
        documents: true, paiements: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!candidature || (user.role === 'CANDIDAT' && candidature.userId !== user.id)) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 })
    }
    return NextResponse.json(candidature)
  } catch (error) {
    console.error('Get candidature error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const candidature = await prisma.candidature.findUnique({ where: { id: params.id } })
    if (!candidature || candidature.userId !== user.id) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 })
    }
    if (!['BROUILLON', 'COMPLEMENT_DEMANDE'].includes(candidature.statut)) {
      return NextResponse.json({ error: 'Cette candidature ne peut plus être modifiée' }, { status: 400 })
    }
    const body = await request.json()
    const updated = await prisma.candidature.update({
      where: { id: params.id },
      data: { ...body, ...(body.submit ? { statut: 'SOUMISE', soumisLe: new Date() } : {}) },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update candidature error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
