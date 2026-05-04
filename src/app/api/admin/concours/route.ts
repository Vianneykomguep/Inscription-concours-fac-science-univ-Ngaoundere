import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { concoursSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === 'CANDIDAT') return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    const concours = await prisma.concours.findMany({
      include: { _count: { select: { candidatures: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(concours)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !['SUPER_ADMIN', 'RESPONSABLE'].includes(user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
    const body = await request.json()
    const data = concoursSchema.parse(body)
    const concours = await prisma.concours.create({
      data: {
        ...data,
        fraisInscription: data.fraisInscription,
        dateOuverture: new Date(data.dateOuverture),
        dateCloture: new Date(data.dateCloture),
        dateConcours: data.dateConcours ? new Date(data.dateConcours) : null,
        dateResultats: data.dateResultats ? new Date(data.dateResultats) : null,
        guideUrl: data.guideUrl,
        conditionsAdmission: data.conditionsAdmission,
        createdBy: user.id,
      },
    })
    return NextResponse.json(concours, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
