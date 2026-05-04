import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import type { ConcoursStatut } from '@prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !['SUPER_ADMIN', 'RESPONSABLE'].includes(user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const { statut } = body

    const validStatuts: ConcoursStatut[] = ['BROUILLON', 'PUBLIE', 'EN_COURS', 'CLOTURE', 'ARCHIVE']
    if (!validStatuts.includes(statut)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    const concours = await prisma.concours.update({
      where: { id: params.id },
      data: { statut },
    })

    return NextResponse.json(concours)
  } catch (error) {
    console.error('Erreur changement statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
