import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { concoursSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === 'CANDIDAT') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const concours = await prisma.concours.findUnique({
      where: { id: params.id },
    })

    if (!concours) {
      return NextResponse.json({ error: 'Concours non trouvé' }, { status: 404 })
    }

    return NextResponse.json(concours)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !['SUPER_ADMIN', 'RESPONSABLE'].includes(user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const data = concoursSchema.partial().parse(body)

    const updateData: any = {}

    if (data.titre !== undefined) updateData.titre = data.titre
    if (data.type !== undefined) updateData.type = data.type
    if (data.description !== undefined) updateData.description = data.description
    if (data.departement !== undefined) updateData.departement = data.departement
    if (data.filieres !== undefined) updateData.filieres = data.filieres
    if (data.centres !== undefined) updateData.centres = data.centres
    if (data.piecesRequises !== undefined) updateData.piecesRequises = data.piecesRequises
    if (data.nombrePlaces !== undefined) updateData.nombrePlaces = Number(data.nombrePlaces)
    if (data.fraisInscription !== undefined) updateData.fraisInscription = Number(data.fraisInscription)
    if (data.dateOuverture !== undefined) updateData.dateOuverture = new Date(data.dateOuverture)
    if (data.dateCloture !== undefined) updateData.dateCloture = new Date(data.dateCloture)
    if (data.dateConcours !== undefined) updateData.dateConcours = data.dateConcours ? new Date(data.dateConcours) : null
    if (data.dateResultats !== undefined) updateData.dateResultats = data.dateResultats ? new Date(data.dateResultats) : null
    if (data.conditionsAdmission !== undefined) updateData.conditionsAdmission = data.conditionsAdmission || null
    if (data.guideUrl !== undefined) updateData.guideUrl = data.guideUrl || null
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const concours = await prisma.concours.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(data.piecesRequises !== undefined
          ? {
              documentsRequis: {
                deleteMany: {},
                create: data.piecesRequises.map((piece, index) => ({
                  nom: piece,
                  ordre: index,
                  obligatoire: true,
                })),
              },
            }
          : {}),
      },
    })

    return NextResponse.json(concours)
  } catch (error: any) {
    console.error('Erreur PUT concours:', error)
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

    // Vérifier s'il y a des candidatures
    const candidatures = await prisma.candidature.count({
      where: { concoursId: params.id },
    })

    if (candidatures > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un concours avec des candidatures' },
        { status: 400 }
      )
    }

    await prisma.concours.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE concours:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
