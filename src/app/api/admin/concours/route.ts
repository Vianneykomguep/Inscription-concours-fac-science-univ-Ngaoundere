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

export async function POST(req: Request) {
  try {

    const user = await getCurrentUser()

    if (!user || user.role === 'CANDIDAT') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await req.json()

    console.log("🔥 BODY REÇU:", body)

    const data = concoursSchema.parse(body)

    const concours = await prisma.concours.create({
      data: {
        titre: data.titre,
        description: data.description,
        departement: data.departement,

        nombrePlaces: Number(data.nombrePlaces),

        fraisInscription: Number(data.fraisInscription),

        dateOuverture: new Date(data.dateOuverture),
        dateCloture: new Date(data.dateCloture),

        dateConcours: data.dateConcours
          ? new Date(data.dateConcours)
          : null,

        dateResultats: data.dateResultats
          ? new Date(data.dateResultats)
          : null,

        conditionsAdmission: data.conditionsAdmission ?? null,
        guideUrl: data.guideUrl ?? null,

        createdBy: user.id,
      },
    })

    return NextResponse.json(concours, { status: 201 })

  } catch (error: any) {

    console.error("💥 ERREUR:", error)

    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      { status: 400 }
    )
  }
}