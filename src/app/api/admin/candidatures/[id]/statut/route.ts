import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { CandidatureStatut } from '@prisma/client'
import { sendEmail, statusChangeEmailTemplate } from '@/lib/email'
import { CANDIDATURE_STATUT_LABELS } from '@/lib/utils'
import { allowedTransitions } from '@/lib/candidature-status'
import {
  Permission,
  hasPermission,
} from '@/lib/permissions'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
     const {
  statut,
  motif,
  complementInfo
}: {
  statut: CandidatureStatut
  motif?: string
  complementInfo?: string
} = await request.json()

    // Vérification utilisateur
   let requiredPermission: Permission

switch (statut) {

  case 'EN_COURS_EXAMEN':
    requiredPermission =
      Permission.REVIEW_CANDIDATURE
    break

  case 'COMPLEMENT_DEMANDE':
    requiredPermission =
      Permission.REQUEST_COMPLEMENT
    break

  case 'VALIDEE':

  case 'REJETEE':
    requiredPermission =
      Permission.VALIDATE_CANDIDATURE
    break

  case 'ADMISSIBLE':

  case 'ADMIS':

  case 'NON_ADMIS':
    requiredPermission =
      Permission.PUBLISH_RESULTS
    break

  default:
    return NextResponse.json(
      { error: 'Statut invalide' },
      { status: 400 }
    )
}

if (
  !user ||
  !hasPermission(user, requiredPermission)
) {
  return NextResponse.json(
    { error: 'Non autorisé' },
    { status: 403 }
  )
}
 


    // Vérification motif rejet
    if (statut === 'REJETEE' && !motif) {
      return NextResponse.json(
        {
          error:
            'Un motif est requis pour le rejet'
        },
        { status: 400 }
      )
    }

    // Récupération candidature actuelle
    const existingCandidature =
      await prisma.candidature.findUnique({
        where: { id: params.id },
        include: {
          user: true,
          concours: true,
        },
      })

    if (!existingCandidature) {
      return NextResponse.json(
        { error: 'Candidature non trouvée' },
        { status: 404 }
      )
    }

    // Vérification transition autorisée
    const allowed =
  allowedTransitions[existingCandidature.statut]

    if (!allowed.includes(statut)) {
      return NextResponse.json(
        {
          error: `Transition invalide : ${existingCandidature.statut} -> ${statut}`
        },
        { status: 400 }
      )
    }

    // Mise à jour candidature
    const candidature =
      await prisma.candidature.update({
        where: { id: params.id },

        data: {
          statut,

          ...(motif
            ? { motifRejet: motif }
            : {}),

          ...(complementInfo
            ? { complementInfo }
            : {}),

          ...(statut === 'VALIDEE'
            ? { validatedAt: new Date() }
            : {}),
        },

        include: {
          user: true,
          concours: true,
        },
      })

    // Email notification
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

    // Notification interne
    await prisma.notification.create({
      data: {
        userId: candidature.userId,

        type: 'STATUS_CHANGE',

        titre:
          `Candidature ${
            CANDIDATURE_STATUT_LABELS[statut] || statut
          }`,

        contenu:
          `Le statut de votre candidature au concours "${candidature.concours.titre}" a été mis à jour.`,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,

        action: `CANDIDATURE_STATUS_${statut}`,

        details:
          `Candidature ${candidature.numeroDossier} -> ${statut}. ${motif || ''}`,
      },
    })

    return NextResponse.json(candidature)

  } catch (error) {
    console.error(
      'Update candidature status error:',
      error
    )

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}