import { NextResponse } from 'next/server'
import { CandidatureStatut } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user, Permission.PUBLISH_RESULTS)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 403 })
  }

  const body = await request.json()
  const candidatureId = String(body.candidatureId ?? '')
  const statutFinal = String(body.statutFinal ?? '')
    const note = body.note === '' || body.note === undefined ? null : Number(body.note)
    const rang = body.rang === '' || body.rang === undefined ? null : Number(body.rang)

  if (!candidatureId || !['ADMISSIBLE', 'ADMIS', 'NON_ADMIS'].includes(statutFinal)) {
    return NextResponse.json({ error: 'Donnees invalides' }, { status: 400 })
  }

  const candidature = await prisma.candidature.findUnique({
    where: { id: candidatureId },
    include: { concours: true },
  })

  if (!candidature) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.candidature.update({
      where: { id: candidatureId },
      data: { statut: statutFinal as CandidatureStatut },
    })

    return tx.resultat.create({
      data: {
        concoursId: updated.concoursId,
        candidatureId: updated.id,
        numeroDossier: updated.numeroDossier,
        nomComplet: `${updated.nom ?? ''} ${updated.prenom ?? ''}`.trim() || candidature.userId,
        statutFinal,
        note,
        rang,
        publishedAt: new Date(),
      },
    })
  })

  return NextResponse.json(result, { status: 201 })
}
