import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { uploadFile } from '@/lib/upload'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const candidature = await prisma.candidature.findUnique({
      where: { id: params.id },
      include: { concours: true },
    })

    if (!candidature || candidature.userId !== user.id) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 })
    }

    if (candidature.statut !== 'COMPLEMENT_DEMANDE') {
      return NextResponse.json(
        { error: "Cette candidature n'attend pas de complément." },
        { status: 400 },
      )
    }

    const formData = await request.formData()
    const reponse = String(formData.get('reponse') || '').trim()

    if (reponse.length < 5) {
      return NextResponse.json(
        { error: 'Ajoutez une réponse de quelques mots pour expliquer le complément fourni.' },
        { status: 400 },
      )
    }

    const uploadedDocuments = []

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith('file:') || !(value instanceof File) || value.size === 0) continue

      const type = key.replace('file:', '') || 'complement'
      const uploaded = await uploadFile(value, `candidatures/${candidature.id}`)
      uploadedDocuments.push({
        candidatureId: candidature.id,
        type,
        fileUrl: uploaded.url,
      })
    }

    await prisma.$transaction([
      ...(uploadedDocuments.length > 0
        ? [prisma.uploadedDocument.createMany({ data: uploadedDocuments })]
        : []),
      prisma.message.create({
        data: {
          candidatureId: candidature.id,
          senderId: user.id,
          senderRole: user.role,
          contenu: `Réponse au complément demandé : ${reponse}`,
        },
      }),
      prisma.candidature.update({
        where: { id: candidature.id },
        data: {
          statut: 'SOUMISE',
          complementInfo: null,
          submittedAt: new Date(),
          soumisLe: new Date(),
          commentaireAdmin: `Complément fourni par le candidat le ${new Date().toLocaleDateString('fr-FR')}.`,
        },
      }),
      prisma.notification.create({
        data: {
          userId: candidature.concours.createdBy,
          type: 'COMPLEMENT_RECU',
          titre: 'Complément reçu',
          contenu: `Le candidat ${user.firstName} ${user.lastName} a répondu au complément demandé pour ${candidature.concours.titre}.`,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
