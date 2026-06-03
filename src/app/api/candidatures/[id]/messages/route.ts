import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const candidature = await prisma.candidature.findUnique({
      where: { id: params.id },
      include: { concours: true },
    })

    if (!candidature) {
      return NextResponse.json({ error: 'Candidature non trouvee' }, { status: 404 })
    }

    const isCandidateOwner = candidature.userId === user.id
    const canManageCandidatures = hasPermission(user, Permission.VIEW_CANDIDATURES)

    if (!isCandidateOwner && !canManageCandidatures) {
      return NextResponse.json({ error: 'Acces refuse' }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    const contenu = String(body.contenu || '').trim()

    if (contenu.length < 2) {
      return NextResponse.json({ error: 'Le message est trop court.' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        candidatureId: candidature.id,
        senderId: user.id,
        senderRole: user.role,
        contenu,
      },
      include: {
        sender: { select: { firstName: true, lastName: true, role: true } },
      },
    })

    const recipientId = isCandidateOwner ? candidature.concours.createdBy : candidature.userId
    if (recipientId && recipientId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
        type: isCandidateOwner ? 'MESSAGE_CANDIDAT' : 'MESSAGE_ADMIN',
        titre: isCandidateOwner ? 'Nouveau message candidat' : 'Nouveau message admin',
          contenu: `${user.firstName} ${user.lastName} a ajoute un message au dossier ${candidature.numeroDossier}.`,
        },
      })
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
