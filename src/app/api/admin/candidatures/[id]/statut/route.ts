import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { sendEmail, statusChangeEmailTemplate } from '@/lib/email'
import { CANDIDATURE_STATUT_LABELS } from '@/lib/utils'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === 'CANDIDAT') return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

    const { statut, motif, complementInfo } = await request.json()

    if (statut === 'REJETEE' && !motif) {
      return NextResponse.json({ error: 'Un motif est requis pour le rejet' }, { status: 400 })
    }

    const candidature = await prisma.candidature.update({
      where: { id: params.id },
      data: {
        statut,
        ...(motif ? { motifRejet: motif } : {}),
        ...(complementInfo ? { complementInfo } : {}),
      },
      include: { user: true, concours: true },
    })

    // Send notification email
    await sendEmail(
      candidature.user.email,
      `Mise à jour de votre candidature - ${candidature.concours.titre}`,
      statusChangeEmailTemplate(
        `${candidature.user.firstName} ${candidature.user.lastName}`,
        candidature.concours.titre,
        CANDIDATURE_STATUT_LABELS[statut] || statut,
        motif
      )
    )

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: candidature.userId,
        type: 'STATUS_CHANGE',
        titre: `Candidature ${CANDIDATURE_STATUT_LABELS[statut] || statut}`,
        contenu: `Le statut de votre candidature au concours "${candidature.concours.titre}" a été mis à jour.`,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: { userId: user.id, action: `CANDIDATURE_STATUS_${statut}`, details: `Candidature ${candidature.numeroDossier} -> ${statut}. ${motif || ''}` },
    })

    return NextResponse.json(candidature)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
