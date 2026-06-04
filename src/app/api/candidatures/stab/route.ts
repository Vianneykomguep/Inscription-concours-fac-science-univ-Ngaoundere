import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, generateNumeroDossier } from '@/lib/auth'
import { uploadFile } from '@/lib/upload'
import { stabCandidatureSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const formData = await request.formData()
    const rawData = formData.get('data')

    if (typeof rawData !== 'string') {
      return NextResponse.json({ error: 'Données de candidature manquantes' }, { status: 400 })
    }

    const data = stabCandidatureSchema.parse(JSON.parse(rawData))

    const concours = await prisma.concours.findFirst({
      where: {
        type: data.concoursType,
        isActive: true,
        statut: { in: ['PUBLIE', 'EN_COURS'] },
      },
      orderBy: { dateOuverture: 'desc' },
    })

    if (!concours) {
      return NextResponse.json(
        { error: "Aucun concours actif n'est configuré pour ce formulaire." },
        { status: 400 },
      )
    }

    if (new Date() > concours.dateCloture) {
      return NextResponse.json({ error: 'Les inscriptions sont clôturées pour ce concours.' }, { status: 400 })
    }

    const existing = await prisma.candidature.findFirst({
      where: { userId: user.id, concoursId: concours.id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Vous avez déjà soumis une candidature pour ce concours.' },
        { status: 409 },
      )
    }

    const numeroDossier = generateNumeroDossier(data.concoursType.replaceAll('_', '-'))
    const candidature = await prisma.candidature.create({
      data: {
        userId: user.id,
        concoursId: concours.id,
        type: data.concoursType,
        filiere: data.filiere,
        centre: data.centre,
        informations: data,
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: new Date(data.dateNaissance),
        lieuNaissance: data.lieuNaissance,
        sexe: data.genre,
        nationalite: data.nationalite,
        telephone: data.telephone || null,
        dernierDiplome: data.academic.diplomeAcces || data.academic.licence || data.academic.licenceProfessionnelle || data.academic.anneeBac || null,
        etablissement: data.academic.etablissement || null,
        anneeObtention: data.academic.anneeObtention ? Number(data.academic.anneeObtention) : null,
        mention: data.academic.mention || data.academic.mentionBac || null,
        statut: 'SOUMISE',
        submittedAt: new Date(),
        numeroDossier,
        numeroRecepisse: numeroDossier,
      },
    })

    const uploadedDocuments = []

    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) continue

      const type = key === 'photo' ? 'photo' : key.startsWith('document:') ? key.replace('document:', '') : null
      if (!type) continue

      const uploaded = await uploadFile(value, `candidatures/${candidature.id}`)
      uploadedDocuments.push({
        candidatureId: candidature.id,
        type,
        fileUrl: uploaded.url,
      })
    }

    if (uploadedDocuments.length > 0) {
      await prisma.uploadedDocument.createMany({ data: uploadedDocuments })
    }

    return NextResponse.json({
      candidatureId: candidature.id,
      receipt: {
        numeroDossier,
        dateDepot: new Date().toLocaleDateString('fr-FR'),
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        lieuNaissance: data.lieuNaissance,
        filiere: data.filiere,
        centre: data.centre,
        signatureCandidat: data.signatureCandidat,
        message: "Votre dossier a bien ete depose. Le recepisse officiel sera envoye par email apres validation administrative.",
      },
    }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }

    console.error('Create STAB candidature error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
