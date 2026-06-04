import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { CandidatureStatut } from '@prisma/client'
import { candidatureReceiptEmailTemplate, notificationEmailTemplate, sendEmail } from '@/lib/email'
import { CANDIDATURE_STATUT_LABELS } from '@/lib/utils'
import { allowedTransitions } from '@/lib/candidature-status'
import { getReceiptConfig, getReceiptFilePath } from '@/lib/receipts'
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
  motif: string
  complementInfo: string
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

    if (statut === 'COMPLEMENT_DEMANDE' && !complementInfo) {
      return NextResponse.json(
        {
          error:
            'Le complement demande doit etre precise'
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

          motifRejet:
            statut === 'REJETEE'
              ? motif
              : null,

          complementInfo:
            statut === 'COMPLEMENT_DEMANDE'
              ? complementInfo
              : null,

          ...(statut === 'VALIDEE'
            ? { validatedAt: new Date() }
            : {}),
        },

        include: {
          user: true,
          concours: true,
        },
      })

    let receiptEmailSent = false
    let receiptEmailAttempted = false
    if (statut === 'VALIDEE') {
      const receiptConfig = getReceiptConfig(candidature.type)
      const receiptPath = getReceiptFilePath(candidature.type)
      const receiptUrl = receiptConfig ? `${new URL('/', request.url).origin}${receiptConfig.url}` : undefined

      if (receiptConfig && receiptPath) {
        receiptEmailAttempted = true
        receiptEmailSent = await sendEmail(
          candidature.user.email,
          `Recepisse de candidature - ${candidature.concours.titre}`,
          candidatureReceiptEmailTemplate(
            `${candidature.prenom || candidature.user.firstName} ${candidature.nom || candidature.user.lastName}`.trim(),
            candidature.concours.titre,
            candidature.numeroDossier,
            receiptUrl,
          ),
          [
            {
              filename: receiptConfig.fileName,
              path: receiptPath,
              contentType: 'application/pdf',
            },
          ],
        )
      }
    }

    const notificationTitle = `Candidature ${CANDIDATURE_STATUT_LABELS[statut] || statut}`
    const notificationContent = `Le statut de votre candidature au concours "${candidature.concours.titre}" a ete mis a jour.${
      motif ? ` Motif : ${motif}` : ''
    }${complementInfo ? ` Complement demande : ${complementInfo}` : ''}${
      statut === 'VALIDEE'
        ? receiptEmailAttempted && receiptEmailSent
          ? ' Votre recepisse officiel a ete envoye par email.'
          : receiptEmailAttempted
            ? ' Votre dossier est valide. Le recepisse officiel sera transmis par email apres verification de la configuration email.'
            : ''
        : ''
    }`

    // Notification interne
    await prisma.notification.create({
      data: {
        userId: candidature.userId,

        type: 'STATUS_CHANGE',

        titre: notificationTitle,

        contenu: notificationContent,
      },
    })

    await sendEmail(
      candidature.user.email,
      `Nouvelle notification - ${notificationTitle}`,
      notificationEmailTemplate(
        `${candidature.user.firstName} ${candidature.user.lastName}`,
        notificationTitle,
        notificationContent
      )
    )
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
